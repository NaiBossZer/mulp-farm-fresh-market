import { Minus, Plus, ShoppingCart as ShoppingCartIcon, Trash2, Truck, ChevronLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem } from "./ecommerce.types";

interface ShoppingCartProps {
  items: CartItem[];
  onBack: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const shippingFee = 60;

export default function ShoppingCart({ items, onBack, onCheckout, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + (items.length > 0 ? shippingFee : 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-[#002D62] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <div className="text-xs font-medium text-white/70">MAHIDOL SMART FARM</div>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <div className="flex items-center gap-2 text-[#F2A900]">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#F2A900] text-[#002D62]">1</span> Cart
            </div>
            <div className="h-px w-8 bg-white/30" />
            <div className="flex items-center gap-2 text-white/60">
              <span className="flex size-6 items-center justify-center rounded-full border border-white/30">2</span> Shipping
            </div>
            <div className="h-px w-8 bg-white/30" />
            <div className="flex items-center gap-2 text-white/60">
              <span className="flex size-6 items-center justify-center rounded-full border border-white/30">3</span> Payment
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#002D62]">Your Cart</h2>
            <p className="text-sm text-zinc-500">{itemCount} item{itemCount === 1 ? "" : "s"} selected for checkout</p>
          </div>
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-[#002D62] hover:underline">
            <ChevronLeft className="size-4" /> Continue shopping
          </button>
        </div>

        {items.length === 0 ? (
          <Card className="rounded-2xl border-zinc-200 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#002D62]/10">
              <ShoppingCartIcon className="size-6 text-[#002D62]" />
            </div>
            <h3 className="mt-4 font-bold text-[#002D62]">Your cart is empty</h3>
            <p className="mt-1 text-sm text-zinc-500">Add fresh produce from the marketplace to continue.</p>
            <Button onClick={onBack} className="mt-5 bg-[#002D62]">Browse produce</Button>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <Card className="rounded-2xl border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#002D62]">Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={item.product.id} className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:flex-row sm:items-center">
                      <img src={item.product.image} alt={item.product.name} className="h-24 w-full rounded-lg object-cover sm:w-28" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-[#002D62]">{item.product.name}</h3>
                            <p className="text-xs text-zinc-500">{item.product.unit}</p>
                          </div>
                          <button type="button" onClick={() => onRemoveItem(item.product.id)} aria-label={`Remove ${item.product.name}`} className="text-zinc-400 hover:text-red-600">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-4">
                          <div className="flex items-center rounded-lg border border-zinc-200">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="flex size-8 items-center justify-center text-[#002D62]"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-[#002D62]">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="flex size-8 items-center justify-center text-[#002D62]"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <div className="font-bold text-[#002D62]">฿{lineTotal.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="h-fit rounded-2xl border-zinc-200 lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle className="text-lg text-[#002D62]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Subtotal</span>
                  <span>฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span className="flex items-center gap-2"><Truck className="size-4" /> Shipping</span>
                  <span>฿{shippingFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-zinc-200" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002D62]">Total</span>
                  <span className="text-2xl font-bold text-[#002D62]">฿{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button onClick={onCheckout} className="w-full rounded-xl bg-[#F2A900] text-[#002D62] font-bold hover:bg-[#f6b528]">
                  <ArrowRight className="size-4 mr-2" /> Continue to Shipping
                </Button>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="size-4 text-emerald-600" /> Secure checkout and traceable farm produce.
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}