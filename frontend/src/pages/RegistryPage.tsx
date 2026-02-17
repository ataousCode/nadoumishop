import { Button } from "../components/ui/button";
import { Gift, Baby, Cake } from "lucide-react";

export const RegistryPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-[#232f3e] text-white py-16 px-4">
        <div className="container mx-auto flex flex-col items-center text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Celebrate with Nadoumi Registry
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Whatever you're celebrating, Nadoumi Registry has everything you
            need to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-[#febd69] hover:bg-[#f3a847] text-black font-bold h-12 px-8 text-lg">
              Create a Registry
            </Button>
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10 h-12 px-8 text-lg"
            >
              Find a Registry
            </Button>
          </div>
        </div>
      </div>

      {/* Registry Types */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Find the right registry for you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Wedding */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-20 w-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
              <Gift className="h-10 w-10 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Wedding Registry</h3>
            <p className="text-gray-500 mb-6">
              Everything you need for your life together.
            </p>
            <Button variant="link" className="text-blue-600">
              Start Wedding Registry &rarr;
            </Button>
          </div>

          {/* Baby */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Baby className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Baby Registry</h3>
            <p className="text-gray-500 mb-6">
              Everything you need for the new arrival.
            </p>
            <Button variant="link" className="text-blue-600">
              Start Baby Registry &rarr;
            </Button>
          </div>

          {/* Birthday/Gift */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-20 w-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <Cake className="h-10 w-10 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Birthday & Gift List</h3>
            <p className="text-gray-500 mb-6">
              For birthdays, holidays, and special occasions.
            </p>
            <Button variant="link" className="text-blue-600">
              Create a Gift List &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
