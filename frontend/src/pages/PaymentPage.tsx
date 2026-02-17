import { Link } from "react-router-dom";
import { NadoumiCard } from "../components/shared/NadoumiCard";
import { CreditCard, MoveLeft } from "lucide-react";

const PaymentPage = () => {
  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link
            to="/dashboard"
            className="hover:text-orange-700 hover:underline flex items-center gap-1"
          >
            <MoveLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-orange-700">Payment Options</span>
        </div>

        <h1 className="text-3xl font-normal text-gray-900 mb-8">
          Payment Options
        </h1>

        <NadoumiCard className="p-8 text-center border-dashed border-2 border-gray-300 bg-gray-50">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-500">
            <CreditCard className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No payment methods saved
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't saved any payment methods yet. securely add your card to
            make checkout faster.
          </p>
          <button
            className="bg-gray-200 text-gray-400 cursor-not-allowed px-6 py-2 rounded-md font-medium"
            disabled
          >
            Add a credit or debit card (Coming Soon)
          </button>
        </NadoumiCard>
      </div>
    </div>
  );
};

export default PaymentPage;
