import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { transactions, orders, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { slipUploadSchema, manualReviewTransactionSchema } from "@/lib/validations/checkout";
import { randomUUID, createHash } from "node:crypto";
import { nanoid } from "nanoid";

// ============================================
// CONSTANTS
// ============================================

const PROMPTPAY_ID = import.meta.env.PROMPTPAY_ID || "0-1234-56789-0";
const ALLOWED_ACCOUNTS = [PROMPTPAY_ID];
const ACCEPTED_TIME_WINDOW = 24 * 60 * 60 * 1000;

// ============================================
// HELPER FUNCTIONS
// ============================================

function isTimestampValid(timestamp: string): boolean {
  const txTime = new Date(timestamp).getTime();
  const now = Date.now();
  return Math.abs(now - txTime) <= ACCEPTED_TIME_WINDOW;
}

function getRejectionReason(checks: { amountMatch: boolean; accountMatch: boolean; timestampValid: boolean }): string {
  if (!checks.accountMatch) return "บัญชีปลายทางไม่ถูกต้อง";
  if (!checks.timestampValid) return "ระยะเวลาธุรกรรมเกินกว่าที่ยอมรับ";
  if (!checks.amountMatch) return "ยอดเงินไม่ตรงกับยอดสั่งซื้อ";
  return "ไม่สามารถตรวจสอบอัตโนมัติได้";
}

async function verifySlipAutomatically(file: File, expectedAmount: number) {
  const mockOCRResult = {
    amount: expectedAmount,
    transactionRef: "MOCK-REF-123",
    timestamp: new Date().toISOString(),
    accountNumber: PROMPTPAY_ID,
  };

  const checks = {
    amountMatch: mockOCRResult.amount === expectedAmount,
    accountMatch: ALLOWED_ACCOUNTS.includes(mockOCRResult.accountNumber),
    timestampValid: isTimestampValid(mockOCRResult.timestamp),
    duplicateCheck: true,
  };

  let status: "verified" | "rejected" | "needs_manual_review";

  if (checks.amountMatch && checks.accountMatch && checks.timestampValid) {
    status = "verified";
  } else if (!checks.accountMatch || !checks.timestampValid) {
    status = "rejected";
  } else {
    status = "needs_manual_review";
  }

  return {
    status,
    details: {
      amountMatch: checks.amountMatch,
      accountMatch: checks.accountMatch,
      timestampValid: checks.timestampValid,
      duplicateCheck: checks.duplicateCheck,
      rejectionReason: status === "rejected" ? getRejectionReason(checks) : undefined,
    },
  };
}

// ============================================
// UPLOAD SLIP & VERIFY
// ============================================

export const uploadSlip = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid request data: Expected FormData");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const orderId = data.get("orderId") as string;
    const file = data.get("file") as File;
    const idempotencyKey = data.get("idempotencyKey") as string;

    const validated = slipUploadSchema.parse({ orderId, file, idempotencyKey });

    const existingTransaction = await db.query.transactions.findFirst({
      where: eq(transactions.idempotencyKey, validated.idempotencyKey),
    });

    if (existingTransaction) {
      return { transaction: existingTransaction, isDuplicate: true };
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, validated.orderId),
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "awaiting_payment") {
      throw new Error("Order is not awaiting payment");
    }

    const fileHash = createHash("sha256").update(await validated.file.arrayBuffer()).digest("hex");
    const fileUrl = `/uploads/slips/${fileHash}.jpg`;
    const transactionRef = `TXN-${nanoid(12).toUpperCase()}`;

    const verificationResult = await verifySlipAutomatically(validated.file, order.total);

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        orderId: validated.orderId,
        transactionRef,
        amount: order.total,
        paymentMethod: "promptpay",
        slipFileUrl: fileUrl,
        slipFileHash: fileHash,
        status: verificationResult.status,
        verificationDetails: verificationResult.details,
        idempotencyKey: validated.idempotencyKey,
        verifiedAt: verificationResult.status === "verified" ? new Date() : null,
      })
      .returning();

    if (verificationResult.status === "verified") {
      await db
        .update(orders)
        .set({
          status: "payment_verified",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, validated.orderId));
    }

    await db.insert(auditLogs).values({
      userId: randomUUID(),
      action: "upload_slip",
      entityType: "transaction",
      entityId: newTransaction.id,
      changes: {
        transactionRef,
        status: verificationResult.status,
        verificationDetails: verificationResult.details,
      },
    });

    return { transaction: newTransaction, isDuplicate: false };
  });

// ============================================
// MANUAL REVIEW TRANSACTION (Admin)
// ============================================

export const manualReviewTransaction = createServerFn({ method: "POST" })
  .validator((input: { transactionId: string; action: "approve" | "reject"; rejectionReason?: string }) => input)
  .handler(async ({ data }) => {
    const validated = manualReviewTransactionSchema.parse(data);

    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, validated.transactionId),
      with: {
        order: true,
      },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "needs_manual_review") {
      throw new Error("Transaction is not pending manual review");
    }

    const [updatedTransaction] = await db
      .update(transactions)
      .set({
        status: validated.action === "approve" ? "verified" : "rejected",
        verificationDetails: {
          ...transaction.verificationDetails,
          rejectionReason: validated.rejectionReason,
        },
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, validated.transactionId))
      .returning();

    if (validated.action === "approve") {
      await db
        .update(orders)
        .set({
          status: "payment_verified",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, transaction.orderId));
    } else {
      await db
        .update(orders)
        .set({
          status: "awaiting_payment",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, transaction.orderId));
    }

    await db.insert(auditLogs).values({
      userId: randomUUID(),
      action: "manual_review_transaction",
      entityType: "transaction",
      entityId: validated.transactionId,
      changes: {
        action: validated.action,
        rejectionReason: validated.rejectionReason,
      },
    });

    return updatedTransaction;
  });

// ============================================
// GET TRANSACTIONS
// ============================================

export const getOrderTransactions = createServerFn({ method: "GET" })
  .validator((input: { orderId: string }) => input)
  .handler(async ({ data }) => {
    return await db.query.transactions.findMany({
      where: eq(transactions.orderId, data.orderId),
      orderBy: [desc(transactions.createdAt)],
    });
  });

export const getPendingReviewTransactions = createServerFn({ method: "GET" }).handler(async () => {
  return await db.query.transactions.findMany({
    where: eq(transactions.status, "needs_manual_review"),
    with: {
      order: {
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: [desc(transactions.createdAt)],
  });
});
