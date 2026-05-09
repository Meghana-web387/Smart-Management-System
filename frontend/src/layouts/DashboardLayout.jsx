import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  Bell,
  Mail,
  Camera,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const DashboardLayout = () => {
  const { user, logout, updateUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "System analysis completed", time: "2 min ago", unread: true },
    { id: 2, text: "New staff member onboarded", time: "1 hour ago", unread: true }
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser(profileData);
      setIsSaving(false);
      setShowProfileModal(false);
    }, 800);
  };

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ROLE_ADMIN', 'ROLE_OPERATOR', 'ROLE_USER'] },
    { to: '/users', icon: Users, label: 'Users', roles: ['ROLE_ADMIN'] },
    { to: '/records', icon: FileText, label: 'Records', roles: ['ROLE_ADMIN', 'ROLE_OPERATOR', 'ROLE_USER'] },
    { to: '/activities', icon: Activity, label: 'Activities', roles: ['ROLE_ADMIN', 'ROLE_OPERATOR'] },
    { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['ROLE_ADMIN', 'ROLE_OPERATOR', 'ROLE_USER'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-30 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="h-24 flex items-center px-6 border-b border-slate-50">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            S
          </div>
          {isSidebarOpen && <span className="ml-3 text-xl font-black text-slate-900">SmartMS</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredMenu.map((item) => (
            <SidebarLink key={item.to} {...item} active={location.pathname === item.to} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-6">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell size={22} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
            </button>
            
            {/* CLICKABLE PROFILE SECTION */}
            <button 
              onClick={() => {
                setProfileData({ name: user?.name || '', email: user?.email || '' });
                setShowProfileModal(true);
              }}
              className="flex items-center space-x-3 pl-4 border-l border-slate-100 hover:opacity-80 transition-all group"
            >
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role?.replace('ROLE_', '')}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                {user?.name?.charAt(0)}
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* PROFILE EDIT MODAL */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfileModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-md relative shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-blue-600"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-xl">
                    <div className="w-full h-full bg-slate-100 rounded-[1.8rem] flex items-center justify-center text-3xl font-black text-blue-600">
                      {profileData.name.charAt(0)}
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg text-slate-400 hover:text-blue-600 transition-all border border-slate-50">
                    <Camera size={16} />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-8">Account Settings</h3>
                
                <form onSubmit={handleUpdateProfile} className="w-full space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
                    <div className="relative">
                       <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="text" 
                         required
                         value={profileData.name}
                         onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                         className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900"
                       />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="email" 
                         required
                         value={profileData.email}
                         onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                         className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold text-slate-900"
                       />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" disabled={isSaving} className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center space-x-2">
                      {isSaving ? <span className="animate-pulse">Saving...</span> : <> <Check size={18} /> <span>Save Changes</span> </>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} className="fixed inset-0 bg-slate-900/10 z-40" />
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.95 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 20, scale: 0.95 }} 
              className="fixed top-24 right-8 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900">Notifications</h3>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))} 
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-3">
                 {notifications.map(n => (
                   <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.unread ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-slate-900 leading-tight">{n.text}</p>
                        {n.unread && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></div>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                   </div>
                 ))}
                 {notifications.length === 0 && (
                   <div className="text-center py-10 text-slate-400 font-bold text-sm">No new notifications</div>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
