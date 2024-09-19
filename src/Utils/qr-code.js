import QRCode from "qrcode";

export async function generateQRCode(data) {
  const qr = await QRCode.toDataURL(JSON.stringify(data), {
    errorCorrectionLevel: "H",
  });
  return qr;
}
