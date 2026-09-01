import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getProductInventory,
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
} from "@/server/orders";
import {
  uploadSlip,
  manualReviewTransaction,
  getOrderTransactions,
  getPendingReviewTransactions,
} from "@/server/transactions";
import type { CreateOrderInput } from "@/lib/validations/checkout";

// ============================================
// PRODUCTS QUERY OPTIONS
// ============================================

export const productsQueryOptions = (category?: string) =>
  queryOptions({
    queryKey: ["products", { category }],
    queryFn: () => getProducts({ data: { category } }),
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["products", id],
    queryFn: () => getProductById({ data: { id } }),
  });

export const productInventoryQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ["inventory", productId],
    queryFn: () => getProductInventory({ data: { productId } }),
  });

// ============================================
// ORDERS QUERY OPTIONS
// ============================================

export const orderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["orders", id],
    queryFn: () => getOrderById({ data: { id } }),
  });

export const userOrdersQueryOptions = (userId: string, page?: number, limit?: number) =>
  queryOptions({
    queryKey: ["orders", { userId, page, limit }],
    queryFn: () => getUserOrders({ data: { userId, page, limit } }),
  });

// ============================================
// TRANSACTIONS QUERY OPTIONS
// ============================================

export const orderTransactionsQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: ["transactions", { orderId }],
    queryFn: () => getOrderTransactions({ data: { orderId } }),
  });

export const pendingReviewTransactionsQueryOptions = () =>
  queryOptions({
    queryKey: ["transactions", "pending_review"],
    queryFn: () => getPendingReviewTransactions(),
  });

// ============================================
// CUSTOM HOOKS
// ============================================

export function useProducts(category?: string) {
  return useQuery(productsQueryOptions(category));
}

export function useProduct(id: string) {
  return useQuery(productQueryOptions(id));
}

export function useProductInventory(productId: string) {
  return useQuery(productInventoryQueryOptions(productId));
}

export function useOrder(id: string) {
  return useQuery(orderQueryOptions(id));
}

export function useUserOrders(userId: string, page?: number, limit?: number) {
  return useQuery(userOrdersQueryOptions(userId, page, limit));
}

export function useOrderTransactions(orderId: string) {
  return useQuery(orderTransactionsQueryOptions(orderId));
}

export function usePendingReviewTransactions() {
  return useQuery(pendingReviewTransactionsQueryOptions());
}

// ============================================
// MUTATION HOOKS
// ============================================

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder({ data: input }),
    onSuccess: (data) => {
      // Invalidate products query to update inventory
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      // Invalidate user orders query
      if (data.order.userId) {
        queryClient.invalidateQueries({ queryKey: ["orders", { userId: data.order.userId }] });
      }
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { orderId: string; status: string; notes?: string }) =>
      updateOrderStatus({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { orderId: string; userId: string }) => cancelOrder({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] });
      queryClient.invalidateQueries({ queryKey: ["orders", { userId: data.userId }] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useUploadSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { orderId: string; file: File; idempotencyKey: string }) =>
      uploadSlip({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", data.transaction.orderId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", { orderId: data.transaction.orderId }] });
    },
  });
}

export function useManualReviewTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { transactionId: string; action: "approve" | "reject"; rejectionReason?: string }) =>
      manualReviewTransaction({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", data.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", "pending_review"] });
      queryClient.invalidateQueries({ queryKey: ["orders", data.orderId] });
    },
  });
}
