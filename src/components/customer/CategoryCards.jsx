import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export default function CategoryCards({ activeCategory, onSelectCategory }) {
  const { stats } = useProducts();

  const categoriesData = [
    {
      id: "Men's Shoes",
      title: "Men's Shoes",
      subtitle: "Formal, Sports & Loafers",
      image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
      count: stats.byCategory["Men's Shoes"] || 0,
      badge: "Men's Collection",
    },
    {
      id: "Men's Slippers",
      title: "Men's Slippers",
      subtitle: "Slides, Ortho & Kolhapuri",
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80",
      count: stats.byCategory["Men's Slippers"] || 0,
      badge: "Daily Wear",
    },
    {
      id: "Ladies' Sandals",
      title: "Ladies' Sandals",
      subtitle: "Block Heels, Flats & Wedges",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
      count: stats.byCategory["Ladies' Sandals"] || 0,
      badge: "Ladies' Collection",
    },
    {
      id: "Ladies' Slippers",
      title: "Ladies' Slippers",
      subtitle: "Doctor Ortho & Velvet Slides",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      count: stats.byCategory["Ladies' Slippers"] || 0,
      badge: "Comfort Fit",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Browse By Department
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Featured Categories
          </h2>
        </div>
        <p className="text-sm text-stone-500 mt-1 sm:mt-0">
          Showing 4 verified footwear collections
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categoriesData.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative rounded-2xl overflow-hidden text-left border transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-4 sm:p-5 focus:outline-none ${
                isSelected
                  ? 'ring-2 ring-brand-600 border-transparent shadow-elevated'
                  : 'border-stone-200 hover:border-stone-400 shadow-sm hover:shadow-card'
              }`}
            >
              {/* Background Product Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent group-hover:from-stone-950/90 transition-colors" />

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 rounded">
                  {cat.badge}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1">{cat.subtitle}</p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-300 font-medium">
                    {cat.count} {cat.count === 1 ? 'item' : 'items'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-brand-600 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
