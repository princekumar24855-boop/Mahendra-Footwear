import { formatCurrency } from './formatters';

/**
 * Normalizes phone numbers to standard international format without '+', spaces, or dashes.
 * Example for India: "919876543210"
 */
export function sanitizeWhatsAppNumber(phoneNumber) {
  if (!phoneNumber) return '';
  // Remove all non-digit characters
  let cleaned = String(phoneNumber).replace(/\D/g, '');
  // If user entered 10 digits (common in India), prepend 91 default country code
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Generates a WhatsApp URL for ordering a single footwear item
 */
export function generateProductWhatsAppLink({
  whatsappNumber,
  product,
  size,
  quantity = 1,
}) {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  if (!cleanNumber) {
    return {
      isValid: false,
      url: '',
      message: 'Shop WhatsApp number is not configured yet. Please configure it in the Admin Settings.',
    };
  }

  const unitPrice = product.finalPrice;
  const totalPrice = unitPrice * Number(quantity);

  const messageLines = [
    `नमस्ते महेन्द्र फुटवियर (Mahendra Footwear)! 🙏`,
    `मुझे यह जूता/चप्पल ऑर्डर करना है:`,
    ``,
    `👟 Product: ${product.name}`,
    `📂 Category: ${product.category}`,
    `💰 Price: ${formatCurrency(unitPrice)}`,
    size ? `📏 Size (नंबर): ${size}` : null,
    `🔢 Quantity (जोड़ी): ${quantity}`,
    `💵 Total Amount: ${formatCurrency(totalPrice)}`,
    ``,
    `📍 Delivery Address: Badi Bazar, Nasriganj या होम डिलीवरी उपलब्ध है?`,
    `कृपया उपलब्धता और डिलीवरी की पुष्टि करें। धन्यवाद!`
  ].filter(line => line !== null);

  const text = messageLines.join('\n');
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleanNumber}?text=${encoded}`;

  return {
    isValid: true,
    url,
    message: text,
  };
}

/**
 * Generates a WhatsApp URL for ordering all items in the shopping cart
 */
export function generateCartWhatsAppLink({
  whatsappNumber,
  cartItems = [],
  grandTotal = 0,
}) {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  if (!cleanNumber) {
    return {
      isValid: false,
      url: '',
      message: 'Shop WhatsApp number is not configured yet. Please configure it in the Admin Settings.',
    };
  }

  if (!cartItems.length) {
    return {
      isValid: false,
      url: '',
      message: 'Cart is empty.',
    };
  }

  const itemsList = cartItems.map((item, index) => {
    const itemTotal = item.product.finalPrice * item.quantity;
    const sizeInfo = item.selectedSize ? ` (Size: ${item.selectedSize})` : '';
    return `${index + 1}. ${item.product.name}${sizeInfo} × ${item.quantity} = ${formatCurrency(itemTotal)}`;
  });

  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const messageLines = [
    `नमस्ते महेन्द्र फुटवियर (Mahendra Footwear)! 🙏`,
    `मुझे नीचे दिए गए सामान का ऑर्डर करना है:`,
    ``,
    ...itemsList,
    ``,
    `📦 Total Pairs (कुल जोड़ी): ${totalQuantity}`,
    `💵 Grand Total (कुल कीमत): ${formatCurrency(grandTotal)}`,
    ``,
    `कृपया उपलब्धता और डिलीवरी की पुष्टि करें। धन्यवाद!`
  ];

  const text = messageLines.join('\n');
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleanNumber}?text=${encoded}`;

  return {
    isValid: true,
    url,
    message: text,
  };
}

/**
 * Generates general enquiry WhatsApp link
 */
export function generateGeneralEnquiryWhatsAppLink(whatsappNumber, subject = '') {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  if (!cleanNumber) return { isValid: false, url: '' };

  const message = subject
    ? `नमस्ते महेन्द्र फुटवियर! 🙏 मुझे ${subject} के बारे में जानकारी और ऑर्डर करना है।`
    : `नमस्ते महेन्द्र फुटवियर! 🙏 मुझे आपके दुकान से जूते/चप्पल देखने और ऑर्डर करने हैं।`;

  return {
    isValid: true,
    url: `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
  };
}
