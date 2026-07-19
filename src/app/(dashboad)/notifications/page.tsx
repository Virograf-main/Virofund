"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/store/useNotificationsStore";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    hasMore,
    setNotifications,
    appendNotifications,
    markRead,
    markAllRead,
    setHasMore,
  } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getNotifications(0, PAGE_SIZE);
      setNotifications(data);
      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const data = await getNotifications(notifications.length, PAGE_SIZE);
    appendNotifications(data);
    setHasMore(data.length === PAGE_SIZE);
    setLoadingMore(false);
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <section className="bg-muted p-8 rounded-2xl text-center">
        <Image
          src="/svg/no-data.svg"
          width={180}
          height={180}
          alt="No notifications"
          className="mx-auto"
        />
        <p className="mt-4 text-muted-foreground">
          You're all caught up — no notifications yet.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-muted p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <p className="font-bold text-xl">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({unreadCount} unread)
            </span>
          )}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="text-sm text-primary hover:underline disabled:opacity-50 cursor-pointer"
          >
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.isRead && handleMarkRead(n.id)}
            className={cn(
              "w-full text-left flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors cursor-pointer",
              !n.isRead && "border-primary/30 bg-primary/5"
            )}
          >
            {!n.isRead && (
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
            <div className={cn("min-w-0 flex-1", n.isRead && "pl-5")}>
              <p
                className={cn(
                  "text-sm",
                  n.isRead
                    ? "text-muted-foreground"
                    : "text-foreground font-medium"
                )}
              >
                {n.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(n.createdAt)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50 cursor-pointer"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
