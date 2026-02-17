import {
  Search,
  Package,
  RefreshCw,
  CreditCard,
  User,
  Shield,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export const CustomerServicePage = () => {
  const categories = [
    {
      icon: Package,
      title: "Your Orders",
      description: "Track packages, edit or cancel orders",
    },
    {
      icon: RefreshCw,
      title: "Returns & Refunds",
      description: "Return or exchange items, print return labels",
    },
    {
      icon: CreditCard,
      title: "Payment Settings",
      description: "Add or edit payment methods, check balances",
    },
    {
      icon: User,
      title: "Account Settings",
      description: "Change email or password, update login info",
    },
    {
      icon: Shield,
      title: "Digital Services",
      description: "Manage content and devices",
    },
    {
      icon: Shield, // Reusing icon for now
      title: "Security & Privacy",
      description: "Manage password, 2FA, and privacy settings",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">
        Hello. What can we help you with?
      </h1>

      {/* Search Section */}
      <div className="border-b pb-8 mb-8">
        <p className="mb-4 text-lg font-medium">Search our help library</p>
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 h-12 text-lg"
            placeholder="Type something like 'question about a charge'"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <h2 className="text-xl font-bold mb-4">Some things you can do here</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <CardContent className="p-6 flex flex-col gap-4">
              <category.icon className="h-10 w-10 text-orange-500" />
              <div>
                <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ specific section could go here */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Browse Help Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-blue-600">
          <a href="#" className="hover:underline">
            Where's my stuff?
          </a>
          <a href="#" className="hover:underline">
            Shipping & Delivery
          </a>
          <a href="#" className="hover:underline">
            Returns & Refunds
          </a>
          <a href="#" className="hover:underline">
            Managing Your Account
          </a>
          <a href="#" className="hover:underline">
            Security & Privacy
          </a>
          <a href="#" className="hover:underline">
            Payment, Pricing & Promotions
          </a>
        </div>
      </div>
    </div>
  );
};
