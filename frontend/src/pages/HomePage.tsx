import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10 max-w-7xl">
          <div className="max-w-2xl bg-black/30 p-8 rounded-lg backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Shop the Future of <br />
              <span className="text-[#febd69]">Tech & Lifestyle</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-lg">
              Discover unbeatable deals on the latest electronics, smart home
              devices, and premium accessories.
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-[#febd69] hover:bg-[#f3a847] text-black border-none font-bold text-lg px-8 rounded-full"
              >
                Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Gradient Overlay for bottom transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </section>

      {/* Category Cards - Overlapping Hero */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard
            title="Electronics"
            image="https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=500&q=80"
            link="/products?category=electronics"
          />
          <CategoryCard
            title="Smart Home"
            image="https://images.unsplash.com/photo-1558002038-109177ecf001?w=500&q=80"
            link="/products?category=smart-home"
          />
          <CategoryCard
            title="Computers"
            image="https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&q=80"
            link="/products?category=computers"
          />
          <CategoryCard
            title="New Arrivals"
            image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
            link="/products?sort=newest"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Today's Deals</h2>
          <Link
            to="/products"
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
          >
            See all deals
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <ProductCard key={item} id={item} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full bg-white rounded-xl shadow-sm my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Best Sellers in Computers & Accessories
          </h2>
          <Link
            to="/products?category=computers"
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
          >
            See more
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {" "}
          {/* Tighter gap for horizontal list feel */}
          {[5, 6, 7, 8].map((item) => (
            <ProductCard key={item} id={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({
  title,
  image,
  link,
}: {
  title: string;
  image: string;
  link: string;
}) => (
  <Card className="rounded-none border-none shadow-md overflow-hidden h-full flex flex-col">
    <CardHeader className="p-4 pb-2">
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0 flex-grow">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover content-center"
      />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Link
        to={link}
        className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm font-medium"
      >
        Shop now
      </Link>
    </CardFooter>
  </Card>
);

const ProductCard = ({
  id,
  compact = false,
}: {
  id: number;
  compact?: boolean;
}) => (
  <Card
    className={`rounded-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${compact ? "border-none shadow-none hover:shadow-none" : ""}`}
  >
    <div className="relative bg-gray-50 aspect-square p-8 flex items-center justify-center">
      <img
        src={`https://source.unsplash.com/random/400x400?tech&sig=${id}`}
        alt="Product"
        className="max-h-full max-w-full object-contain mix-blend-multiply"
      />
      {!compact && (
        <Badge className="absolute top-2 left-2 bg-[#CC0C39] hover:bg-[#CC0C39] text-white rounded-sm px-2 py-1 text-xs font-bold">
          20% off
        </Badge>
      )}
    </div>
    <CardContent className="p-4">
      <Link
        to={`/products/${id}`}
        className="hover:text-[#c7511f] hover:underline"
      >
        <h3
          className={`font-medium text-gray-900 line-clamp-2 ${compact ? "text-sm" : "text-base"}`}
        >
          High-Performance Wireless Noise Cancelling Headphones with Microphone
        </h3>
      </Link>
      <div className="flex items-center mt-1 mb-2">
        <div className="flex text-[#febd69]">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>
        <span className="text-xs text-[#007185] ml-1">12,345</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xs align-top">$</span>
        <span className="text-2xl font-bold text-gray-900">299</span>
        <span className="text-xs align-top">99</span>
        <span className="text-sm text-gray-500 line-through ml-2">$399.99</span>
      </div>
      {!compact && (
        <div className="text-xs text-gray-500 mt-1">
          Delivery <strong>Fri, Feb 23</strong>
        </div>
      )}
    </CardContent>
    {!compact && (
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full text-sm">
          Add to Cart
        </Button>
      </CardFooter>
    )}
  </Card>
);

export default HomePage;
