import { Link, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="text-3xl font-bold tracking-tighter">
            <span className="text-primary">Nadoumi</span>
            <span className="text-accent">Shop</span>
          </Link>
        </div>
        <Outlet />
      </div>
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} NadoumiShop. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link to="/privacy" className="hover:underline">
            Privacy Notice
          </Link>
          <Link to="/terms" className="hover:underline">
            Conditions of Use
          </Link>
          <Link to="/help" className="hover:underline">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
};
