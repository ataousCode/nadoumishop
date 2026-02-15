import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 bg-primary text-primary-foreground text-left">
          <SheetTitle className="text-white flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <span>Hello, Sign in</span>
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="px-4 py-2">
            <h3 className="font-bold text-lg mb-2">Shop By Department</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/products?category=electronics"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=computers"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Computers
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=smart-home"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Smart Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=arts-crafts"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Arts & Crafts
                </Link>
              </li>
            </ul>
          </div>
          <Separator className="my-2" />
          <div className="px-4 py-2">
            <h3 className="font-bold text-lg mb-2">Programs & Features</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/gift-cards"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link
                  to="/live"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Shop By Interest
                </Link>
              </li>
              <li>
                <Link
                  to="/international"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  International Shopping
                </Link>
              </li>
            </ul>
          </div>
          <Separator className="my-2" />
          <div className="px-4 py-2">
            <h3 className="font-bold text-lg mb-2">Help & Settings</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/account"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Your Account
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-2 hover:bg-gray-100 rounded-md"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
