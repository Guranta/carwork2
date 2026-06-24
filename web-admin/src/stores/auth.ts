import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  setAuth: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      setAuth: (token, admin) => set({ token, admin }),
      logout: () => set({ token: null, admin: null }),
    }),
    { name: 'carwork-admin-auth' },
  ),
);
