import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { getProducts } from "../features/products/productSlice";
import { ProductCard } from "../components/products/ProductCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Filter, X, Star } from "lucide-react";

export const ProductListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, total, page, totalPages, isLoading } = useSelector(
    (state: RootState) => state.products,
  );

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Max price should be dynamic ideally

  // Get filters from URL
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const minRating = searchParams.get("minRating") || "";

  useEffect(() => {
    dispatch(
      getProducts({
        page: Number(searchParams.get("page")) || 1,
        limit: 12,
        category,
        search,
        sort,
        minPrice: searchParams.get("minPrice")
          ? Number(searchParams.get("minPrice"))
          : undefined,
        maxPrice: searchParams.get("maxPrice")
          ? Number(searchParams.get("maxPrice"))
          : undefined,
        minRating: minRating ? Number(minRating) : undefined,
      }),
    );
  }, [dispatch, searchParams, category, search, sort, minRating]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    setSearchParams(params);
  };

  const handleCategory = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") params.set("category", value);
    else params.delete("category");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleRatingFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("minRating", value);
    else params.delete("minRating");
    params.set("page", "1");
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 1000]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shop Products</h1>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`lg:w-1/4 ${
            showFilters ? "block" : "hidden lg:block"
          } space-y-6 bg-white p-4 rounded-lg shadow-sm h-fit`}
        >
          <div className="flex justify-between items-center lg:hidden">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Search</h3>
            <Input
              placeholder="Search products..."
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <Select value={category || "all"} onValueChange={handleCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Button onClick={handlePriceFilter} className="w-full">
                Apply Price Filter
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Customer Reviews</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating.toString())}
                  className={`flex items-center gap-1 text-sm hover:text-[#c7511f] transition-colors ${
                    minRating === rating.toString()
                      ? "text-[#c7511f] font-bold"
                      : "text-gray-600"
                  }`}
                >
                  <div className="flex text-[#febd69]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? "fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
              {minRating && (
                <button
                  onClick={() => handleRatingFilter("")}
                  className="text-xs text-[#007185] hover:underline"
                >
                  Clear rating filter
                </button>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full text-red-500 hover:text-red-600"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </aside>

        {/* Product Grid */}
        <main className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {products.length} of {total} results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sort} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-lg h-[400px] animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search query.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", (page - 1).toString());
                  setSearchParams(params);
                }}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", (page + 1).toString());
                  setSearchParams(params);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
