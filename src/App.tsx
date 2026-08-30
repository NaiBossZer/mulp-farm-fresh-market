import { useMemo, useState } from "react";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetail from "./components/ProductDetail";
import ShoppingCart from "./components/ShoppingCart";
import ShippingAddress from "./components/ShippingAddress";
import PaymentSlip from "./components/PaymentSlip";
import {
  DEFAULT_SHIPPING_INFO,
  PRODUCTS,
  type CartItem,
  type Product,
  type ShippingInfo,
} from "./components/ecommerce.types";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<"catalog" | "shipping" | "payment">("catalog");

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[1], quantity: 1 },
    { product: PRODUCTS[3], quantity: 2 },
  ]);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(DEFAULT_SHIPPING_INFO);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );
  const shippingFee = shippingInfo.deliveryMethod === "express" ? 120 : 60;

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(20, item.quantity + quantity) } : item
        );
      }
      return [...current, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((current) => current.filter((item) => item.product.id !== productId));
      return;
    }
    setCartItems((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity: Math.min(20, quantity) } : item))
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const startCheckout = () => {
    setIsCartOpen(false);
    setCheckoutStep("shipping");
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      {/* 1. Main Content Zone */}
      {checkoutStep === "catalog" && (
        <>
          {selectedProduct ? (
            /* Screen 2: Product Detail */
            <ProductDetail
              product={selectedProduct}
              cartCount={cartCount}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={addToCart}
              onCartClick={() => setIsCartOpen(true)}
              onUserClick={() => alert("User profile feature coming soon!")}
            />
          ) : (
            /* Screen 1: Main Catalog */
            <ProductCatalog
              cartCount={cartCount}
              onSelectProduct={(product) => setSelectedProduct(product)}
              onCartClick={() => setIsCartOpen(true)}
              onUserClick={() => alert("User profile feature coming soon!")}
            />
          )}
        </>
      )}

      {/* Screen 4: Shipping Address */}
      {checkoutStep === "shipping" && (
        <ShippingAddress
          value={shippingInfo}
          onChange={setShippingInfo}
          onBack={() => setCheckoutStep("catalog")}
          onNext={() => setCheckoutStep("payment")}
        />
      )}

      {/* Screen 5: Payment Slip */}
      {checkoutStep === "payment" && (
        <PaymentSlip
          subtotal={subtotal}
          shipping={shippingFee}
          onBack={() => setCheckoutStep("shipping")}
          onConfirm={() => {
            alert("ชำระเงินเรียบร้อยแล้ว!");
            setCheckoutStep("catalog");
          }}
        />
      )}

      {/* 2. Screen 3: Cart Drawer Overlays On Right */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
            <ShoppingCart
              items={cartItems}
              onBack={() => setIsCartOpen(false)}
              onCheckout={startCheckout}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          </div>
        </div>
      )}
    </main>
  );
}