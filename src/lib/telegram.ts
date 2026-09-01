export interface TelegramOrderData {
  fullName: string;
  phone: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  deliveryMethod: string;
  total: number;
}

export async function sendTelegramNotification(orderData: TelegramOrderData) {
  const BOT_TOKEN = "8948520690:AAGRRLV5VLU7m9cwUQhHDixxCgLZLSosuH4";
  const CHAT_ID = "7275237922";

  const message = `
🚨 <b>มีคำสั่งซื้อใหม่! (Mahidol Smart Farm)</b>

👤 <b>ชื่อผู้ซื้อ:</b> ${orderData.fullName}
📞 <b>เบอร์โทร:</b> ${orderData.phone}
📍 <b>ที่อยู่จัดส่ง:</b> ${orderData.address} ต.${orderData.subdistrict} อ.${orderData.district} จ.${orderData.province} ${orderData.postalCode}
🚚 <b>รูปแบบจัดส่ง:</b> ${orderData.deliveryMethod === "express" ? "ด่วน (1-2 วัน)" : "มาตรฐาน (3-5 วัน)"}
💵 <b>ยอดชำระรวม:</b> ฿${orderData.total.toFixed(2)}
  `.trim();

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}