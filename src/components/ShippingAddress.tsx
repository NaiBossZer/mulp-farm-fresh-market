import { useState } from "react";
import { ArrowRight, Check, ChevronLeft, CreditCard, MapPin, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ShippingInfo } from "./ecommerce.types";

interface ShippingAddressProps {
  value: ShippingInfo;
  onChange: (value: ShippingInfo) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ShippingAddress({ value, onChange, onBack, onNext }: ShippingAddressProps) {
  const [submitted, setSubmitted] = useState(false);
  const setField = <K extends keyof ShippingInfo>(field: K, nextValue: ShippingInfo[K]) => onChange({ ...value, [field]: nextValue });

  const isValid = Boolean(value.fullName.trim() && value.phone.trim() && value.address.trim() && value.district.trim() && value.province.trim() && value.postalCode.trim());

  const handleNext = () => {
    setSubmitted(true);
    if (isValid) onNext();
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-[#002D62] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div><div className="text-xs font-medium text-white/70">MAHIDOL SMART FARM</div><h1 className="text-xl font-bold">Checkout</h1></div>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <div className="flex items-center gap-2 text-white/60"><span className="flex size-6 items-center justify-center rounded-full bg-[#F2A900] text-[#002D62]"><Check className="size-4" /></span> Cart</div>
            <div className="h-px w-8 bg-white/30" />
            <div className="flex items-center gap-2 text-[#F2A900]"><span className="flex size-6 items-center justify-center rounded-full border-2 border-[#F2A900]">2</span> Shipping</div>
            <div className="h-px w-8 bg-white/30" />
            <div className="flex items-center gap-2 text-white/60"><span className="flex size-6 items-center justify-center rounded-full border border-white/30">3</span> Payment</div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#002D62] hover:underline"><ChevronLeft className="size-4" /> Back to cart</button>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card className="rounded-2xl border-zinc-200">
            <CardHeader>
              <CardTitle className="text-2xl text-[#002D62]">Shipping Address</CardTitle>
              <CardDescription>Tell us where to deliver your fresh farm produce.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="fullName">Full name</Label><Input id="fullName" value={value.fullName} onChange={(e) => setField("fullName", e.target.value)} placeholder="Your full name" />{submitted && !value.fullName.trim() && <p className="text-xs text-red-600">Please enter your name.</p>}</div>
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={value.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="08x-xxx-xxxx" />{submitted && !value.phone.trim() && <p className="text-xs text-red-600">Please enter a phone number.</p>}</div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={value.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" value={value.address} onChange={(e) => setField("address", e.target.value)} placeholder="House number, building, street" />{submitted && !value.address.trim() && <p className="text-xs text-red-600">Please enter the delivery address.</p>}</div>
                <div className="space-y-2"><Label htmlFor="subdistrict">Subdistrict</Label><Input id="subdistrict" value={value.subdistrict} onChange={(e) => setField("subdistrict", e.target.value)} placeholder="Subdistrict" /></div>
                <div className="space-y-2"><Label htmlFor="district">District</Label><Input id="district" value={value.district} onChange={(e) => setField("district", e.target.value)} placeholder="District" />{submitted && !value.district.trim() && <p className="text-xs text-red-600">Required.</p>}</div>
                <div className="space-y-2"><Label htmlFor="province">Province</Label><Input id="province" value={value.province} onChange={(e) => setField("province", e.target.value)} placeholder="Province" />{submitted && !value.province.trim() && <p className="text-xs text-red-600">Required.</p>}</div>
                <div className="space-y-2"><Label htmlFor="postalCode">Postal code</Label><Input id="postalCode" inputMode="numeric" value={value.postalCode} onChange={(e) => setField("postalCode", e.target.value)} placeholder="xxxxx" />{submitted && !value.postalCode.trim() && <p className="text-xs text-red-600">Required.</p>}</div>
              </div>

              <div className="space-y-3">
                <Label>Delivery method</Label>
                <RadioGroup value={value.deliveryMethod} onValueChange={(next) => setField("deliveryMethod", next as ShippingInfo["deliveryMethod"])} className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4"><RadioGroupItem value="standard" /><span><span className="block font-semibold text-[#002D62]">Standard Delivery</span><span className="text-xs text-zinc-500">Next-day delivery · ฿60</span></span></label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4"><RadioGroupItem value="express" /><span><span className="block font-semibold text-[#002D62]">Express Delivery</span><span className="text-xs text-zinc-500">Same-day where available · ฿120</span></span></label>
                </RadioGroup>
              </div>

              <div className="space-y-3 text-sm text-[#002D62]">
                <label className="flex items-center gap-3"><input type="checkbox" checked={value.saveAddress} onChange={(e) => setField("saveAddress", e.target.checked)} className="size-4 accent-[#002D62]" /> Save this address for future orders</label>
                <label className="flex items-center gap-3"><input type="checkbox" checked={value.billingSameAsShipping} onChange={(e) => setField("billingSameAsShipping", e.target.checked)} className="size-4 accent-[#002D62]" /> Billing address same as shipping</label>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit rounded-2xl border-zinc-200 lg:sticky lg:top-6">
            <CardHeader><CardTitle className="text-lg text-[#002D62]">Checkout Steps</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-zinc-100 p-4"><div className="flex items-center gap-3"><ShoppingCart className="size-4 text-[#002D62]" /><span className="font-semibold text-[#002D62]">Cart</span><Check className="ml-auto size-4 text-emerald-600" /></div></div>
              <div className="rounded-xl bg-[#002D62] p-4 text-white"><div className="flex items-center gap-3"><MapPin className="size-4 text-[#F2A900]" /><span className="font-semibold">Shipping address</span></div><p className="mt-2 text-xs text-white/70">Complete the required fields to continue.</p></div>
              <div className="rounded-xl border border-zinc-200 p-4"><div className="flex items-center gap-3 text-zinc-500"><CreditCard className="size-4" /><span className="font-semibold">Payment</span></div></div>
              <Button onClick={handleNext} className="w-full rounded-xl bg-[#F2A900] text-[#002D62] hover:bg-[#f6b528]"><ArrowRight className="size-4" /> Continue to Payment</Button>
              {!isValid && submitted && <p className="text-center text-xs text-red-600">Please complete all required fields before continuing.</p>}
              <div className="flex items-center gap-2 text-xs text-zinc-500"><Truck className="size-4" /> Farm-to-door delivery tracking included.</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
