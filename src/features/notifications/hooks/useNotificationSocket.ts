"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/auth.store";
import { useNotificationsStore } from "../notifications.store";
import { Notification } from "../notifications.types";

const WS_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/api\/v1\/?$/, "");

export function useNotificationSocket() {
  const socketRef = useRef<Socket | null>(null);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const addNotification = useNotificationsStore((s) => s.addNotification);
  const setConnected = useNotificationsStore((s) => s.setConnected);

  useEffect(() => {
    if (!user || !accessToken) return;

    const socket = io(`${WS_BASE_URL}/notifications`, {
      transports: ["websocket", "polling"],
      auth: { token: accessToken },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
    });

    socket.on("notification:new", (notification: Notification) => {
      addNotification(notification);
      toast(notification.title, {
        description: notification.body,
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user?.id, accessToken]);

  return { socket: socketRef.current };
}
