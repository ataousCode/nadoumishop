import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { User } from "lucide-react";
import { NotificationBell } from "../components/layout/NotificationBell";

export const AdminLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex h-screen bg-[#f4f7fa] overflow-hidden">
      <AdminSidebar />

      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex-grow" />

          <div className="flex items-center gap-6">
            <NotificationBell />

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200 cursor-pointer hover:bg-orange-200 transition-all">
                <User className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
