import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  Search,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Input } from "../../components/ui/input";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ORDER" | "PAYMENT" | "CANCELATION" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch (error) {
      toast.error("Failed to update notifications");
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

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case "PAYMENT":
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case "CANCELATION":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-orange-500" />;
    }
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            System Notifications
          </h2>
          <p className="text-gray-500 mt-1">
            Stay updated with orders, payments, and system events.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={!notifications.some((n) => !n.isRead)}
            className="gap-2"
          >
            <Check className="h-4 w-4" /> Mark All as Read
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[450px]">Notification</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Clock className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-gray-500"
                  >
                    No notifications found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((n) => (
                  <TableRow
                    key={n.id}
                    className={cn(
                      "hover:bg-gray-50/50",
                      !n.isRead && "bg-orange-50/20",
                    )}
                  >
                    <TableCell>
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                            n.isRead ? "bg-gray-100" : "bg-orange-100",
                          )}
                        >
                          {getIcon(n.type)}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-semibold text-gray-900",
                              !n.isRead && "text-orange-900",
                            )}
                          >
                            {n.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="capitalize font-medium"
                      >
                        {n.type.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {n.isRead ? (
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Read
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-600 font-medium text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />{" "}
                          New
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {format(new Date(n.createdAt), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!n.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => markAsRead(n.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteNotification(n.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper for class name joining
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default AdminNotificationsPage;
