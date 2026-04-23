import { Chrome, LayoutDashboard, Database, ShieldCheck } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { motion } from 'motion/react';

export function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-xl bg-white shadow-sm border border-slate-200 mb-6">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-sans font-bold text-slate-900 tracking-tight mb-2">SyncBoard</h1>
          <p className="text-slate-500 font-medium">Professional asset management for builders.</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-200/50">
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all duration-200"
            >
              <Chrome className="w-5 h-5" />
              Sign in with Google
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-slate-100" />
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Platform Specs</span>
              <div className="h-[1px] flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Database className="w-4 h-4 text-indigo-500 mb-2" />
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">State</p>
                <p className="text-xs text-slate-700 font-semibold italic">Real-time Enabled</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mb-2" />
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">Security</p>
                <p className="text-xs text-slate-700 font-semibold italic">8-Pillar Fortified</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-slate-400 text-sm font-medium">
            Join 1,280+ other developers managing assets.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
