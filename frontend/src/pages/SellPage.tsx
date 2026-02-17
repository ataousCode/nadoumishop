import { Button } from "../components/ui/button";
import { Check } from "lucide-react";

export const SellPage = () => {
  const benefits = [
    "Reach millions of customers worldwide",
    "Fast and reliable payments",
    "World-class support and tools",
    "Flexible selling plans for any business size",
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#232f3e] text-white">
        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-10 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start selling with Nadoumi
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              The fastest growing marketplace. Put your products in front of
              millions of shoppers today.
            </p>
            <Button className="bg-[#febd69] hover:bg-[#f3a847] text-black font-bold h-14 px-10 text-xl rounded-full">
              Sign Up to Sell
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              $39.99/mo + selling fees
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-2xl font-bold mb-6">Why sell on Nadoumi?</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 p-1 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Register</h3>
            <p className="text-gray-600">
              Choose your selling plan and create your account.
            </p>
          </div>
          <div>
            <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">List</h3>
            <p className="text-gray-600">
              Add your products to the Nadoumi catalog.
            </p>
          </div>
          <div>
            <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Sell</h3>
            <p className="text-gray-600">
              Customers buy your products. We handle payments.
            </p>
          </div>
          <div>
            <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              4
            </div>
            <h3 className="text-xl font-bold mb-2">Ship</h3>
            <p className="text-gray-600">
              You ship the products or let Nadoumi Fulfillment handle it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
