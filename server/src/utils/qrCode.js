import QRCode from "qrcode";

/**
 * Reusable utility to generate a QR code as a Base64 data URL.
 * 
 * @param {string} text - The input string, URL, or identifier to encode.
 * @param {object} [options={}] - Optional QRCode configuration options (margin, scale, errorCorrectionLevel, etc.).
 * @returns {Promise<string>} A Promise that resolves to a Base64 data URL ('data:image/png;base64,...').
 */
export const generateQRCodeDataURL = async (text, options = {}) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("A valid non-empty string is required to generate a QR code.");
  }

  const defaultOptions = {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 2,
    scale: 8,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  };

  return await QRCode.toDataURL(text.trim(), { ...defaultOptions, ...options });
};
