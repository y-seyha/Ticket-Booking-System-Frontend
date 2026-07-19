"use client";

import { create } from "zustand";
import { Notification } from "./notifications.types";

type NotificationsStore = {
  notifications: Notification[];
  unreadCount: number;
  connected: boolean;

  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
  clearNotifications: () => void;
  setConnected: (connected: boolean) => void;
};

export const useNotificationsStore = create<NotificationsStore>()((set) => ({
  notifications: [],
  unreadCount: 0,
  connected: false,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  decrementUnreadCount: () =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  setConnected: (connected) => set({ connected }),
}));
