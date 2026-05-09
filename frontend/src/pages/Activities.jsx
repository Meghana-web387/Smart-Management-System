import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Activities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newActivity, setNewActivity] = useState({ 
    title: '', 
    description: '',
    status: 'IN PROGRESS' 
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/activities');
      const data = res.data || [];
      const mappedData = data.map(item => ({
        ...item,
        status: (item.status === 'PENDING' || !item.status) ? 'IN PROGRESS' : item.status,
        description: item.description || ''
      }));
      setActivities(mappedData);
    } catch (err) {
      console.error("Fetch activities error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/activities/${editingId}`, newActivity);
      } else {
        await api.post('/activities', newActivity);
      }
      setShowModal(false);
      setEditingId(null);
      setNewActivity({ title: '', description: '', status: 'IN PROGRESS' });
      fetchActivities();
    } catch (err) {
      alert('Failed to save task');
    }
  };

  const deleteActivity = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/activities/${id}`);
        fetchActivities();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const filteredActivities = activities.filter(activity => {
    const title = activity.title || '';
    const desc = activity.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || activity.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-8 text-slate-500 font-bold">Synchronizing system...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Activities</h2>
          <p className="text-slate-500 font-medium">Chronological audit of system tasks and operations.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setNewActivity({ title: '', description: '', status: 'IN PROGRESS' }); setShowModal(true); }}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search activities..."
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {['All', 'COMPLETED', 'IN PROGRESS'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-left">
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest pl-4">Task Name</th>
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Description</th>
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</th>
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredActivities.map((activity) => (
                <motion.tr layout key={activity.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-5 pl-4">
                    <div className="flex items-center space-x-3">
                       <div className={`w-2 h-2 rounded-full ${activity.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                       <p className="font-bold text-slate-900">{activity.title}</p>
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-slate-500 font-medium max-w-xs truncate">{activity.description}</p>
                  </td>
                  <td className="py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      activity.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="py-5 text-right pr-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => { setEditingId(activity.id); setNewActivity(activity); setShowModal(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteActivity(activity.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-md relative shadow-2xl overflow-hidden">
               <h3 className="text-2xl font-black text-slate-900 mb-8">{editingId ? 'Edit Task' : 'New Task'}</h3>
               <form onSubmit={handleAddActivity} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Task Name</label>
                    <input 
                      type="text" 
                      required
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                      className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Task Description</label>
                    <textarea 
                      required
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Current Status</label>
                    <select 
                      value={newActivity.status}
                      onChange={(e) => setNewActivity({...newActivity, status: e.target.value})}
                      className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <div className="flex space-x-3 pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">Save Task</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Activities;
