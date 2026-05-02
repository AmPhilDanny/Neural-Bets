'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Zap, Shield, X, Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  tier: 'PREMIUM' | 'VIP';
  price: number;
  duration: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'premium_daily',
    name: 'Premium Daily',
    tier: 'PREMIUM',
    price: 2500,
    duration: 'DAILY',
    features: ['Access to 2x Safe Odds', 'Access to 5x Medium Odds', 'Email Notifications', 'Standard Support']
  },
  {
    id: 'vip_weekly',
    name: 'VIP Weekly',
    tier: 'VIP',
    price: 15000,
    duration: 'WEEKLY',
    features: ['All Premium Features', 'Access to 10x High Risk Odds', 'WhatsApp Priority Alerts', '24/7 VIP Support', 'Early Access']
  }
];

export function SubscriptionModal({ isOpen, onClose, userEmail }: { isOpen: boolean, onClose: () => void, userEmail?: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    if (!userEmail) {
      window.location.href = '/login';
      return;
    }
    
    setLoading(plan.id);
    // Here we would call initializePayment
    // For now, simulating the redirect
    setTimeout(() => {
      alert(`Initializing Paystack for ${plan.name} (₦${plan.price})`);
      setLoading(null);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 border-r border-white/10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                   Scarcity: Only 7 VIP Slots Left
                </div>
                <h2 className="text-4xl font-black mb-6 tracking-tight leading-none">Unlock the <span className="text-primary">Neural Advantage</span></h2>
                <p className="text-slate-400 mb-8 leading-relaxed">Join 2,400+ members who receive professional high-probability consensus slips every morning.</p>
                
                <div className="space-y-4">
                  {[
                    { text: '78.4% Verified Win Rate', icon: Shield },
                    { text: 'Single Device Session Locking', icon: Zap },
                    { text: 'Instant WhatsApp Notifications', icon: Crown },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <f.icon size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-200">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-12 space-y-6">
                {PLANS.map(plan => (
                  <div key={plan.id} className={`p-6 rounded-3xl border transition-all ${plan.tier === 'VIP' ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black uppercase tracking-widest text-xs mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black">₦{plan.price.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-500 lowercase tracking-widest">/ {plan.duration}</span>
                        </div>
                      </div>
                      <div className={`p-2 rounded-xl ${plan.tier === 'VIP' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                        {plan.tier === 'VIP' ? <Crown size={16} /> : <Zap size={16} />}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleSubscribe(plan)}
                      disabled={!!loading}
                      className={`w-full py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                        plan.tier === 'VIP' 
                          ? 'bg-amber-500 text-black hover:bg-amber-400' 
                          : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                      }`}
                    >
                      {loading === plan.id ? <Loader2 className="animate-spin" size={14} /> : 'Get Started'}
                    </button>
                  </div>
                ))}
                
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secured by Paystack</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
