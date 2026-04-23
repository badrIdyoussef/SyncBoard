import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Edit3,
  Search,
  FilterX,
  Layers,
  Activity,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { subscribeToTasks, createTask, updateTask, deleteTask, Task } from '../lib/taskService';
import { Navbar } from './Navbar';
import { cn } from '../lib/utils';

export function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid, (data) => {
        setTasks(data);
      });
      return unsubscribe;
    }
  }, [user]);

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active', value: tasks.filter(t => t.status === 'in-progress').length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const isAtLimit = tasks.length >= 10;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 sm:pt-28 pb-12 px-4 sm:px-6">
      <Navbar 
        isAtLimit={isAtLimit}
        onAddTask={() => { 
          if (isAtLimit) return;
          setEditingTask(null); 
          setIsModalOpen(true); 
        }} 
      />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Project Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and sync your development cycle.</p>
            {isAtLimit && (
              <p className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100 shadow-sm animate-pulse">
                <Zap className="w-3 h-3" />
                Quota Reached: 10/10 Demo Assets Created
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white border border-slate-200 p-1 sm:p-1.5 rounded-xl shadow-sm self-start">
            {['all', 'todo', 'in-progress', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200",
                  filter === f ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-bold text-lg">Resource Ledger</h2>
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-8 py-4 border-b border-slate-100">Asset Name</th>
                  <th className="px-8 py-4 border-b border-slate-100">Priority</th>
                  <th className="px-8 py-4 border-b border-slate-100">Status</th>
                  <th className="px-8 py-4 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <motion.tr
                        key={task.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-4 border-b border-slate-100 font-semibold text-slate-900">
                          {task.title}
                        </td>
                        <td className="px-8 py-4 border-b border-slate-100 font-mono text-[11px] font-bold">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full",
                            task.priority === 'high' ? "bg-red-50 text-red-600" :
                            task.priority === 'medium' ? "bg-amber-50 text-amber-600" :
                            "bg-emerald-50 text-emerald-600"
                          )}>
                            {task.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-8 py-4 border-b border-slate-100">
                          <button
                            onClick={() => updateTask(task.id!, { 
                              status: task.status === 'completed' ? 'todo' : 
                                      task.status === 'in-progress' ? 'completed' : 'in-progress' 
                            })}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 transition-all duration-200",
                              task.status === 'completed' ? "bg-indigo-100 text-indigo-700" : 
                              task.status === 'in-progress' ? "bg-emerald-100 text-emerald-700" : 
                              "bg-slate-100 text-slate-600"
                            )}
                          >
                            {task.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : 
                             task.status === 'in-progress' ? <Activity className="w-3 h-3 animate-pulse" /> : <Circle className="w-3 h-3" />}
                            {task.status.toUpperCase()}
                          </button>
                        </td>
                        <td className="px-8 py-4 border-b border-slate-100 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(task)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteTask(task.id!)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <FilterX className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching records found</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 flex flex-col gap-4 bg-white active:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                        <div className="flex gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            task.priority === 'high' ? "bg-red-50 text-red-600 border border-red-100" :
                            task.priority === 'medium' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleOpenEdit(task)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTask(task.id!)} className="p-2 text-red-500 bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        <span>Updated now</span>
                      </div>
                      <button
                        onClick={() => updateTask(task.id!, { 
                          status: task.status === 'completed' ? 'todo' : 
                                  task.status === 'in-progress' ? 'completed' : 'in-progress' 
                        })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-2 transition-all duration-200",
                          task.status === 'completed' ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : 
                          task.status === 'in-progress' ? "bg-emerald-100 text-emerald-700" : 
                          "bg-slate-100 text-slate-500"
                        )}
                      >
                        {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                         task.status === 'in-progress' ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Circle className="w-3.5 h-3.5" />}
                        {task.status.toUpperCase()}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : null}
            </AnimatePresence>
            {filteredTasks.length === 0 && (
              <div className="p-12 text-center">
                <FilterX className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">No results</p>
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredTasks.length} Assets Identified</span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Sync cycle complete</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-8 tracking-tight text-slate-900">
                  {editingTask ? 'Refine Objective' : 'New Strategic Record'}
                </h3>
                
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      title: formData.get('title') as string,
                      status: (formData.get('status') || 'todo') as any,
                      priority: (formData.get('priority') || 'medium') as any,
                    };

                    if (editingTask) {
                      await updateTask(editingTask.id!, data);
                    } else {
                      await createTask({ ...data, userId: user!.uid });
                    }
                    setIsModalOpen(false);
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Asset Designation</label>
                    <input
                      autoFocus
                      required
                      name="title"
                      defaultValue={editingTask?.title}
                      placeholder="e.g., Core API Refactor"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-sans font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Current Phase</label>
                      <select 
                        name="status"
                        defaultValue={editingTask?.status || 'todo'}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none font-medium"
                      >
                        <option value="todo">Pending Status</option>
                        <option value="in-progress">Live Processing</option>
                        <option value="completed">Cycle Complete</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Criticality</label>
                      <select 
                        name="priority"
                        defaultValue={editingTask?.priority || 'medium'}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none font-medium"
                      >
                        <option value="low">Standard</option>
                        <option value="medium">Elevated</option>
                        <option value="high">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-all text-sm border border-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!editingTask && isAtLimit}
                      className={cn(
                        "flex-[2] py-3 rounded-xl font-bold transition-all text-sm shadow-lg",
                        !editingTask && isAtLimit 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                      )}
                    >
                      {editingTask ? 'Commit Changes' : 'Initialize Record'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
