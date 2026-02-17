import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getProducts } from "../features/products/productSlice";
import { ProductCard } from "../components/products/ProductCard";
import { Loader2 } from "lucide-react";

export const TodaysDealsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error } = useSelector(
    (state: RootState) => state.products,
  );

  // Filter for products with a discount > 0
  const dealProducts = products.filter(
    (product) => (product.discount || 0) > 0,
  );

  useEffect(() => {
    dispatch(getProducts({}));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error loading deals: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Today's Deals</h1>
        <p className="text-gray-600">
          Shop today's best deals, lightning offers, and limited-time discounts.
        </p>
      </div>

      {dealProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h2 className="text-xl font-medium text-gray-900">
            No deals available right now
          </h2>
          <p className="text-gray-500 mt-2">
            Check back later for new discounts!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
