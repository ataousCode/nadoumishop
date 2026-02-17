"use client";

import * as React from "react";
import {
  Bell,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Check,
  Trash2,
  Loader2,
  Settings,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { toast } from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ORDER" | "PAYMENT" | "CANCELATION" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case "PAYMENT":
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case "CANCELATION":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-orange-500 rounded-full border-2 border-white" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 shadow-xl border-gray-100"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50 rounded-t-lg">
          <h3 className="font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="bg-orange-500 text-white border-none">
              {unreadCount} New
            </Badge>
          )}
        </div>
        <ScrollArea className="h-[350px]">
          {loading ? (
            <div className="flex h-full items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-500 px-4">
              <Bell className="h-10 w-10 mx-auto opacity-10 mb-2" />
              <p className="text-sm">Stay tuned! No notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors group relative",
                    !notification.isRead
                      ? "bg-orange-50/30"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={cn(
                            "text-sm font-semibold text-gray-900",
                            !notification.isRead && "text-orange-950",
                          )}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            { addSuffix: true },
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pr-6">
                        {notification.message}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-gray-50 bg-gray-50/30 text-center rounded-b-lg">
          <Link
            to="/admin/notifications"
            className="w-full inline-block text-center py-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            View All Notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
