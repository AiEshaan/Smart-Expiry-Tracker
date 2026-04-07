import React from 'react';
import { LayoutDashboard, Archive, PlusCircle, Settings, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'pantry', label: 'Pantry', icon: Archive },
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Leaf className="text-primary w-6 h-6 fill-primary" />
          <span className="text-primary font-extrabold text-xl tracking-tight font-headline">FreshFocus</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/10">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32 px-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 bg-white/60 backdrop-blur-2xl z-50 rounded-t-[2rem] shadow-[0_-4px_24px_rgba(0,0,0,0.04)] border-t border-outline-variant/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-[1.25rem]",
                isActive 
                  ? "bg-primary/10 text-primary scale-100" 
                  : "text-on-surface-variant/40 hover:text-primary/60 scale-90"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
