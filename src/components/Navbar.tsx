import { LogOut, LayoutDashboard, Plus } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export function Navbar({ onAddTask, isAtLimit }: { onAddTask: () => void; isAtLimit: boolean }) {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
            <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-slate-900">SyncBoard</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onAddTask}
            disabled={isAtLimit}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md",
              isAtLimit 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden min-[420px]:inline">New Task</span>
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 hidden min-[420px]:block" />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">{user?.displayName}</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Portfolio Guest</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200 shadow-sm overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user?.displayName?.charAt(0) || 'U'
              )}
            </div>
            <button
              onClick={() => auth.signOut()}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
