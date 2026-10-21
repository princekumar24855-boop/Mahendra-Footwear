import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { generateGeneralEnquiryWhatsAppLink } from '../../utils/whatsapp';

export default function WhatsAppFloatingButton() {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const enquiry = generateGeneralEnquiryWhatsAppLink(
    settings.whatsappNumber,
    'Mahendra Footwear collections and availability'
  );

  if (!settings.whatsappNumber) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end group">
      {/* Floating tooltip */}
      {showTooltip && (
        <div className="relative mb-2 hidden sm:flex items-center gap-2 bg-stone-900 text-white text-xs py-2 px-3.5 rounded-xl shadow-xl border border-stone-800 animate-bounce">
          <span>Need help or want to order? Chat on WhatsApp!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white ml-1 p-0.5"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-5 -bottom-1.5 w-3 h-3 bg-stone-900 rotate-45 border-r border-b border-stone-800" />
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={enquiry.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat and Order on WhatsApp"
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 rounded-full shadow-elevated hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:ring-4 focus:ring-emerald-200"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="font-semibold text-sm hidden md:inline tracking-wide">Order on WhatsApp</span>
      </a>
    </div>
  );
}
