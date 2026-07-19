"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/store/useNotificationsStore";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const { notifications, unreadCount, setNotifications, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getNotifications(0, 10);
      setNotifications(data);
      setLoading(false);
    };
    load();
  }, [setNotifications]);

  const handleMarkRead = async (id: string) => {
    markRead(id); // optimistic
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    markAllRead(); // optimistic
    await markAllNotificationsAsRead();
    setMarkingAll(false);
  };

  const recent = notifications.slice(0, 6);
  const badgeLabel = unreadCount >= 10 ? "9+" : String(unreadCount);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none">
              {badgeLabel}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="text-xs text-primary hover:underline disabled:opacity-50 cursor-pointer"
            >
              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8 px-4">
              You're all caught up — no notifications yet.
            </p>
          ) : (
            recent.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors flex gap-2 items-start cursor-pointer",
                  !n.isRead && "bg-primary/5"
                )}
              >
                {!n.isRead && (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
                <div className={cn("min-w-0", n.isRead && "pl-3.5")}>
                  <p
                    className={cn(
                      "text-xs line-clamp-2",
                      n.isRead
                        ? "text-muted-foreground"
                        : "text-foreground font-medium"
                    )}
                  >
                    {n.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-auto" />
                )}
              </button>
            ))
          )}
        </div>

        <Link
          href="/notifications"
          onClick={() => setOpen(false)}
          className="block text-center text-xs font-medium text-primary py-2.5 border-t border-border hover:bg-secondary/50 transition-colors"
        >
          See all notifications
        </Link>
      </PopoverContent>
    </Popover>
  );
}
