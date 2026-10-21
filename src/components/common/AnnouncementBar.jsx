import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { MessageCircle, Clock, MapPin } from 'lucide-react';
import { generateGeneralEnquiryWhatsAppLink } from '../../utils/whatsapp';

export default function AnnouncementBar() {
  const { settings } = useSettings();

  const enquiry = generateGeneralEnquiryWhatsAppLink(settings.whatsappNumber);

  return (
    <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="bg-brand-600 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full">
            Special
          </span>
          <span className="font-medium text-stone-100">
            {settings.announcementBanner || 'Welcome to Mahendra Footwear — Quality Footwear for the Entire Family!'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-stone-300">
          {settings.openingHours && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{settings.openingHours}</span>
            </div>
          )}
          {enquiry.isValid && (
            <a
              href={enquiry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: +{settings.whatsappNumber}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
