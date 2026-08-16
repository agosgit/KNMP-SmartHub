import { create } from 'zustand';

const useAppStore = create((set) => ({
  token: localStorage.getItem('knmp_token') || null,
  user: JSON.parse(localStorage.getItem('knmp_user')) || null,
  isAuthenticated: !!localStorage.getItem('knmp_token'),
  isSidebarOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),

  login: (userData, token) => {
    localStorage.setItem('knmp_token', token);
    localStorage.setItem('knmp_user', JSON.stringify(userData));
    set({
      token,
      user: userData,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('knmp_token');
    localStorage.removeItem('knmp_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isSidebarOpen: false,
    });
  },

  updateUser: (userData) => {
    const currentUser = JSON.parse(localStorage.getItem('knmp_user')) || {};
    const updated = { ...currentUser, ...userData };
    localStorage.setItem('knmp_user', JSON.stringify(updated));
    set({ user: updated });
  },
}));

export default useAppStore;
