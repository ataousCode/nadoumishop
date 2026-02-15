import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Sidebar } from "./Sidebar";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store"; // Updated path to store
import { logout } from "../../features/auth/authSlice"; // Updated path to features

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

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex flex-col">
      {/* Top Bar - Dark Blue/Black in Amazon */}
      <div className="bg-[#131921] text-white py-2 px-4 flex items-center justify-between gap-4">
        {/* Left: Logo and Location */}
        <div className="flex items-center gap-4">
          <Sidebar /> {/* Mobile Menu */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight flex items-baseline"
          >
            <span className="text-white">Nadoumi</span>
            <span className="text-[#febd69]">.</span>
          </Link>
          <div className="hidden lg:flex flex-col text-xs leading-tight hover:outline hover:outline-1 hover:outline-white p-1 rounded cursor-pointer">
            <span className="text-gray-300 ml-4">Deliver to</span>
            <div className="flex items-center font-bold">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Algeria</span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 hidden md:flex max-w-3xl">
          <div className="flex w-full rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#febd69]">
            <div className="w-auto bg-gray-100 border-r border-gray-300">
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-[60px] lg:w-[140px] rounded-none border-0 bg-gray-100 text-black text-xs focus:ring-0">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="computers">Computers</SelectItem>
                  <SelectItem value="smart-home">Smart Home</SelectItem>
                  <SelectItem value="arts-crafts">Arts & Crafts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              className="h-10 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
              placeholder="Search Nadoumi..."
            />
            <Button className="h-10 rounded-none bg-[#febd69] hover:bg-[#f3a847] text-black border-none px-4">
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Right: Account, Orders, Cart */}
        <div className="flex items-center gap-2 lg:gap-6 text-sm">
          {/* Account & Lists - Added pb-2 to extend hover area downwards */}
          <div className="hidden md:flex flex-col justify-center hover:outline hover:outline-1 hover:outline-white p-2 pb-3 -mb-1 rounded cursor-pointer group relative">
            <div className="text-xs">
              Hello, {isAuthenticated && user ? user.name : "sign in"}
            </div>
            <div className="font-bold">Account & Lists</div>

            {/* Dropdown for Account / Auth */}
            <div className="absolute top-full right-0 w-48 bg-white text-black p-4 rounded-md shadow-lg hidden group-hover:block z-50 ring-1 ring-black ring-opacity-5">
              {/* Invisible bridge to prevent mouse gap issues */}
              <div className="absolute -top-2 left-0 w-full h-2 bg-transparent" />

              <div className="flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login">
                      <Button className="w-full bg-[#f0c14b] hover:bg-[#ddb347] text-black border border-[#a88734]">
                        Sign in
                      </Button>
                    </Link>
                    <div className="text-xs text-center">
                      New customer?{" "}
                      <Link
                        to="/signup"
                        className="text-blue-600 hover:underline"
                      >
                        Start here.
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/account"
                      className="text-sm hover:underline block mb-2"
                    >
                      Your Account
                    </Link>
                    <Link
                      to="/orders"
                      className="text-sm hover:underline block mb-2"
                    >
                      Your Orders
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger className="w-full text-left p-0 font-normal text-sm hover:underline text-red-600 bg-transparent border-0 cursor-pointer">
                        Sign Out
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to sign out?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be redirected to the login page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sign Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block hover:outline hover:outline-1 hover:outline-white p-2 rounded cursor-pointer">
            <div className="text-xs">Returns</div>
            <div className="font-bold">& Orders</div>
          </div>

          <Link
            to="/cart"
            className="flex items-end gap-1 hover:outline hover:outline-1 hover:outline-white p-2 rounded"
          >
            <div className="relative">
              <ShoppingCart className="h-8 w-8" />
              <Badge className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-[#febd69] text-black font-bold p-0 border-none">
                0
              </Badge>
            </div>
            <span className="font-bold hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Bar - Secondary Nav */}
      <div className="bg-[#232f3e] text-white py-1.5 px-4 flex items-center gap-6 overflow-x-auto text-sm font-medium">
        <Sidebar />{" "}
        {/* Desktop "All" Menu trigger styled differently if needed, reusing mobile sidebar for now */}
        <Link
          to="/today"
          className="whitespace-nowrap hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
        >
          Today's Deals
        </Link>
        <Link
          to="/customer-service"
          className="whitespace-nowrap hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
        >
          Customer Service
        </Link>
        <Link
          to="/registry"
          className="whitespace-nowrap hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
        >
          Registry
        </Link>
        <Link
          to="/gift-cards"
          className="whitespace-nowrap hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
        >
          Gift Cards
        </Link>
        <Link
          to="/sell"
          className="whitespace-nowrap hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
        >
          Sell
        </Link>
      </div>
    </header>
  );
};
