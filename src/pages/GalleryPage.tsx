import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GalleryItem } from '../types';
import { Sparkles, Eye, X, Calendar, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GalleryPage: React.FC = () => {
  const { gallery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Store Interior',
    "Men's Fashion",
    "Kids' Fashion",
    'Accessories',
    'Collections',
  ];

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1c28] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Visual Walkthrough</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#fbf8f2]">
          Store & Collection Gallery
        </h1>
        <p className="text-sm sm:text-base text-[#a8a192] leading-relaxed">
          Take a look inside our BTM 1st Stage store floor, menswear selections, 
          kids' festive racks, and fine accessories.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black shadow-lg shadow-[#d4af37]/20 scale-105'
                : 'bg-[#151722] text-[#aba393] hover:text-white hover:bg-[#202334]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredGallery.length === 0 ? (
        <div className="py-24 text-center rounded-2xl bg-[#11131c] border border-dashed border-[#2b2f42] p-8 space-y-4">
          <Layers className="w-12 h-12 text-[#645c4e] mx-auto" />
          <h3 className="font-heading text-xl text-[#ded6c7]">No Images in this Category</h3>
          <p className="text-xs text-[#8c8474]">Select another category to browse gallery photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.imageId}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#12141f] border border-[#212433] hover:border-[#d4af37]/60 cursor-pointer transition-all duration-500 shadow-xl"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                  {item.category}
                </span>
                <h4 className="font-heading text-sm font-semibold text-white mt-1 line-clamp-2">
                  {item.title}
                </h4>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#ccc4b5]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Click to expand</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-[#12141e] border border-[#2e3246] rounded-2xl overflow-hidden flex flex-col">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-[#d4af37] hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-hidden max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-[#0f111a] border-t border-[#232637] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                  {activeItem.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">
                  {activeItem.title}
                </h3>
              </div>

              <Link
                to={`/book?category=${encodeURIComponent(
                  activeItem.category.includes('Kids')
                    ? "Kids' Fashion"
                    : activeItem.category.includes('Men')
                    ? "Men's Fashion"
                    : 'General Shopping Assistance'
                )}`}
                onClick={() => setActiveItem(null)}
                className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#ebd06b] transition-all flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Store Visit</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
