import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { FolderOpen } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: User, label: "Profile", path: "/admin/profile" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <aside className="w-64 bg-[#1a1c23] text-white flex flex-col h-full border-r border-gray-800">
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-orange-500"
        >
          <ShoppingBag className="h-6 w-6" />
          <span>Nadoumi Admin</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-2 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white",
                )}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-800">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 gap-3"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out from the administration panel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => dispatch(logout())}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
