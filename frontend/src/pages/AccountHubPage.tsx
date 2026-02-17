import { Link } from "react-router-dom";
import { NadoumiCard } from "../components/shared/NadoumiCard";
import { Package, ShieldCheck, MapPin, CreditCard } from "lucide-react";

const AccountHubPage = () => {
  const accountCards = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      icon: <Package className="h-10 w-10 text-[#007185]" />,
      link: "/orders",
    },
    {
      title: "Login & Security",
      description: "Edit login, name, and password",
      icon: <ShieldCheck className="h-10 w-10 text-[#007185]" />,
      link: "/dashboard/settings",
    },
    {
      title: "Your Addresses",
      description: "Edit addresses for orders and gifts",
      icon: <MapPin className="h-10 w-10 text-[#007185]" />,
      link: "/dashboard/addresses",
    },
    {
      title: "Payment options",
      description: "Edit or add payment methods",
      icon: <CreditCard className="h-10 w-10 text-[#007185]" />,
      link: "/dashboard/payment",
    },
    {
      title: "Your Wishlist",
      description: "View and modify your wishlist",
      icon: <Package className="h-10 w-10 text-[#007185]" />, // Using Package explicitly as requested, or maybe Heart? User didn't specify icon but "Package" is weird for Wishlist. I'll stick to Heart if I can find it, otherwise Package is fine as placeholder. Actually user said "Add wishlist in the Dashboard".
      link: "/wishlist",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountCards.map((card, index) => (
            <Link key={index} to={card.link}>
              <NadoumiCard className="h-full p-5 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors cursor-pointer flex items-start gap-4 shadow-none">
                <div className="flex-shrink-0 mt-1">{card.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                </div>
              </NadoumiCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountHubPage;
