import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ShoppingBag, Truck, CreditCard, CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingInfoSchema, type ShippingInfoInput } from "@/lib/validations/checkout";
import { useCreateOrder, useUploadSlip } from "@/lib/query-options";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { CartItem } from "../ecommerce.types";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
}

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

const SHIPPING_FEE = {
  standard: 60,
  express: 100,
};

export function CheckoutModal({ open, onClose, items }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  const uploadSlipMutation = useUploadSlip();

  const form = useForm<ShippingInfoInput>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      phone: user?.user_metadata?.phone || "",
      email: user?.email || "",
      address: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: "",
      deliveryMethod: "standard",
      saveAddress: true,
      billingSameAsShipping: true,
    },
  });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryMethod = form.watch("deliveryMethod");
  const shippingFee = SHIPPING_FEE[deliveryMethod];
  const total = subtotal + shippingFee;

  const nextStep = () => {
    if (step === "cart") setStep("shipping");
    else if (step === "shipping") {
      form.handleSubmit(handleCreateOrder)();
    }
    else if (step === "payment") setStep("confirmation");
  };

  const prevStep = () => {
    if (step === "shipping") setStep("cart");
    else if (step === "payment") setStep("shipping");
  };

  const handleCreateOrder = async (data: ShippingInfoInput) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }

    try {
      const idempotencyKey = crypto.randomUUID();
      const result = await createOrderMutation.mutateAsync({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingInfo: data,
        idempotencyKey,
      });

      if (result.isDuplicate) {
        toast.info("คุณมีออเดอร์นี้อยู่แล้ว");
        setOrderId(result.order.id);
      } else {
        setOrderId(result.order.id);
        toast.success("สร้างออเดอร์สำเร็จ");
      }

      setStep("payment");
    } catch (error) {
      toast.error("ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่");
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("ไฟล์ต้องเป็น PNG, JPG หรือ PDF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadSlip = async () => {
    if (!orderId || !selectedFile) {
      toast.error("กรุณาอัปโหลดสลิป");
      return;
    }

    try {
      const idempotencyKey = crypto.randomUUID();
      const result = await uploadSlipMutation.mutateAsync({
        orderId,
        file: selectedFile,
        idempotencyKey,
      });

      if (result.isDuplicate) {
        toast.info("คุณได้อัปโหลดสลิปนี้ไปแล้ว");
      } else {
        toast.success("อัปโหลดสลิปสำเร็จ กำลังตรวจสอบ...");
        setStep("confirmation");
      }
    } catch (error) {
      toast.error("ไม่สามารถอัปโหลดสลิปได้ กรุณาลองใหม่");
    }
  };

  const handleClose = () => {
    setStep("cart");
    setOrderId(null);
    setSelectedFile(null);
    form.reset();
    onClose();
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#002D62]">Checkout</h2>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <div className={`flex items-center gap-1 ${step === "cart" ? "text-[#F2A900]" : "text-zinc-400"}`}>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] text-white text-xs">1</span>
              <span>ตะกร้า</span>
            </div>
            <ChevronRight className="size-4 text-zinc-300" />
            <div className={`flex items-center gap-1 ${step === "shipping" ? "text-[#F2A900]" : "text-zinc-400"}`}>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] text-white text-xs">2</span>
              <span>จัดส่ง</span>
            </div>
            <ChevronRight className="size-4 text-zinc-300" />
            <div className={`flex items-center gap-1 ${step === "payment" ? "text-[#F2A900]" : "text-zinc-400"}`}>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] text-white text-xs">3</span>
              <span>ชำระเงิน</span>
            </div>
            <ChevronRight className="size-4 text-zinc-300" />
            <div className={`flex items-center gap-1 ${step === "confirmation" ? "text-[#F2A900]" : "text-zinc-400"}`}>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#002D62] text-white text-xs">4</span>
              <span>ยืนยัน</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="size-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {step === "cart" && <CartStep items={items} subtotal={subtotal} onNext={nextStep} />}
        {step === "shipping" && (
          <ShippingStep form={form} shippingFee={shippingFee} onNext={nextStep} onPrev={prevStep} />
        )}
        {step === "payment" && (
          <PaymentStep
            total={total}
            orderId={orderId}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onUpload={handleUploadSlip}
            onPrev={prevStep}
            isUploading={uploadSlipMutation.isPending}
          />
        )}
        {step === "confirmation" && <ConfirmationStep onClose={handleClose} />}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Dialog */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-6 hidden md:block">
          {content}
        </DialogContent>
      </Dialog>

      {/* Mobile: Drawer */}
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[90vh] p-6 md:hidden">
          <DrawerHeader className="hidden">
            <DrawerTitle>Checkout</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ============================================
// CART STEP
// ============================================

function CartStep({ items, subtotal, onNext }: { items: CartItem[]; subtotal: number; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.product.id} className="p-4">
            <div className="flex gap-4">
              <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#002D62]">{item.product.name}</h3>
                <p className="text-sm text-zinc-500">{item.product.unit}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">จำนวน: {item.quantity}</span>
                  <span className="font-bold text-[#002D62]">฿{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-zinc-50">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#002D62]">ยอดรวมชั่วคราว</span>
          <span className="text-xl font-bold text-[#002D62]">฿{subtotal.toFixed(2)}</span>
        </div>
      </Card>

      <Button onClick={onNext} className="w-full bg-[#F2A900] text-[#002D62] font-bold" size="lg">
        ดำเนินการต่อ
      </Button>
    </div>
  );
}

// ============================================
// SHIPPING STEP
// ============================================

function ShippingStep({
  form,
  shippingFee,
  onNext,
  onPrev,
}: {
  form: ReturnType<typeof useForm<ShippingInfoInput>>;
  shippingFee: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const subtotal = 0; // Will calculate from items context

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>ชื่อ-นามสกุล</FormLabel>
                <FormControl>
                  <Input placeholder="สมชาย ใจดี" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เบอร์โทรศัพท์</FormLabel>
                <FormControl>
                  <Input placeholder="0812345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="somchai@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Input placeholder="123 หมู่ 1 ต.ในเมือง อ.เมือง" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="subdistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ตำบล/แขวง</FormLabel>
                <FormControl>
                  <Input placeholder="ในเมือง" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อำเภอ/เขต</FormLabel>
                <FormControl>
                  <Input placeholder="เมือง" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จังหวัด</FormLabel>
                <FormControl>
                  <Input placeholder="ลำปาง" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสไปรษณีย์</FormLabel>
              <FormControl>
                <Input placeholder="52000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วิธีการจัดส่ง</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="standard" id="standard" />
                    <label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="font-medium">มาตรฐาน (3-5 วัน)</div>
                      <div className="text-sm text-zinc-500">฿{SHIPPING_FEE.standard.toFixed(2)}</div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="express" id="express" />
                    <label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="font-medium">ด่วน (1-2 วัน)</div>
                      <div className="text-sm text-zinc-500">฿{SHIPPING_FEE.express.toFixed(2)}</div>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onPrev} className="flex-1">
            ย้อนกลับ
          </Button>
          <Button type="button" onClick={onNext} className="flex-1 bg-[#F2A900] text-[#002D62] font-bold">
            ดำเนินการต่อ
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ============================================
// PAYMENT STEP
// ============================================

function PaymentStep({
  total,
  orderId,
  selectedFile,
  onFileSelect,
  onUpload,
  onPrev,
  isUploading,
}: {
  total: number;
  orderId: string | null;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  onPrev: () => void;
  isUploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-32 rounded-2xl border-4 border-[#002D62] bg-white p-3 mb-4">
          <div className="flex size-full items-center justify-center rounded-lg bg-[repeating-linear-gradient(45deg,#002D62_0_5px,#fff_5px_10px)] p-4">
            <div className="flex size-full items-center justify-center rounded-lg bg-white text-center text-xs font-bold text-[#002D62]">
              PROMPTPAY<br />QR CODE
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-600 mb-2">PromptPay ID: 0-1234-56789-0</p>
        <p className="text-lg font-bold text-[#002D62]">ยอดชำระ: ฿{total.toFixed(2)}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-[#002D62]">อัปโหลดสลิปโอนเงิน</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />
        {!selectedFile ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-[#F2A900] rounded-2xl p-8 text-center hover:bg-[#F2A900]/5 transition"
          >
            <CreditCard className="size-8 mx-auto mb-2 text-[#F2A900]" />
            <p className="font-medium text-[#002D62]">คลิกเพื่ออัปโหลดสลิป</p>
            <p className="text-sm text-zinc-500">PNG, JPG หรือ PDF สูงสุด 5MB</p>
          </button>
        ) : (
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-zinc-50">
            <CheckCircle2 className="size-5 text-emerald-600" />
            <div className="flex-1">
              <p className="font-medium text-[#002D62]">{selectedFile.name}</p>
              <p className="text-sm text-zinc-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onFileSelect(null as any);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              เปลี่ยน
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onPrev} className="flex-1">
          ย้อนกลับ
        </Button>
        <Button
          type="button"
          onClick={onUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-[#F2A900] text-[#002D62] font-bold"
        >
          {isUploading ? "กำลังอัปโหลด..." : "ยืนยันการชำระเงิน"}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 justify-center">
        <ShieldCheck className="size-4" />
        <span>ระบบจะตรวจสอบสลิปอัตโนมัติ หากไม่ผ่านจะส่งให้ Admin ตรวจสอบ</span>
      </div>
    </div>
  );
}

// ============================================
// CONFIRMATION STEP
// ============================================

function ConfirmationStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex items-center justify-center size-20 rounded-full bg-emerald-100">
        <CheckCircle2 className="size-10 text-emerald-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#002D62] mb-2">สำเร็จ!</h2>
        <p className="text-zinc-600">
          ออเดอร์ของคุณได้รับแล้ว กำลังตรวจสอบการชำระเงิน
        </p>
      </div>
      <div className="space-y-2 text-sm text-zinc-500">
        <p>• หากตรวจสอบอัตโนมัติผ่าน ออเดอร์จะดำเนินการทันที</p>
        <p>• หากต้องการตรวจสอบด้วยมือ Admin จะดำเนินการภายใน 24 ชั่วโมง</p>
        <p>• คุณจะได้รับการแจ้งเตือนผ่านอีเมลเมื่อการชำระเงินยืนยันแล้ว</p>
      </div>
      <Button onClick={onClose} className="w-full bg-[#F2A900] text-[#002D62] font-bold" size="lg">
        ตกลง
      </Button>
    </div>
  );
}
