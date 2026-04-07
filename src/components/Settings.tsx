import React from 'react';
import { motion } from 'motion/react';
import { Bell, Clock, CalendarX, AlertTriangle, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';

export default function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* User Profile Section */}
      <section className="mb-10">
        <div className="bg-surface-container-low rounded-xl p-6 flex items-center gap-5 transition-all hover:bg-surface-container cursor-pointer">
          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
            />
          </div>
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface">Alex Thompson</h2>
            <p className="font-label text-sm text-on-surface-variant">alex.thompson@example.com</p>
            <button className="mt-2 text-primary font-semibold text-xs py-1.5 px-4 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Notification Settings Headline */}
      <div className="mb-6">
        <h3 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">Notification Settings</h3>
        <p className="text-on-surface-variant mt-1 text-sm">Stay updated on your pantry's freshness</p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* Enable Push Notifications */}
        <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-on-surface">Enable Push Notifications</p>
              <p className="text-xs text-on-surface-variant">Get alerts directly on your device</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>

        {/* Default Reminder Time */}
        <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-on-surface">Default Reminder Time</p>
              <p className="text-xs text-on-surface-variant">Daily freshness update</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
            <span className="font-headline font-bold text-sm text-primary">9:00 AM</span>
            <ChevronRight className="w-4 h-4 text-primary rotate-90" />
          </div>
        </div>

        {/* Alert for Expired Items */}
        <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary">
              <CalendarX className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-on-surface">Alert for Expired Items</p>
              <p className="text-xs text-on-surface-variant">Immediate notification when items expire</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>

        {/* Alert for Items Expiring in 3 Days */}
        <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-on-surface">Alert for Items Expiring in 3 Days</p>
              <p className="text-xs text-on-surface-variant">Early warning for upcoming waste</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
      </div>

      {/* Account Control */}
      <div className="mt-12 mb-20">
        <h4 className="text-xs uppercase tracking-[0.15em] text-on-surface-variant font-bold mb-4 px-2">Account Control</h4>
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          <button className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-surface-container transition-colors group">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-on-surface-variant" />
              <span className="font-semibold">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-on-surface transition-colors" />
          </button>
          <div className="h-[1px] bg-outline-variant/10 mx-6" />
          <button className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-surface-container transition-colors group">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-error" />
              <span className="font-semibold text-error">Sign Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-error/40 group-hover:text-error transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
