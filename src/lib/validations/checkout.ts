import { z } from "zod";

// ============================================
// SHIPPING INFO SCHEMA
// ============================================

export const shippingInfoSchema = z.object({
  fullName: z.string().min(2, "ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  phone: z.string().regex(/^0\d{8,9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  address: z.string().min(10, "ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร"),
  subdistrict: z.string().min(2, "ตำบล/แขวงต้องระบุ"),
  district: z.string().min(2, "อำเภอ/เขตต้องระบุ"),
  province: z.string().min(2, "จังหวัดต้องระบุ"),
  postalCode: z.string().regex(/^\d{5}$/, "รหัสไปรษณีย์ต้อง 5 หลัก"),
  deliveryMethod: z.enum(["standard", "express"], {
    errorMap: () => ({ message: "วิธีการจัดส่งไม่ถูกต้อง" }),
  }),
  saveAddress: z.boolean().default(true),
  billingSameAsShipping: z.boolean().default(true),
});

export type ShippingInfoInput = z.infer<typeof shippingInfoSchema>;

// ============================================
// CART ITEM SCHEMA
// ============================================

export const cartItemSchema = z.object({
  productId: z.string().uuid("รหัสสินค้าไม่ถูกต้อง"),
  quantity: z.number().int().min(1, "จำนวนต้องอย่างน้อย 1"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

// ============================================
// ORDER CREATION SCHEMA
// ============================================

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "ตะกร้าต้องมีสินค้าอย่างน้อย 1 รายการ"),
  shippingInfo: shippingInfoSchema,
  idempotencyKey: z.string().uuid("รหัส idempotency ไม่ถูกต้อง"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// ============================================
// SLIP UPLOAD SCHEMA
// ============================================

export const slipUploadSchema = z.object({
  orderId: z.string().uuid("รหัสออเดอร์ไม่ถูกต้อง"),
  file: z
    .any()
    .refine((file) => file instanceof File, "ต้องอัปโหลดไฟล์")
    .refine((file) => {
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
      return allowedTypes.includes(file.type);
    }, "ไฟล์ต้องเป็น PNG, JPG หรือ PDF")
    .refine((file) => file.size <= 5 * 1024 * 1024, "ไฟล์ต้องไม่เกิน 5MB"),
  idempotencyKey: z.string().uuid("รหัส idempotency ไม่ถูกต้อง"),
});

export type SlipUploadInput = z.infer<typeof slipUploadSchema>;

// ============================================
// TRANSACTION VERIFICATION SCHEMA
// ============================================

export const transactionVerificationSchema = z.object({
  amount: z.number().int().positive("ยอดเงินต้องมากกว่า 0"),
  transactionRef: z.string().min(5, "รหัสอ้างอิงธุรกรรมต้องมีอย่างน้อย 5 ตัวอักษร"),
  timestamp: z.string().datetime("วันที่เวลาไม่ถูกต้อง"),
  accountNumber: z.string().min(5, "เลขบัญชีต้องมีอย่างน้อย 5 ตัวอักษร"),
});

export type TransactionVerificationInput = z.infer<typeof transactionVerificationSchema>;

// ============================================
// ORDER UPDATE SCHEMA (สำหรับ Admin)
// ============================================

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("รหัสออเดอร์ไม่ถูกต้อง"),
  status: z.enum([
    "pending",
    "awaiting_payment",
    "payment_verified",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ], { errorMap: () => ({ message: "สถานะไม่ถูกต้อง" }) }),
  notes: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ============================================
// TRANSACTION MANUAL REVIEW SCHEMA (สำหรับ Admin)
// ============================================

export const manualReviewTransactionSchema = z.object({
  transactionId: z.string().uuid("รหัสธุรกรรมไม่ถูกต้อง"),
  action: z.enum(["approve", "reject"], {
    errorMap: () => ({ message: "การกระทำไม่ถูกต้อง" }),
  }),
  rejectionReason: z.string().optional(),
});

export type ManualReviewTransactionInput = z.infer<typeof manualReviewTransactionSchema>;
