import React from 'react';
import { motion } from 'motion/react';
import { AlarmClock, CheckCircle2, Trash2, ChevronRight, Droplet, Leaf, UtensilsCrossed, Fish, Cookie, Snowflake, Archive, ScanBarcode } from 'lucide-react';
import { Product, Category } from '../types';
import { cn } from '../lib/utils';
import { differenceInDays } from 'date-fns';

interface HomeProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function Home({ products, onDelete }: HomeProps) {
  const expiringSoonCount = products.filter(p => p.status === 'critical').length;
  const safeCount = products.filter(p => p.status === 'safe' || p.status === 'warning').length;

  const expiringToday = products.filter(p => p.status === 'critical');
  const next3Days = products.filter(p => p.status === 'warning');

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

  const getDaysLeft = (dateStr: string) => {
    const diff = differenceInDays(new Date(dateStr), new Date());
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Expires today';
    if (diff === 1) return '1 day left';
    return `${diff} days left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Hero Section */}
      <section className="space-y-1">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">Good morning, Alex.</h1>
        <p className="text-on-surface-variant font-medium">Your pantry is looking fresh today.</p>
      </section>

      {/* Summary Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 bg-tertiary-container/10 p-6 rounded-xl space-y-4 border border-tertiary-container/5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <AlarmClock className="w-24 h-24 text-tertiary" />
          </div>
          <p className="font-headline font-bold text-tertiary text-sm uppercase tracking-widest">Expiring Soon</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-headline font-extrabold text-tertiary">{expiringSoonCount}</span>
            <span className="text-on-tertiary-fixed-variant font-semibold">items</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-tertiary rounded-full transition-all duration-1000" 
              style={{ width: `${(expiringSoonCount / products.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="col-span-2 bg-primary-container/10 p-6 rounded-xl space-y-4 border border-primary-container/5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <CheckCircle2 className="w-24 h-24 text-primary" />
          </div>
          <p className="font-headline font-bold text-primary text-sm uppercase tracking-widest">Safe</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-headline font-extrabold text-primary">{safeCount}</span>
            <span className="text-on-primary-fixed-variant font-semibold">items</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${(safeCount / products.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Expiring Today Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold tracking-tight">Expiring Today</h2>
          <span className="text-tertiary text-sm font-bold uppercase tracking-widest">Action Required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expiringToday.map((product) => (
            <motion.div
              layout
              key={product.id}
              className="group relative bg-surface-container-lowest rounded-xl p-5 editorial-shadow border border-outline-variant/5 transition-transform duration-300 active:scale-95 flex items-center gap-5"
            >
              <div className="w-20 h-20 rounded-lg bg-surface-container-low flex-shrink-0 overflow-hidden">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                  src={product.imageUrl}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-on-surface">{product.name}</h3>
                <p className="text-sm text-on-surface-variant font-medium">{product.category} • {product.quantity}</p>
                {product.barcode && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <ScanBarcode className="w-3 h-3 text-on-surface-variant" />
                    <span className="text-[10px] font-mono text-on-surface-variant">{product.barcode}</span>
                  </div>
                )}
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[11px] font-bold rounded-full uppercase tracking-tighter">
                  {getDaysLeft(product.expiryDate)}
                </div>
              </div>
              <button 
                onClick={() => onDelete(product.id)}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface transition-colors hover:bg-tertiary hover:text-white"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Next 3 Days Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Next 3 Days</h2>
        <div className="bg-surface-container-low rounded-2xl overflow-hidden p-2 space-y-2">
          {next3Days.map((product) => {
            const Icon = getCategoryIcon(product.category);
            return (
              <div 
                key={product.id}
                className="bg-surface-container-lowest flex items-center justify-between p-4 rounded-xl transition-all hover:translate-x-1 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{product.name}</h4>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">
                      {product.category} • {getDaysLeft(product.expiryDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-1.5 w-24 bg-surface-container rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full bg-secondary-container w-2/3 rounded-full" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
