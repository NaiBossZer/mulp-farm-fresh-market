import { useRef, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, CreditCard, ImagePlus, QrCode, ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSlipProps {
  subtotal: number;
  shipping: number;
  onBack: () => void;
  onConfirm: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

export default function PaymentSlip({ subtotal, shipping, onBack, onConfirm }: PaymentSlipProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const total = subtotal + shipping;

  const handleFile = (nextFile: File | null) => {
    if (!nextFile) return;
    if (!allowedTypes.includes(nextFile.type)) {
      setError("Please upload a PNG, JPG or PDF file.");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError("The file must be 5MB or smaller.");
      return;
    }
    setError("");
    setConfirmed(false);
    setFile(nextFile);
  };

  const handleConfirm = () => {
    if (!file) {
      setError("Please upload your payment slip before confirming.");
      return;
    }
    setError("");
    setConfirmed(true);
    onConfirm(file);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-[#002D62] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div><div className="text-xs font-medium text-white/70">MAHIDOL SMART FARM</div><h1 className="text-xl font-bold">Checkout</h1></div>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <div className="flex items-center gap-2 text-white/60"><span className="flex size-6 items-center justify-center rounded-full bg-[#F2A900] text-[#002D62]"><Check className="size-4" /></span> Cart</div>
            <div className="h-px w-8 bg-white/30" />
            <div className="flex items-center gap-2 text-white/60"><span className="flex size-6 items-center justify-center rounded-full bg-[#F2A900] text-[#002D62]"><Check className="size-4" /></span> Shipping</div>
            <div className="h-px w-8 bg-white/30" />
            <div className="flex items-center gap-2 text-[#F2A900]"><span className="flex size-6 items-center justify-center rounded-full border-2 border-[#F2A900]">3</span> Payment</div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#002D62] hover:underline"><ChevronLeft className="size-4" /> Back to shipping</button>
        <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#002D62]">PromptPay Payment</CardTitle>
            <CardDescription>Scan the QR code with your banking app, complete payment, then upload the payment slip.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-2xl border-4 border-[#002D62] bg-white p-3 shadow-sm">
                <div className="flex size-48 items-center justify-center rounded-xl bg-[repeating-linear-gradient(45deg,#002D62_0_5px,#fff_5px_10px)] p-4">
                  <div className="flex size-full items-center justify-center rounded-lg bg-white text-center text-xs font-bold text-[#002D62]">PROMPTPAY<br />QR CODE</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#002D62]"><QrCode className="size-4 text-[#F2A900]" /> PromptPay ID: 0-1234-56789-0</div>
              <div className="grid gap-3 text-xs text-zinc-500 sm:grid-cols-3">
                <div className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] font-bold text-white">1</span> Open banking app</div>
                <div className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] font-bold text-white">2</span> Scan QR to pay</div>
                <div className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] font-bold text-white">3</span> Upload slip</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-semibold text-[#002D62]">Upload Payment Slip</div>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
              {!file ? (
                <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#F2A900] bg-[#F2A900]/5 px-6 py-10 transition hover:bg-[#F2A900]/10">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#F2A900]/15"><ImagePlus className="size-6 text-[#F2A900]" /></div>
                  <span className="text-sm font-semibold text-[#002D62]">Click to upload payment slip</span>
                  <span className="text-xs text-zinc-500">PNG, JPG or PDF up to 5MB</span>
                </button>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-zinc-200"><CreditCard className="size-5 text-[#002D62]" /></div>
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-[#002D62]">{file.name}</div><div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600"><CheckCircle2 className="size-3.5" /> Ready to submit · {(file.size / 1024).toFixed(0)} KB</div></div>
                  <button type="button" onClick={() => { setFile(null); setConfirmed(false); if (inputRef.current) inputRef.current.value = ""; }} aria-label="Remove payment slip" className="flex size-8 items-center justify-center rounded-full text-zinc-500 hover:bg-white hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
              )}
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="rounded-xl bg-zinc-100 p-4">
              <div className="flex justify-between text-sm text-zinc-500"><span>Subtotal</span><span>฿{subtotal.toFixed(2)}</span></div>
              <div className="mt-2 flex justify-between text-sm text-zinc-500"><span>Shipping</span><span>฿{shipping.toFixed(2)}</span></div>
              <div className="my-3 h-px bg-zinc-200" />
              <div className="flex justify-between"><span className="font-bold text-[#002D62]">Order Total</span><span className="text-xl font-bold text-[#002D62]">฿{total.toFixed(2)}</span></div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleConfirm} disabled={confirmed} className="h-12 w-full rounded-xl bg-[#F2A900] text-base font-bold text-[#002D62] hover:bg-[#f6b528] disabled:opacity-100">
              <ShieldCheck className="size-5" /> {confirmed ? "Payment Submitted" : "Confirm Payment"}
            </Button>
            {confirmed ? (
              <p className="flex items-center gap-2 text-xs text-emerald-600"><CheckCircle2 className="size-4" /> Payment slip submitted successfully. Your order is ready for verification.</p>
            ) : (
              <p className="flex items-center gap-2 text-xs text-zinc-500"><ShoppingCart className="size-4" /> Order verification begins after payment confirmation.</p>
            )}
            <div className="flex items-center gap-2 text-xs text-zinc-400"><Truck className="size-4" /> Delivery status will be shared after payment is verified.</div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
