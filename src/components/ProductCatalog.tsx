import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Cpu,
  Heart,
  Leaf,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  User,
  Home,
  Zap,
  FlaskConical,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PRODUCTS, type Product } from "./ecommerce.types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface ProductCatalogProps {
  cartCount?: number;
  onSelectProduct: (product: Product) => void;
  onCartClick?: () => void;
  onUserClick?: () => void;
  // เพิ่ม Props รองรับเพื่อแก้ปัญหา TypeScript Error จาก App.tsx
  items?: any[];
  onBack?: () => void;
  onCheckout?: () => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

const featuredIds = ["green-oak", "butterhead", "baby-spinach"];

export default function ProductCatalog({
  cartCount = 0,
  onSelectProduct,
  onCartClick,
  onUserClick,
}: ProductCatalogProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return PRODUCTS;
    return PRODUCTS.filter((product) =>
      [product.name, product.category, product.plot, product.description].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [search]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80";
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0A2E4D] text-white shadow-md border-b-2 border-[#1B6B3C]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/envi-logo.jpg"
                  alt="Envi Mahidol Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerText = "🌍 Envi";
                  }}
                />
              </div>

              <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/mahidol-logo.png"
                  alt="Mahidol University Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerText = "🏛️ Mahidol";
                  }}
                />
              </div>

              <div className="bg-white p-1 rounded-lg h-9 sm:h-11 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/social-engagement-logo.png"
                  alt="Social Engagement Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerText = "🤝 Social";
                  }}
                />
              </div>
            </div>

            <div className="w-[1px] h-8 sm:h-10 bg-white/20 shrink-0 hidden sm:block"></div>

            <div className="hidden sm:block">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-white block leading-snug">
                งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[#F5B800] block leading-tight mt-0.5">
                คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a
                      href="/"
                      className="flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-[#F5B800] transition-colors"
                    >
                      <Home className="w-4 h-4 mr-1.5" />
                      {t("navbar.nav.home")}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-[#F5B800] focus:bg-transparent data-[state=open]:bg-transparent text-xs sm:text-sm font-medium text-slate-200 px-3 py-2 h-auto shadow-none">
                    {t("navbar.nav.subsystems")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="/smart-farm"
                            className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-green-50"
                          >
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <Leaf className="w-4 h-4 mr-2 text-green-600" />
                              {t("navbar.nav.smartFarm")}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              {t("navbar.nav.smartFarmDesc")}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="/clean-energy"
                            className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-blue-50"
                          >
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <Zap className="w-4 h-4 mr-2 text-blue-600" />
                              {t("navbar.nav.cleanEnergy")}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              {t("navbar.nav.cleanEnergyDesc")}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="/rac"
                            className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-orange-50"
                          >
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <FlaskConical className="w-4 h-4 mr-2 text-orange-600" />
                              {t("navbar.nav.rac")}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              {t("navbar.nav.racDesc")}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="#"
                            className="block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-[#F5B800]/10 bg-slate-50"
                          >
                            <div className="flex items-center text-xs font-semibold text-slate-800 mb-1.5">
                              <ShoppingCart className="w-4 h-4 mr-2 text-[#F5B800]" />
                              {t("navbar.nav.storefront")}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              {t("navbar.nav.storefrontDesc")}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative mx-auto max-w-2xl hidden lg:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("navbar.search.placeholder")}
                className="h-9 w-48 xl:w-64 rounded-full border-white/20 bg-white/10 pl-9 text-xs text-white placeholder:text-white/60 focus-visible:ring-[#F5B800]"
              />
            </div>

            <div className="relative">
              <Button
                aria-label={t("cart.title", "Cart")}
                className="size-9 rounded-full bg-white/10 p-0 text-white hover:bg-white/20 cursor-pointer border border-white/10"
                onClick={onCartClick}
              >
                <ShoppingCart className="size-4" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5B800] px-1 text-[10px] font-bold text-[#0A2E4D]">
                  {cartCount}
                </span>
              )}
            </div>

            <Button
              aria-label={t("account.title", "Account")}
              className="size-9 rounded-full bg-white/10 p-0 text-white hover:bg-white/20 cursor-pointer border border-white/10"
              onClick={onUserClick}
            >
              <User className="size-4" />
            </Button>

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <div className="xl:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-white hover:text-[#F5B800]"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-white/15 px-4 py-3 space-y-3 bg-[#071F34]">
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center text-sm font-medium text-white hover:text-[#F5B800] py-1"
            >
              <Home className="w-4 h-4 mr-2" /> {t("navbar.nav.home")}
            </a>
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-xs font-semibold text-[#F5B800]">{t("navbar.nav.subsystems")}</p>
              <a
                href="/smart-farm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs text-slate-200 hover:text-white py-1"
              >
                🌿 {t("navbar.nav.smartFarm")}
              </a>
              <a
                href="/clean-energy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs text-slate-200 hover:text-white py-1"
              >
                ⚡ {t("navbar.nav.cleanEnergy")}
              </a>
              <a
                href="/rac"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs text-slate-200 hover:text-white py-1"
              >
                🧪 {t("navbar.nav.rac")}
              </a>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between sm:hidden">
              <span className="text-xs text-slate-300">{t("language", "Language")}</span>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <section className="relative isolate overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1580738204555-8686f3a2db43?auto=format&fit=crop&w=1800&q=85"
            alt="Mahidol smart farm fields"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0A2E4D] via-[#0A2E4D]/85 to-[#0A2E4D]/30" />
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="max-w-3xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F5B800]/40 bg-[#F5B800]/20 px-4 py-1 text-xs font-semibold text-[#F5B800]">
                <Leaf className="size-3.5" /> {t("hero.badge")}
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {t("hero.title")}{" "}
                <span className="text-[#F5B800]">{t("hero.titleHighlight")}</span> Research Center
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => PRODUCTS[0] && onSelectProduct(PRODUCTS[0])}
                  className="h-12 rounded-full bg-[#F5B800] px-8 text-base font-bold text-[#0A2E4D] hover:bg-[#f6b528] cursor-pointer"
                >
                  <ShoppingBag className="size-5" /> {t("hero.shopNow")}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-transparent px-6 text-base font-medium text-white hover:bg-white/10 hover:text-white cursor-pointer"
                  onClick={() =>
                    document.getElementById("featured-harvest")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t("hero.learnMore")}
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm">
                {[
                  [BadgeCheck, t("hero.features.gap")],
                  [Cpu, t("hero.features.iot")],
                  [Sprout, t("hero.features.fresh")],
                ].map(([Icon, label]) => (
                  <div key={label as string} className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10">
                      <Icon className="size-5 text-[#F5B800]" />
                    </div>
                    <span className="font-medium">{label as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="featured-harvest" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0A2E4D]">{t("catalog.featured")}</h2>
              <p className="text-sm text-zinc-500">{t("catalog.featuredDesc")}</p>
            </div>
            <span className="text-sm text-zinc-500">
              {filteredProducts.length} {t("catalog.products")}
            </span>
          </div>

          <div className="mb-8 grid gap-5 md:grid-cols-3">
            {featuredIds.map((id) => {
              const product = PRODUCTS.find((item) => item.id === id);
              if (!product) return null;
              return (
                <Card key={product.id} className="overflow-hidden rounded-2xl border-zinc-200 shadow-sm">
                  <div className="relative h-52">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#0A2E4D] px-2.5 py-1 text-[11px] font-semibold text-white">
                      {product.stock}
                    </span>
                    <button
                      type="button"
                      aria-label={`Favorite ${product.name}`}
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Heart className="size-4" />
                    </button>
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#0A2E4D]/10 px-2 py-1 text-[10px] font-semibold text-[#0A2E4D]">
                        <BadgeCheck className="size-3" /> {t("catalog.gapCertified")}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {t("catalog.harvest")} {product.harvestDate}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#0A2E4D]">{product.name}</h3>
                        <p className="text-xs text-zinc-500">
                          {t("catalog.unit")} {product.unit}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-[#0A2E4D]">
                        ฿{product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#F5B800]/20 px-2.5 py-1 text-[11px] font-bold text-[#0A2E4D]">
                      {t("catalog.plot")} {product.plot}
                    </div>
                    <Button
                      onClick={() => onSelectProduct(product)}
                      className="w-full rounded-lg bg-[#0A2E4D] text-white hover:bg-[#14432E] cursor-pointer"
                    >
                      <ShoppingCart className="size-4" /> {t("catalog.viewProduct")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0A2E4D]">{t("catalog.allProducts")}</h2>
              {search && (
                <span className="text-sm text-zinc-500">
                  {t("catalog.searchingFor", "Searching for")} “{search}”
                </span>
              )}
            </div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
                {t("catalog.noProducts", "No products match your search.")}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden rounded-2xl border-zinc-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                      className="h-44 w-full object-cover"
                    />
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#0A2E4D]">{product.category}</span>
                        <span
                          className={
                            (product.stock as any) === "Low Stock" || (product.stock as any) === "มีสินค้า"
                              ? "text-emerald-600 font-medium"
                              : "text-amber-600 font-medium"
                          }
                        >
                          {product.stock}
                        </span>
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#0A2E4D]">{product.name}</h3>
                          <p className="text-xs text-zinc-500">{product.unit}</p>
                        </div>
                        <span className="font-bold text-[#0A2E4D]">฿{product.price.toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={() => onSelectProduct(product)}
                        variant="outline"
                        className="w-full border-[#0A2E4D] text-[#0A2E4D] hover:bg-[#0A2E4D] hover:text-white cursor-pointer"
                      >
                        {t("catalog.viewDetails", "View Details")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}