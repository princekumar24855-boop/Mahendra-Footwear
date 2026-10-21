import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { generateGeneralEnquiryWhatsAppLink } from '../../utils/whatsapp';

export default function Footer({ onSelectCategory, onOpenAdmin }) {
  const { settings } = useSettings();
  const enquiry = generateGeneralEnquiryWhatsAppLink(settings.whatsappNumber);

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-stone-800 text-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">100% Authentic</h4>
              <p className="text-xs text-stone-400">Genuine footwear quality</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Quick WhatsApp</h4>
              <p className="text-xs text-stone-400">Instant shop confirmation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Best Value</h4>
              <p className="text-xs text-stone-400">Fair prices & real savings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Local Delivery</h4>
              <p className="text-xs text-stone-400">Fast store pickup / dispatch</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Shop Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg">
                MF
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight uppercase">
                {settings.shopName || 'Mahendra Footwear'}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Your premier destination for high-grade footwear. Combining authentic craftsmanship, durable soles, and modern styles for men and women.
            </p>
            {enquiry.isValid && (
              <a
                href={enquiry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Shopkeeper</span>
              </a>
            )}
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="font-display font-semibold text-white uppercase tracking-wider text-xs mb-4">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectCategory("Men's Shoes")}
                  className="hover:text-white transition-colors"
                >
                  Men's Shoes (Formal, Casual, Sports)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("Men's Slippers")}
                  className="hover:text-white transition-colors"
                >
                  Men's Slippers (Comfort & Kolhapuri)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("Ladies' Sandals")}
                  className="hover:text-white transition-colors"
                >
                  Ladies' Sandals (Wedges & Ethnic)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("Ladies' Slippers")}
                  className="hover:text-white transition-colors"
                >
                  Ladies' Slippers (Doctor Ortho & Slides)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("offers")}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Discounted Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details from Admin Settings */}
          <div>
            <h3 className="font-display font-semibold text-white uppercase tracking-wider text-xs mb-4">
              Store Information
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{settings.shopAddress || 'Store location configured in Admin'}</span>
              </li>
              {settings.whatsappNumber && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>+{settings.whatsappNumber}</span>
                </li>
              )}
              {settings.contactEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{settings.contactEmail}</span>
                </li>
              )}
              {settings.openingHours && (
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{settings.openingHours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Ordering Information */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white uppercase tracking-wider text-xs mb-4">
              How Ordering Works
            </h3>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-xs text-stone-300 space-y-2">
              <p className="font-medium text-stone-100">1. Select your size & footwear</p>
              <p>2. Tap &ldquo;Order on WhatsApp&rdquo; or build your cart</p>
              <p>3. WhatsApp automatically prepares your order message</p>
              <p className="text-amber-300 font-medium">4. Shop confirms stock & delivery arrangement</p>
            </div>
            <div className="text-xs text-stone-500">
              All prices shown are inclusive of applicable taxes.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.shopName || 'Mahendra Footwear'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Admin Portal
            </button>
            <span>•</span>
            <span>Crafted for Indian Footwear Shoppers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
