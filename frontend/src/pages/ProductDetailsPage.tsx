import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { getProductById } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import {
  Star,
  Truck,
  Shield,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  Heart,
} from "lucide-react";
import { NadoumiButton } from "../components/shared/NadoumiButton";
import { Button } from "../components/ui/button";
import {
  getProductReviews,
  createReview,
  reset as resetReview,
} from "../features/reviews/reviewSlice";
import { ReviewList } from "../features/reviews/components/ReviewList";
import { ReviewForm } from "../features/reviews/components/ReviewForm";
import { ProductGallery } from "../features/products/components/ProductGallery";
import { cn } from "../lib/utils";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct, isLoading, error } = useSelector(
    (state: RootState) => state.products,
  );
  const {
    reviews,
    isLoading: isReviewsLoading,
    isSuccess: isReviewSuccess,
  } = useSelector((state: RootState) => state.reviews);
  const { isLoading: isCartLoading, error: cartError } = useSelector(
    (state: RootState) => state.cart,
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { wishlist } = useSelector((state: RootState) => state.wishlist);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const isWishlisted = wishlist?.items.some((item) => item.productId === id);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    if (id) {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(id));
        setLocalMessage("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(id));
        setLocalMessage("Added to wishlist");
      }
      setTimeout(() => setLocalMessage(null), 3000);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getProductReviews(id));
    }
    return () => {
      dispatch(resetReview());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isReviewSuccess) {
      setLocalMessage("Review submitted successfully!");
      if (id) {
        dispatch(getProductReviews(id));
      }
      setTimeout(() => setLocalMessage(null), 3000);
      dispatch(resetReview());
    }
  }, [isReviewSuccess, dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    if (currentProduct) {
      const result = await dispatch(
        addToCart({ productId: currentProduct.id, quantity }),
      );
      if (addToCart.fulfilled.match(result)) {
        setLocalMessage("Added to cart!");
        setTimeout(() => setLocalMessage(null), 3000);
      }
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    if (currentProduct) {
      const result = await dispatch(
        addToCart({ productId: currentProduct.id, quantity }),
      );
      if (addToCart.fulfilled.match(result)) {
        navigate("/checkout");
      }
    }
  };

  const handleReviewSubmit = async (reviewData: {
    rating: number;
    comment: string;
  }) => {
    if (id) {
      dispatch(createReview({ productId: id, ...reviewData }));
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const userHasReviewed = reviews.some((r) => r.userId === user?.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link to="/products">
          <NadoumiButton variant="outline">Back to Products</NadoumiButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Gallery */}
        <ProductGallery
          images={currentProduct.images || []}
          productName={currentProduct.name}
          fallbackImage={
            currentProduct.imageUrl ||
            `https://source.unsplash.com/random/800x800?tech&sig=${currentProduct.id}`
          }
        />

        {/* Product Info */}
        <div className="sticky top-24">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentProduct.name}
          </h1>
          <div className="flex items-center mb-4">
            <div className="flex text-[#febd69] mr-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    Number(averageRating) >= i
                      ? "fill-current"
                      : "text-gray-200",
                  )}
                />
              ))}
            </div>
            <span className="text-[#007185] hover:text-[#c7511f] cursor-pointer text-sm font-medium">
              {reviews.length} ratings
            </span>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex items-baseline mb-2">
              <span className="text-sm align-top font-medium">$</span>
              <span className="text-4xl font-bold text-gray-900">
                {Math.floor(currentProduct.price)}
              </span>
              <span className="text-sm align-top font-medium">
                {(Number(currentProduct.price) % 1).toFixed(2).substring(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500">All prices include VAT.</div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              {currentProduct.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-4">
              <span className="text-green-700 font-bold text-lg">
                In Stock.
              </span>
            </div>

            {cartError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{cartError}</span>
              </div>
            )}

            {localMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
                {localMessage}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-sm">Quantity:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 bg-white focus:ring-1 focus:ring-[#007185] outline-none text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <NadoumiButton
              onClick={handleAddToCart}
              isLoading={isCartLoading}
              className="w-full mb-3"
            >
              Add to Cart
            </NadoumiButton>
            <NadoumiButton
              onClick={handleBuyNow}
              variant="gold"
              isLoading={isCartLoading}
              className="w-full mb-3"
            >
              Buy Now
            </NadoumiButton>
            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              className={`w-full rounded-full text-sm font-medium flex items-center justify-center gap-2 ${
                isWishlisted ? "text-red-500 border-red-200" : ""
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
              />
              {isWishlisted ? "Remove from List" : "Add to Wishlist"}
            </Button>
            <div className="mt-6 space-y-3 text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-3 text-gray-400" />
                <span>Free Delivery on qualifying orders</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-3 text-gray-400" />
                <span>Secure transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Rating Breakdown */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Customer reviews</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-[#febd69]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      Number(averageRating) >= i
                        ? "fill-current"
                        : "text-gray-200",
                    )}
                  />
                ))}
              </div>
              <span className="font-bold text-lg">
                {averageRating} out of 5
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              {reviews.length} global ratings
            </p>

            <div className="space-y-3 mb-8">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4 text-sm">
                    <span className="text-[#007185] hover:underline cursor-pointer min-w-[50px]">
                      {star} star
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                      <div
                        className="h-full bg-[#febd69]"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[#007185] hover:underline cursor-pointer min-w-[35px]">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold mb-2">Review this product</h3>
              <p className="text-sm mb-4 text-gray-700">
                Share your thoughts with other customers
              </p>
              {isAuthenticated ? (
                userHasReviewed ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>You have already reviewed this product.</span>
                  </div>
                ) : (
                  <NadoumiButton
                    variant="outline"
                    className="w-full text-sm py-1 font-normal border-gray-300 shadow-sm"
                    onClick={() => {
                      const element = document.getElementById("review-form");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Write a customer review
                  </NadoumiButton>
                )
              ) : (
                <Link to={`/login?redirect=/products/${id}`}>
                  <NadoumiButton
                    variant="outline"
                    className="w-full text-sm py-1 font-normal border-gray-300 shadow-sm"
                  >
                    Sign in to write a review
                  </NadoumiButton>
                </Link>
              )}
            </div>
          </div>

          {/* Reviews List & Form */}
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200 mb-6">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold">Top reviews</h3>
            </div>

            <ReviewList reviews={reviews} isLoading={isReviewsLoading} />

            {isAuthenticated && !userHasReviewed && (
              <div id="review-form" className="scroll-mt-20">
                <ReviewForm
                  productId={id!}
                  onSubmit={handleReviewSubmit}
                  isLoading={isReviewsLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
