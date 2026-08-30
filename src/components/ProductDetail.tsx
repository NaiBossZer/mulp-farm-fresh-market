import { useState } from "react";
import { BadgeCheck, Calendar, Check, ChevronLeft, Heart, Minus, Plus, Radio, Search, ShoppingCart, Sprout, User, Home, Leaf, Zap, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PRODUCTS, type Product } from "./ecommerce.types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface ProductDetailProps {
  product?: Product;
  cartCount?: number;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onCartClick?: () => void;
  onUserClick?: () => void;
}

const fallbackProduct = PRODUCTS[0];

export default function ProductDetail({ product = fallbackProduct, cartCount = 0, onBack, onAddToCart, onCartClick, onUserClick }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const decrease = () => setQuantity((current) => Math.max(1, current - 1));
  const increase = () => setQuantity((current) => Math.min(20, current + 1));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-blue-900/50 bg-[#0B192C] text-white shadow-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex size-9 md:size-11 items-center justify-center rounded-full bg-[#F2A900]">
                <Sprout className="size-5 md:size-6 text-[#002D62]" />
              </div>
              <div className="leading-tight">
                <div className="text-xs md:text-sm font-bold tracking-wide text-white">MAHIDOL UNIVERSITY</div>
                <div className="text-[10px] md:text-xs text-[#F2A900]">Smart Farm Storefront</div>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-blue-800/80 hidden md:block mx-1" />

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <div className={navigationMenuTriggerStyle()}>
                    <Home className="w-4 h-4 mr-2" />
                    หน้าหลัก
                  </div>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-[#F2A900] focus:bg-transparent data-[state=open]:bg-transparent text-xs md:text-sm font-medium text-slate-100 px-0 py-0 h-auto">
                    ระบบศูนย์ย่อย
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2 bg-white rounded-lg shadow-xl border border-slate-200">
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/smart-farm" className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-green-50">
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <Leaf className="w-4 h-4 mr-2 text-green-600" />
                              ระบบ Smart Farm IoT
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              ระบบติดตามและจัดการฟาร์มอัจฉริยะแบบเรียลไทม์
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/clean-energy" className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-blue-50">
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <Zap className="w-4 h-4 mr-2 text-blue-600" />
                              ศูนย์พลังงานสะอาด
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              ระบบมอนิเตอร์พลังงานแสงอาทิตย์และพลังงานทดแทน
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/rac" className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-orange-50">
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <FlaskConical className="w-4 h-4 mr-2 text-orange-600" />
                              ศูนย์วิจัย RAC
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              ระบบฐานข้อมูลงานวิจัยและทดลอง
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <div className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-[#F2A900]/10">
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <ShoppingCart className="w-4 h-4 mr-2 text-[#F2A900]" />
                              ร้านค้าผลผลิตเกษตร
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              ระบบสั่งซื้อผลผลิต งานวิจัย และผลิตภัณฑ์จากศูนย์ฯ
                            </p>
                          </div>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative mx-auto max-w-2xl hidden lg:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search fresh produce..."
                className="h-10 rounded-full border-white/20 bg-white/10 pl-9 text-white placeholder:text-white/60 focus-visible:ring-[#F2A900]"
              />
            </div>
            <div className="relative">
              <Button aria-label="Cart" className="size-10 rounded-full bg-white/10 p-0 text-white hover:bg-white/15 cursor-pointer" onClick={onCartClick}>
                <ShoppingCart className="size-5" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F2A900] px-1 text-xs font-bold text-[#002D62]">
                  {cartCount}
                </span>
              )}
            </div>
            <Button aria-label="Account" className="size-10 rounded-full bg-white/10 p-0 text-white hover:bg-white/15 cursor-pointer" onClick={onUserClick}>
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="lg:hidden px-4 py-3 bg-[#0B192C] border-b border-blue-900/50">
        <div className="relative mx-auto max-w-2xl">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
          <Input
            placeholder="Search fresh produce..."
            className="h-10 rounded-full border-white/20 bg-white/10 pl-9 text-white placeholder:text-white/60 focus-visible:ring-[#F2A900]"
          />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#002D62] hover:underline">
          <ChevronLeft className="size-4" /> Back to marketplace
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-3xl border-zinc-200 bg-white p-0 shadow-sm">
            <div className="relative aspect-square overflow-hidden bg-zinc-100">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">{product.stock}</span>
              <button type="button" onClick={() => setLiked((value) => !value)} aria-label="Favorite product" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-[#002D62] shadow-sm">
                <Heart className={liked ? "size-5 fill-current" : "size-5"} />
              </button>
            </div>
          </Card>

          <div className="flex flex-col justify-center">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#002D62]/10 px-2.5 py-1 text-xs font-semibold text-[#002D62]"><BadgeCheck className="size-3.5" /> GAP Certified</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#F2A900]/20 px-2.5 py-1 text-xs font-semibold text-[#002D62]"><Radio className="size-3.5" /> {product.plot}</span>
            </div>
            <h1 className="text-3xl font-bold text-[#002D62] sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-zinc-500">Per {product.unit} · Category: {product.category}</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-zinc-600"><Calendar className="size-4" /> Harvest {product.harvestDate}</div>
            <p className="mt-6 text-base leading-7 text-zinc-600">{product.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.features?.map((feature) => (
                <div key={feature} className="flex items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-zinc-200"><Check className="size-4 text-emerald-600" /> <span className="text-sm text-zinc-700">{feature}</span></div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
              <div className="flex items-end justify-between gap-4">
                <div><span className="text-sm text-zinc-500">Price</span><div className="text-3xl font-bold text-[#002D62]">฿{product.price.toFixed(2)}</div></div>
                <div className="text-right text-xs text-zinc-500">Fresh from {product.plot}</div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white sm:w-36">
                  <button type="button" onClick={decrease} aria-label="Decrease quantity" className="flex size-10 items-center justify-center text-[#002D62]"><Minus className="size-4" /></button>
                  <span className="w-10 text-center font-semibold text-[#002D62]">{quantity}</span>
                  <button type="button" onClick={increase} aria-label="Increase quantity" className="flex size-10 items-center justify-center text-[#002D62]"><Plus className="size-4" /></button>
                </div>
                <Button onClick={() => onAddToCart(product, quantity)} className="h-11 flex-1 rounded-xl bg-[#002D62] text-white hover:bg-[#0a3d79]">
                  <ShoppingCart className="size-4" /> Add {quantity} to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}