import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, User as UserIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useEffect, useState } from "react";
import { getCategories } from "../../features/category/categorySlice";

export const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Menu className="h-6 w-6 text-white" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[365px] p-0 flex flex-col h-full bg-white"
      >
        <SheetHeader className="p-4 bg-[#232f3e] text-white text-left flex-shrink-0">
          <SheetTitle className="text-white flex items-center gap-3 text-lg font-bold">
            <UserIcon className="h-6 w-6" />
            <span>
              Hello, {isAuthenticated && user ? user.name : "sign in"}
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="py-2">
            <h3 className="px-5 py-3 font-bold text-lg text-[#111111]">
              Shop By Department
            </h3>
            <ul className="space-y-0.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.name}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-2.5 px-5 text-sm font-medium text-[#111111] hover:bg-gray-100 transition-colors"
                  >
                    <span>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </span>
                    <span className="text-gray-400 text-lg">›</span>
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="px-5 py-2 text-sm text-gray-400 italic">
                  No categories found
                </li>
              )}
            </ul>
          </div>
          <Separator className="my-1 bg-gray-200 h-[1px]" />
          <div className="py-2">
            <h3 className="px-5 py-3 font-bold text-lg text-[#111111]">
              Programs & Features
            </h3>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/gift-cards"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-5 text-sm font-medium text-[#111111] hover:bg-gray-100 transition-colors"
                >
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link
                  to="/today"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-5 text-sm font-medium text-[#111111] hover:bg-gray-100 transition-colors"
                >
                  Shop By Interest
                </Link>
              </li>
            </ul>
          </div>
          <Separator className="my-1 bg-gray-200 h-[1px]" />
          <div className="py-2 mb-4">
            <h3 className="px-5 py-3 font-bold text-lg text-[#111111]">
              Help & Settings
            </h3>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-5 text-sm font-medium text-[#111111] hover:bg-gray-100 transition-colors"
                >
                  Your Account
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-5 text-sm font-medium text-[#111111] hover:bg-gray-100 transition-colors"
                >
                  Customer Service
                </Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block py-2.5 px-5 text-sm font-medium text-[#111111] hover:bg-gray-100 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
