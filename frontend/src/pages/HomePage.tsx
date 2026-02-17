import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  getNewArrivals,
  getBestSellers,
  getProducts,
} from "../features/products/productSlice";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ProductCard } from "../components/products/ProductCard";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newArrivals, bestSellers, products, isLoading } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    dispatch(getNewArrivals());
    dispatch(getBestSellers());
    dispatch(getProducts({ limit: 8 }));
  }, [dispatch]);

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

      {/* New Arrivals */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <Link
            to="/products?isNewArrival=true"
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading && newArrivals.length === 0 ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-[400px] animate-pulse"
              />
            ))
          ) : newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              No new arrivals available
            </div>
          )}
        </div>
      </section>

      {/* Featured / Other Products */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore Our Collection
          </h2>
          <Link
            to="/products"
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
          >
            See all products
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading && products.length === 0 ? (
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-[400px] animate-pulse"
              />
            ))
          ) : products.length > 0 ? (
            products
              .slice(0, 8)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              Start exploring our products!
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full bg-white rounded-xl shadow-sm my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
          <Link
            to="/products?isBestSeller=true"
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
          >
            See more
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {/* Tighter gap for horizontal list feel */}
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-[400px] animate-pulse"
              />
            ))
          ) : bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              No best sellers available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
