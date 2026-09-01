import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { orders, orderItems, inventory, products, transactions, auditLogs } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations/checkout";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";

// ============================================
// GET PRODUCTS
// ============================================

export const getProducts = createServerFn({ method: "GET" })
  .validator((input: { category?: string }) => input)
  .handler(async ({ data }) => {
    const productsData = await db.query.products.findMany({
      where: data.category
        ? eq(products.category, data.category as any)
        : undefined,
      orderBy: [products.createdAt],
    });

    return productsData;
  });

// ============================================
// GET PRODUCT BY ID
// ============================================

export const getProductById = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const product = await db.query.products.findFirst({
      where: eq(products.id, data.id),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  });

// ============================================
// GET INVENTORY FOR PRODUCT
// ============================================

export const getProductInventory = createServerFn({ method: "GET" })
  .validator((input: { productId: string }) => input)
  .handler(async ({ data }) => {
    const inventoryData = await db.query.inventory.findFirst({
      where: eq(inventory.productId, data.productId),
    });

    return inventoryData || null;
  });

// ============================================
// CREATE ORDER
// ============================================

export const createOrder = createServerFn({ method: "POST" })
  .validator((input: CreateOrderInput) => createOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const { items, shippingInfo, idempotencyKey } = data;

    // Check idempotency
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, idempotencyKey),
    });

    if (existingOrder) {
      return { order: existingOrder, isDuplicate: true };
    }

    // Calculate totals and check inventory
    let subtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const inventoryRecord = await db.query.inventory.findFirst({
        where: eq(inventory.productId, item.productId),
      });

      if (!inventoryRecord || inventoryRecord.quantity - inventoryRecord.reserved < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });
    }

    const shippingFee = shippingInfo.deliveryMethod === "express" ? 100 : 60;
    const total = subtotal + shippingFee;

    // Generate order number
    const orderNumber = `ORD-${nanoid(10).toUpperCase()}`;

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: randomUUID(), // จะเปลี่ยนเป็น user ID จริงหลังจากมี auth
        status: "pending",
        subtotal,
        shippingFee,
        total,
        shippingAddress: shippingInfo,
        deliveryMethod: shippingInfo.deliveryMethod,
      })
      .returning();

    // Create order items
    for (const itemData of orderItemsData) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        ...itemData,
      });
    }

    // Reserve inventory
    for (const item of items) {
      await db
        .update(inventory)
        .set({
          reserved: sql`${inventory.reserved} + ${item.quantity}`,
          lastUpdated: new Date(),
        })
        .where(eq(inventory.productId, item.productId));
    }

    // Create audit log
    await db.insert(auditLogs).values({
      userId: randomUUID(), // จะเปลี่ยนเป็น user ID จริงหลังจากมี auth
      action: "create_order",
      entityType: "order",
      entityId: newOrder.id,
      changes: { orderNumber, total, items: orderItemsData },
    });

    return { order: newOrder, isDuplicate: false };
  });

// ============================================
// GET ORDER BY ID
// ============================================

export const getOrderById = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, data.id),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  });

// ============================================
// GET ORDERS BY USER
// ============================================

export const getUserOrders = createServerFn({ method: "GET" })
  .validator((input: { userId: string; page?: number; limit?: number }) => input)
  .handler(async ({ data }) => {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, data.userId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
      limit,
      offset,
    });

    return userOrders;
  });

// ============================================
// UPDATE ORDER STATUS (Admin)
// ============================================

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((input: { orderId: string; status: string; notes?: string }) => input)
  .handler(async ({ data }) => {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: data.status as any,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, data.orderId))
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      userId: randomUUID(), // จะเปลี่ยนเป็น admin user ID
      action: "update_order_status",
      entityType: "order",
      entityId: data.orderId,
      changes: { status: data.status, notes: data.notes },
    });

    return updatedOrder;
  });

// ============================================
// CANCEL ORDER
// ============================================

export const cancelOrder = createServerFn({ method: "POST" })
  .validator((input: { orderId: string; userId: string }) => input)
  .handler(async ({ data }) => {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, data.orderId), eq(orders.userId, data.userId)),
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending" && order.status !== "awaiting_payment") {
      throw new Error("Cannot cancel order in current status");
    }

    // Release reserved inventory
    const orderItemsData = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, data.orderId),
    });

    for (const item of orderItemsData) {
      await db
        .update(inventory)
        .set({
          reserved: sql`${inventory.reserved} - ${item.quantity}`,
          lastUpdated: new Date(),
        })
        .where(eq(inventory.productId, item.productId));
    }

    // Update order status
    const [cancelledOrder] = await db
      .update(orders)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, data.orderId))
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      userId: data.userId,
      action: "cancel_order",
      entityType: "order",
      entityId: data.orderId,
      changes: { previousStatus: order.status },
    });

    return cancelledOrder;
  });
