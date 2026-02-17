import { Button } from "../components/ui/button";
import { CreditCard, Mail, Printer } from "lucide-react";

export const GiftCardsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 rounded-xl">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Nadoumi Gift Cards</h1>
          <p className="text-xl text-blue-100 mb-6">
            The perfect gift for everyone. No fees. No expiration.
          </p>
          <Button className="bg-[#febd69] hover:bg-[#f3a847] text-black font-bold h-12 px-8">
            Shop All Gift Cards
          </Button>
        </div>
        <div className="flex-1 flex justify-center">
          {/* Placeholder for a nice card graphic */}
          <div className="w-80 h-52 bg-gradient-to-br from-[#232f3e] to-[#37475a] rounded-xl shadow-2xl flex items-center justify-center border-t border-white/20 relative overflow-hidden">
            <div className="absolute top-4 right-4 font-bold text-2xl italic">
              Nadoumi
            </div>
            <div className="absolute bottom-4 left-4 text-sm font-mono tracking-widest">
              **** **** **** 1234
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Shop by type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
          <Mail className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="font-bold text-lg">eGift Cards</h3>
          <p className="text-gray-500 text-sm">Send via email or text</p>
        </div>
        <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
          <Printer className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="font-bold text-lg">Print at Home</h3>
          <p className="text-gray-500 text-sm">Print and fold instantly</p>
        </div>
        <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
          <CreditCard className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="font-bold text-lg">Mail</h3>
          <p className="text-gray-500 text-sm">Free shipping next day</p>
        </div>
      </div>
    </div>
  );
};
