import { Notification } from "@/types/notifications";
import { create } from "zustand";

interface NotificationsStore {
  notifications: Notification[];
  loading: boolean;
  hasMore: boolean;
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  appendNotifications: (notifications: Notification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  reset: () => void;
}

export const useNotifications = create<NotificationsStore>((set, get) => ({
  notifications: [],
  loading: false,
  hasMore: true,
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  appendNotifications: (notifications) =>
    set((state) => {
      const merged = [...state.notifications, ...notifications];
      return {
        notifications: merged,
        unreadCount: merged.filter((n) => !n.isRead).length,
      };
    }),

  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  setLoading: (loading) => set({ loading }),
  setHasMore: (hasMore) => set({ hasMore }),

  reset: () => set({ notifications: [], loading: false, hasMore: true, unreadCount: 0 }),
}));
