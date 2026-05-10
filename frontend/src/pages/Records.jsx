import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, MoreVertical, Edit2, Trash2, Filter, Download, Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newRecord, setNewRecord] = useState({ 
    title: '', 
    description: '', 
    status: 'IN PROGRESS',
    date: new Date().toISOString().split('T')[0]
  });

  // Role permissions
  const canManage = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_OPERATOR';

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records');
      const mappedData = (res.data || []).map(item => ({
        ...item,
        status: item.status === 'PENDING' ? 'IN PROGRESS' : item.status
      }));
      setRecords(mappedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    try {
      if (editingId) {
        await api.put(`/records/${editingId}`, newRecord);
      } else {
        await api.post('/records', newRecord);
      }
      setShowModal(false);
      setEditingId(null);
      setNewRecord({ title: '', description: '', status: 'IN PROGRESS', date: new Date().toISOString().split('T')[0] });
      fetchRecords();
    } catch (err) {
      alert('Failed to save record');
    }
  };

  const deleteRecord = async (id) => {
    if (!canManage) return;
    if (window.confirm('Delete this record?')) {
      try {
        await api.delete(`/records/${id}`);
        fetchRecords();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleExport = (type) => {
    if (type === 'PDF') {
      exportToPDF(filteredRecords, 'System_Records', 'Verified Records Audit');
    } else {
      exportToExcel(filteredRecords, 'System_Records');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = (record.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (record.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-8 text-slate-500 font-bold">Synchronizing records...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Records</h2>
          <p className="text-slate-500 font-medium">Manage and audit verified system data.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => handleExport('Excel')} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
            <Download size={20} />
          </button>
          {canManage && (
            <button 
              onClick={() => { setEditingId(null); setNewRecord({ title: '', description: '', status: 'IN PROGRESS', date: new Date().toISOString().split('T')[0] }); setShowModal(true); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <Plus size={20} />
              <span>Add Record</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records..."
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-hidden">
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
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest pl-4">Record Info</th>
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Description</th>
                <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</th>
                {canManage && <th className="pb-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right pr-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.map((record) => (
                <motion.tr layout key={record.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-5 pl-4">
                    <p className="font-bold text-slate-900">{record.title}</p>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase mt-1">
                      <CalendarIcon size={12} />
                      <span>{record.date}</span>
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-slate-500 font-medium max-w-xs truncate">{record.description}</p>
                  </td>
                  <td className="py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      record.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  {canManage && (
                    <td className="py-5 text-right pr-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => { setEditingId(record.id); setNewRecord(record); setShowModal(true); }}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-bold text-sm italic">
              No matching records found.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && canManage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative shadow-2xl overflow-hidden">
               <h3 className="text-2xl font-black text-slate-900 mb-8">{editingId ? 'Edit Record' : 'New Record'}</h3>
               <form onSubmit={handleAddRecord} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Record Title</label>
                    <input 
                      type="text" 
                      required
                      value={newRecord.title}
                      onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                      className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Detailed Description</label>
                    <textarea 
                      required
                      value={newRecord.description}
                      onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                      className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Entry Date</label>
                      <input 
                        type="date" 
                        required
                        value={newRecord.date}
                        onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Final Status</label>
                      <select 
                        value={newRecord.status}
                        onChange={(e) => setNewRecord({...newRecord, status: e.target.value})}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 cursor-pointer"
                      >
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">Save Record</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;
