import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Crown, Zap, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        <Link href="/" className="text-primary hover:text-primary/80 transition-colors mb-8 inline-block text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} className="inline mr-2" /> Back to Home
        </Link>
        
        <div className="card-base p-8 border-primary/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Crown size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-black uppercase tracking-tight text-center mb-2">
            Join VIP Access
          </h1>
          <p className="text-slate-400 text-center text-sm mb-8">Unlock the full power of the Neural Prediction Engine</p>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
              <Zap size={16} className="text-amber-500 mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">10x+ Slips</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
              <ShieldCheck size={16} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Verified</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="user@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="••••••••" />
            </div>
            
            <button className="w-full py-3 mt-4 rounded-xl bg-amber-500 text-white font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              Create VIP Account
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already a member? <Link href="/login" className="text-amber-500 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
