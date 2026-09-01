import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";

// ============================================
// USERS & AUTH
// ============================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().$type<"admin" | "farmer" | "customer">().default("customer"),
  consentGiven: boolean("consent_given").notNull().default(false),
  consentDate: timestamp("consent_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// ============================================
// PRODUCTS & INVENTORY
// ============================================

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nameTh: text("name_th").notNull(),
  price: integer("price").notNull(), // สตางค์
  unit: text("unit").notNull(),
  category: text("category").notNull().$type<"Leafy Greens" | "Herbs" | "Hydroponics">(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  descriptionTh: text("description_th").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index("products_category_idx").on(table.category),
  isActiveIdx: index("products_is_active_idx").on(table.isActive),
}));

export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  lotId: uuid("lot_id").references(() => lots.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull().default(0),
  reserved: integer("reserved").notNull().default(0),
  status: text("status").notNull().$type<"in_stock" | "low_stock" | "out_of_stock">().default("in_stock"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (table) => ({
  productIdIdx: index("inventory_product_id_idx").on(table.productId),
  lotIdIdx: index("inventory_lot_id_idx").on(table.lotId),
}));

// ============================================
// LOTS (ตามสเปก Feature 3)
// ============================================

export const lots = pgTable("lots", {
  id: uuid("id").primaryKey().defaultRandom(),
  lotCode: text("lot_code").notNull().unique(),
  plotId: text("plot_id").notNull(),
  plantingDate: timestamp("planting_date").notNull(),
  harvestDate: timestamp("harvest_date").notNull(),
  farmerId: uuid("farmer_id").notNull().references(() => users.id),
  certifications: jsonb("certifications").$type<string[]>().notNull().default([]),
  environmentalData: jsonb("environmental_data").$type<{
    temperature: number[];
    humidity: number[];
    soilMoisture: number[];
    timestamps: string[];
  }>().notNull().default({ temperature: [], humidity: [], soilMoisture: [], timestamps: [] }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  lotCodeIdx: uniqueIndex("lots_lot_code_idx").on(table.lotCode),
  farmerIdIdx: index("lots_farmer_id_idx").on(table.farmerId),
}));

// ============================================
// ORDERS & TRANSACTIONS
// ============================================

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => users.id),
  status: text("status").notNull().$type<
    "pending" | "awaiting_payment" | "payment_verified" | "processing" | "shipped" | "delivered" | "cancelled"
  >().default("pending"),
  subtotal: integer("subtotal").notNull(), // สตางค์
  shippingFee: integer("shipping_fee").notNull().default(0), // สตางค์
  total: integer("total").notNull(), // สตางค์
  shippingAddress: jsonb("shipping_address").notNull(),
  deliveryMethod: text("delivery_method").notNull().$type<"standard" | "express">(),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  statusIdx: index("orders_status_idx").on(table.status),
  orderNumberIdx: uniqueIndex("orders_order_number_idx").on(table.orderNumber),
}));

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  lotId: uuid("lot_id").references(() => lots.id),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(), // สตางค์
  totalPrice: integer("total_price").notNull(), // สตางค์
}, (table) => ({
  orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
  productIdIdx: index("order_items_product_id_idx").on(table.productId),
}));

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  transactionRef: text("transaction_ref").notNull().unique(),
  amount: integer("amount").notNull(), // สตางค์
  paymentMethod: text("payment_method").notNull().$type<"promptpay" | "bank_transfer">(),
  slipFileUrl: text("slip_file_url").notNull(),
  slipFileHash: text("slip_file_hash").notNull(),
  status: text("status").notNull().$type<"verified" | "rejected" | "needs_manual_review">().default("needs_manual_review"),
  verificationDetails: jsonb("verification_details").$type<{
    amountMatch: boolean;
    accountMatch: boolean;
    timestampValid: boolean;
    duplicateCheck: boolean;
    rejectionReason?: string;
  }>().notNull().default({
    amountMatch: false,
    accountMatch: false,
    timestampValid: false,
    duplicateCheck: false,
  }),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: uuid("verified_by").references(() => users.id),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index("transactions_order_id_idx").on(table.orderId),
  transactionRefIdx: uniqueIndex("transactions_transaction_ref_idx").on(table.transactionRef),
  idempotencyKeyIdx: uniqueIndex("transactions_idempotency_key_idx").on(table.idempotencyKey),
  statusIdx: index("transactions_status_idx").on(table.status),
}));

// ============================================
// SUBSCRIPTIONS (Feature 2)
// ============================================

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  planType: text("plan_type").notNull().$type<"weekly" | "biweekly" | "monthly">(),
  boxSize: text("box_size").notNull().$type<"S" | "M" | "L">(),
  status: text("status").notNull().$type<"active" | "paused" | "cancelled">().default("active"),
  deliveryDay: integer("delivery_day").notNull(), // 1-7 (Monday-Sunday)
  credits: integer("credits").notNull().default(0),
  startDate: timestamp("start_date").notNull(),
  nextDeliveryDate: timestamp("next_delivery_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
  statusIdx: index("subscriptions_status_idx").on(table.status),
}));

export const subscriptionDeliveries = pgTable("subscription_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  deliveryDate: timestamp("delivery_date").notNull(),
  status: text("status").notNull().$type<"scheduled" | "skipped" | "processing" | "shipped" | "delivered">().default("scheduled"),
  items: jsonb("items").$type<Array<{ productId: string; quantity: number }>>().notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  subscriptionIdIdx: index("subscription_deliveries_subscription_id_idx").on(table.subscriptionId),
  deliveryDateIdx: index("subscription_deliveries_delivery_date_idx").on(table.deliveryDate),
}));

// ============================================
// AUDIT LOGS
// ============================================

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // "order", "transaction", "inventory", "subscription"
  entityId: uuid("entity_id").notNull(),
  changes: jsonb("changes").notNull().default({}),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
  entityTypeIdx: index("audit_logs_entity_type_idx").on(table.entityType),
  entityIdIdx: index("audit_logs_entity_id_idx").on(table.entityId),
  createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
}));