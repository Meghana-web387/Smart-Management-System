import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalRecords: 0, totalActivities: 0 });
  const [loading, setLoading] = useState(true);

  // Weekly trend data for the bar chart
  const data = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 25 },
    { name: 'Fri', count: 32 },
    { name: 'Sat', count: 20 },
    { name: 'Sun', count: stats.totalRecords || 10 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/summary');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-bold">Synchronizing system...</div>;

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h2>
        <p className="text-slate-500 font-medium">Unified oversight of system performance and data.</p>
      </motion.div>

      {/* Unified Blue Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Users */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Users size={24} />
              </div>
              <TrendingUp size={20} className="text-blue-100" />
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.totalUsers}</h3>
            <p className="text-blue-100 font-medium">Total System Users</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Verified Records */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <FileText size={24} />
              </div>
              <ArrowUpRight size={20} className="text-blue-100" />
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.totalRecords}</h3>
            <p className="text-blue-100 font-medium">Verified Records</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* System Activities */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Activity size={24} />
              </div>
              <Calendar size={20} className="text-blue-100" />
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.totalActivities}</h3>
            <p className="text-blue-100 font-medium">System Activities</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* PROFESSIONAL BAR CHART */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Activity Distribution</h3>
            <p className="text-sm text-slate-400 font-medium">Weekly interaction audit overview</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={45}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#1e40af' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
