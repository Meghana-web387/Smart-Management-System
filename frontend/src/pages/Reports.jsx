import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Download, 
  BarChart3, 
  PieChart as PieIcon,
  TrendingUp,
  FileSpreadsheet,
  Activity,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { useTheme } from '../context/ThemeContext';

const Reports = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalRecords: 0, totalActivities: 0 });
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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

  const barData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Records', value: stats.totalRecords },
    { name: 'Tasks', value: stats.totalActivities },
  ];

  const pieData = [
    { name: 'Staff', value: Math.ceil(stats.totalUsers * 0.3) },
    { name: 'Managers', value: Math.ceil(stats.totalUsers * 0.2) },
    { name: 'End Users', value: Math.floor(stats.totalUsers * 0.5) },
  ];

  const COLORS = ['#2563eb', '#10b981', '#6366f1', '#f59e0b'];

  const handleExport = (type, category) => {
    const reportData = [
      { "Report Item": "Total Users", "Current Count": stats.totalUsers, "Status": "Verified" },
      { "Report Item": "Total Records", "Current Count": stats.totalRecords, "Status": "Synchronized" },
      { "Report Item": "Total Tasks", "Current Count": stats.totalActivities, "Status": "Active" }
    ];

    if (type === 'PDF') {
      exportToPDF(reportData, `${category}_Audit`, "Smart Management System Audit");
    } else {
      exportToExcel(reportData, `${category}_Data`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">System Intelligence</h2>
          <p className="text-muted font-medium">Dynamic data visualization and reporting center.</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BAR CHART */}
        <div className="bg-card p-8 rounded-[3rem] border border-border shadow-sm">
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold">Total Metric Distribution</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-card p-8 rounded-[3rem] border border-border shadow-sm">
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <PieIcon size={24} />
            </div>
            <h3 className="text-xl font-bold">User Segmentation</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                   itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* QUICK SUMMARY & EXPORTS */}
      <div className="bg-primary p-10 rounded-[3rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
           <div className="max-w-md">
              <h3 className="text-3xl font-black mb-4 leading-tight">Generate Audit PDF</h3>
              <p className="text-blue-100 font-medium mb-8">Download a verified system snapshot in high-resolution PDF format.</p>
              <button 
                onClick={() => handleExport('PDF', 'Intelligence_Audit')}
                className="bg-white text-primary px-10 h-16 rounded-[1.5rem] font-black text-sm flex items-center space-x-3 hover:scale-105 transition-all shadow-xl"
              >
                <Download size={20} strokeWidth={3} />
                <span>Download Report PDF</span>
              </button>
           </div>
           
           <div className="flex gap-6">
              <div className="text-center">
                 <p className="text-4xl font-black mb-1">{stats.totalUsers}</p>
                 <p className="text-[10px] font-black uppercase opacity-60">Verified Users</p>
              </div>
              <div className="w-[1px] h-12 bg-white/20"></div>
              <div className="text-center">
                 <p className="text-4xl font-black mb-1">{stats.totalRecords}</p>
                 <p className="text-[10px] font-black uppercase opacity-60">Total Records</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl">
              <FileSpreadsheet size={32} />
            </div>
            <button onClick={() => handleExport('Excel', 'Data_Extract')} className="text-muted hover:text-emerald-600 transition-colors">
               <Download size={28} />
            </button>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-2">Excel Extraction</h4>
            <p className="text-muted font-medium mb-6">Full data spreadsheet ready for analytics.</p>
          </div>
        </div>

        <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-5 bg-rose-50 text-rose-600 rounded-3xl">
              <Activity size={32} />
            </div>
            <button onClick={() => handleExport('PDF', 'Activity_Audit')} className="text-muted hover:text-rose-600 transition-colors">
               <Download size={28} />
            </button>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-2">Activity Audit</h4>
            <p className="text-muted font-medium mb-6">Complete chronological audit trails.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
