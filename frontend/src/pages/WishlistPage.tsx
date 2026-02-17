import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  getWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Trash2, ShoppingCart, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { EmptyState } from "../components/shared/EmptyState";
import { getImageUrl } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wishlist, isLoading, error } = useSelector(
    (state: RootState) => state.wishlist,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/wishlist");
      return;
    }
    dispatch(getWishlist());
  }, [dispatch, isAuthenticated, navigate]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = async (productId: string) => {
    await dispatch(addToCart({ productId, quantity: 1 }));
    dispatch(removeFromWishlist(productId));
  };

  if (isLoading && !wishlist) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => dispatch(getWishlist())}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        to="/products"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shopping
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
        <span className="text-gray-500 text-lg">({items.length} items)</span>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 border-dashed border-2">
          <EmptyState
            title="Your Wishlist is Empty"
            description="Save items you like to your wishlist so you can find them easily later."
            icon={Heart}
            actionText="Browse Products"
            actionPath="/products"
          />
        </Card>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="block w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex items-center justify-center"
                  >
                    <img
                      src={getImageUrl(item.product.images?.[0])}
                      alt={item.product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </Link>
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        to={`/products/${item.product.id}`}
                        className="hover:text-[#c7511f] transition-colors"
                      >
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="text-xl font-bold text-gray-900">
                        ${Number(item.product.price).toFixed(2)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {item.product.description}
                    </p>
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-[#fb923c] hover:bg-[#f97316] text-white flex items-center gap-2"
                        onClick={() => handleMoveToCart(item.product.id)}
                      >
                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" /> Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove from Wishlist?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this item from
                              your wishlist?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemove(item.product.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Confirm Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
