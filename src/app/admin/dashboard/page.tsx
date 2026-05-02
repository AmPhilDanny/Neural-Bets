import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Clock,
  ShieldCheck,
  Brain
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  
  // Basic security: Check if user is the admin (hardcoded for now or based on email)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!session || session.user.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  // Fetch Stats
  const [userCount, premiumCount, vipCount, totalRevenue, transactions, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'PREMIUM' } }),
    prisma.user.count({ where: { tier: 'VIP' } }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' }
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: true }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Neural Control Panel</h1>
            <p className="text-slate-400 text-sm">Managing the ecosystem and intelligence distribution</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
               <Activity size={14} /> System Online
             </div>
             <a href="/" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10">View Frontend</a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Intelligence Users', value: userCount, icon: Users, color: 'text-primary' },
            { label: 'Premium Nodes', value: premiumCount, icon: ShieldCheck, color: 'text-emerald-500' },
            { label: 'VIP Priority Nodes', value: vipCount, icon: Crown, color: 'text-amber-500' },
            { label: 'Total Ecosystem Revenue', value: `₦${(totalRevenue._sum.amount || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-cyan-500' },
          ].map((stat, i) => (
            <div key={i} className="card-base p-6 bg-white/[0.03] border-white/5">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-base p-8 bg-white/[0.03] border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                   <CreditCard size={20} className="text-primary" /> Recent Transactions
                </h2>
                <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white">View All</button>
              </div>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {tx.status === 'SUCCESS' ? <CheckCircle size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{tx.user.email}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{tx.tier} {tx.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">₦{tx.amount.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Registrations */}
          <div className="space-y-8">
            <div className="card-base p-8 bg-white/[0.03] border-white/5">
              <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 mb-8">
                <UserPlus size={20} className="text-emerald-500" /> New Users
              </h2>
              <div className="space-y-6">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-black uppercase">
                      {user.email[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 truncate">{user.email}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{user.tier} Member</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-base p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <h2 className="text-lg font-bold uppercase tracking-tight mb-6">Engine Controls</h2>
              <div className="grid gap-3">
                 <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-left px-4 flex items-center justify-between">
                   Refresh AI Cache <Activity size={12} />
                 </button>
                 <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-left px-4 flex items-center justify-between">
                   Sync External Nodes <Brain size={12} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
