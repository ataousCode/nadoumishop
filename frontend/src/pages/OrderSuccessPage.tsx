import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";

const OrderSuccessPage = () => {
  return (
    <div className="bg-[#EAEDED] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order placed, thanks!
              </h1>
              <p className="text-sm text-gray-600">
                Confirmation will be sent to your email.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-6 mb-8">
            <h2 className="font-bold text-base mb-4">
              Shipping to Adrar, Algeria
            </h2>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between items-center">
                <span>Estimated delivery:</span>
                <span className="font-bold text-green-700">
                  Tomorrow, Feb 24
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/orders" className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-full border-gray-300"
              >
                Review your orders
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full">
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 border border-gray-200 rounded flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">
                Manage your Prime membership
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white rounded p-1">
                <span className="text-[10px] font-bold">N</span>
              </div>
              <span className="text-sm font-medium">Try Nadoumi Rewards</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
