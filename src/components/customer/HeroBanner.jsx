import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { generateGeneralEnquiryWhatsAppLink } from '../../utils/whatsapp';

export default function HeroBanner({ onSelectCategory }) {
  const { settings } = useSettings();
  const enquiry = generateGeneralEnquiryWhatsAppLink(settings.whatsappNumber);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-150/60 to-white pt-8 pb-14 sm:pb-20 border-b border-stone-200">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-stone-900 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Festive & Daily Footwear Collection</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08]">
              Step into Comfort. <br />
              <span className="text-brand-600 underline decoration-brand-200 decoration-wavy decoration-2">
                Walk with Pride.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover authentic Indian craftsmanship in every step. From durable formal leather shoes & lightweight running sneakers to orthopedic daily slippers and festive ladies&apos; sandals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onSelectCategory("Men's Shoes")}
                className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Shop Men&apos;s</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory("Ladies' Sandals")}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-semibold text-sm border border-stone-300 hover:border-stone-400 shadow-sm transition-all"
              >
                <span>Shop Ladies&apos;</span>
              </button>

              {enquiry.isValid && (
                <a
                  href={enquiry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order on WhatsApp</span>
                </a>
              )}
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Stock Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span>Sizes 4 to 11 Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Direct Shop Support</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-elevated border border-stone-200/80 bg-stone-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
                  alt="Featured Footwear Collection"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-brand-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider self-start mb-2">
                    Popular Choice
                  </span>
                  <h3 className="font-display text-xl font-bold">Genuine Leather & Comfort Soles</h3>
                  <p className="text-xs text-stone-300 mt-1">Available across Men&apos;s & Ladies&apos; collections</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-elevated border border-stone-200 flex items-center gap-3 hidden sm:flex">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                  ₹
                </div>
                <div>
                  <div className="text-xs text-stone-500 font-medium">Clear Savings</div>
                  <div className="text-sm font-bold text-stone-900">Up to 35% Discount</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
