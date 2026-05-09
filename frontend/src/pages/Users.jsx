import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, UserX, UserCheck, Shield, Mail, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'ROLE_USER' });

  useEffect(() => {
    fetchUsers();
    
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setShowModal(false);
      setNewUser({ name: '', email: '', role: 'ROLE_USER' });
      fetchUsers();
    } catch (err) {
      alert('Failed to add user');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.put(`/users/${id}/status`, nextStatus, { headers: { 'Content-Type': 'text/plain' } });
      fetchUsers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Permanent delete?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field input-with-icon"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2 whitespace-nowrap"
          >
            <UserCheck size={18} />
            <span>Add User</span>
          </button>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100">
          Total Users: <span className="text-slate-900">{users.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            layout
            key={user.id}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Shield size={32} />
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                    user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">{user.name}</h3>
              <div className="flex items-center space-x-2 text-slate-400 text-sm mb-6">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Permissions</p>
                  <p className="text-sm font-bold text-slate-700">{user.role?.replace('ROLE_', '')}</p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Joined</p>
                  <p className="text-sm font-bold text-slate-700">May 2026</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => toggleStatus(user.id, user.status)}
                  className={`p-2.5 rounded-xl transition-all ${
                    user.status === 'ACTIVE' ? 'text-rose-500 hover:bg-rose-100' : 'text-emerald-500 hover:bg-emerald-100'
                  }`}
                >
                  {user.status === 'ACTIVE' ? <UserX size={20} /> : <UserCheck size={20} />}
                </button>
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
          No users found matching your search
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-md relative shadow-2xl"
            >
              <h3 className="text-3xl font-black text-slate-900 mb-6">Onboard New User</h3>
              <form onSubmit={handleAddUser} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="input-field"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role Assignment</label>
                  <select 
                    className="input-field appearance-none"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="ROLE_USER">Standard User</option>
                    <option value="ROLE_OPERATOR">Staff Member</option>
                    <option value="ROLE_ADMIN">Administrator</option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary h-12"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary h-12">
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
