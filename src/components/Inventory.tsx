import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, Check, Droplet, Leaf, Fish, Archive, Info, Cookie, Snowflake, ScanBarcode } from 'lucide-react';
import { Product, Category } from '../types';
import { cn } from '../lib/utils';
import { format, differenceInDays } from 'date-fns';

interface InventoryProps {
  products: Product[];
  onToggleUsed: (id: string) => void;
}

export default function Inventory({ products, onToggleUsed }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const categories: (Category | 'All')[] = ['All', 'Dairy', 'Produce', 'Meat', 'Bakery', 'Pantry', 'Frozen'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Dairy': return Droplet;
      case 'Produce': return Leaf;
      case 'Meat': return Fish;
      case 'Bakery': return Cookie;
      case 'Frozen': return Snowflake;
      default: return Archive;
    }
  };

  const getStatusText = (product: Product) => {
    const diff = differenceInDays(new Date(product.expiryDate), new Date());
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Expires Today';
    if (diff === 1) return '1 Day Left';
    if (diff <= 7) return `${diff} Days Left`;
    return 'Safe';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Headline */}
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">My Inventory</h2>
        <p className="text-on-surface-variant font-label text-sm">Managing {products.length} active items</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all"
          placeholder="Search your pantry..."
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all",
              activeCategory === cat
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const Icon = getCategoryIcon(product.category);
          return (
            <motion.div
              layout
              key={product.id}
              className="bg-surface-container-lowest p-5 rounded-[1.5rem] flex gap-4 items-center editorial-shadow border border-transparent hover:border-outline-variant/20 transition-all"
            >
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center",
                product.status === 'critical' ? "bg-tertiary-container/10 text-tertiary" :
                product.status === 'warning' ? "bg-secondary-container/10 text-secondary" :
                "bg-primary-container/10 text-primary"
              )}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-on-surface text-lg">{product.name}</h3>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    product.status === 'critical' ? "bg-tertiary-container text-on-tertiary-container" :
                    product.status === 'warning' ? "bg-secondary-container text-on-secondary-container" :
                    "bg-primary-container/20 text-on-primary-fixed-variant"
                  )}>
                    {getStatusText(product)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3 h-3 text-outline" />
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {format(new Date(product.expiryDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                {product.barcode && (
                  <div className="flex items-center gap-2 mb-3">
                    <ScanBarcode className="w-3 h-3 text-outline" />
                    <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                      {product.barcode}
                    </span>
                  </div>
                )}
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      product.status === 'critical' ? "bg-tertiary" :
                      product.status === 'warning' ? "bg-secondary-container" :
                      "bg-primary"
                    )}
                    style={{ width: product.status === 'critical' ? '95%' : product.status === 'warning' ? '70%' : '30%' }}
                  />
                </div>
              </div>
              <button 
                onClick={() => onToggleUsed(product.id)}
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:bg-primary-container hover:text-on-primary-container hover:border-transparent transition-all"
              >
                <Check className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Section */}
      <div className="mt-12 mb-8 bg-primary-container rounded-[2rem] p-8 text-on-primary-container relative overflow-hidden">
        <div className="relative z-10 max-w-[60%]">
          <h4 className="text-2xl font-extrabold mb-2 leading-tight">Fresh Tip</h4>
          <p className="text-sm opacity-90 leading-relaxed">Store your spinach in a sealed container with a paper towel to absorb moisture and keep it fresh for up to 3 days longer.</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
          <Info className="w-48 h-48" />
        </div>
      </div>
    </motion.div>
  );
}
