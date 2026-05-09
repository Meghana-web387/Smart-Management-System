import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // DEMO MODE: If backend is down, return mock data for specific routes
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404 || error.response?.status === 500) {
      if (error.config.url.includes('/auth/signin')) {
        const payload = JSON.parse(error.config.data);
        const email = payload.email.toLowerCase();
        
        let role = 'ROLE_USER';
        let name = 'Demo User';
        
        if (email.includes('admin')) {
          role = 'ROLE_ADMIN';
          name = 'System Admin';
        } else if (email.includes('op')) {
          role = 'ROLE_OPERATOR';
          name = 'Staff Operator';
        }

        return {
          data: {
            token: 'mock-jwt-token',
            email: email,
            name: name,
            role: role
          }
        };
      }
      if (error.config.url.includes('/reports/summary')) {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const records = JSON.parse(localStorage.getItem('mockRecords') || '[]');
        const activities = JSON.parse(localStorage.getItem('mockActivities') || '[]');
        return {
          data: { 
            totalUsers: users.length || 12, 
            totalRecords: records.length || 25, 
            totalActivities: activities.length || 15 
          }
        };
      }
      if (error.config.url.includes('/records')) {
        let mockRecords = JSON.parse(localStorage.getItem('mockRecords'));
        if (!mockRecords) {
          mockRecords = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            title: `Record #${i + 1}`,
            description: `Management log entry for system unit ${i + 1}`,
            status: i % 3 === 0 ? 'COMPLETED' : i % 3 === 1 ? 'PENDING' : 'ARCHIVED'
          }));
          localStorage.setItem('mockRecords', JSON.stringify(mockRecords));
        }

        if (error.config.method === 'post') {
          const newRecord = { ...JSON.parse(error.config.data), id: Date.now() };
          mockRecords.unshift(newRecord);
          localStorage.setItem('mockRecords', JSON.stringify(mockRecords));
          return { data: newRecord };
        }
        if (error.config.method === 'delete') {
          const id = parseInt(error.config.url.split('/').pop());
          mockRecords = mockRecords.filter(r => r.id !== id);
          localStorage.setItem('mockRecords', JSON.stringify(mockRecords));
          return { data: { success: true } };
        }
        return { data: mockRecords };
      }
      if (error.config.url.includes('/users')) {
        let mockUsers = JSON.parse(localStorage.getItem('mockUsers'));
        if (!mockUsers) {
          mockUsers = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: i === 0 ? 'Admin User' : i % 4 === 0 ? 'Staff Member' : `User ${i + 1}`,
            email: i === 0 ? 'admin@demo.com' : i % 4 === 0 ? `staff${i + 1}@smartms.com` : `user${i + 1}@smartms.com`,
            role: i === 0 ? 'ROLE_ADMIN' : i % 4 === 0 ? 'ROLE_OPERATOR' : 'ROLE_USER',
            status: 'ACTIVE'
          }));
          localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        }

        if (error.config.method === 'post') {
          const newUser = { ...JSON.parse(error.config.data), id: Date.now(), status: 'ACTIVE' };
          mockUsers.push(newUser);
          localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
          return { data: newUser };
        }
        if (error.config.method === 'delete') {
          const id = parseInt(error.config.url.split('/').pop());
          mockUsers = mockUsers.filter(u => u.id !== id);
          localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
          return { data: { success: true } };
        }
        return { data: mockUsers };
      }
      if (error.config.url.includes('/activities')) {
        let mockActivities = JSON.parse(localStorage.getItem('mockActivities'));
        if (!mockActivities) {
          mockActivities = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            activityName: `Daily Check ${i + 1}`,
            activityDate: new Date().toISOString(),
            status: i % 2 === 0 ? 'COMPLETED' : 'IN_PROGRESS',
            remarks: `System check complete for node ${i + 1}`,
            assignedUser: { name: `Admin` }
          }));
          localStorage.setItem('mockActivities', JSON.stringify(mockActivities));
        }

        if (error.config.method === 'post') {
          const newActivity = { ...JSON.parse(error.config.data), id: Date.now(), assignedUser: { name: 'Admin' } };
          mockActivities.unshift(newActivity);
          localStorage.setItem('mockActivities', JSON.stringify(mockActivities));
          return { data: newActivity };
        }
        if (error.config.method === 'put') {
          const id = parseInt(error.config.url.split('/').pop());
          const updatedData = JSON.parse(error.config.data);
          mockActivities = mockActivities.map(a => a.id === id ? { ...a, ...updatedData } : a);
          localStorage.setItem('mockActivities', JSON.stringify(mockActivities));
          return { data: { ...updatedData, id } };
        }
        if (error.config.method === 'delete') {
          const id = parseInt(error.config.url.split('/').pop());
          mockActivities = mockActivities.filter(a => a.id !== id);
          localStorage.setItem('mockActivities', JSON.stringify(mockActivities));
          return { data: { success: true } };
        }
        return { data: mockActivities };
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
