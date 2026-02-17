import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { AppDispatch, RootState } from "../store/index.ts";
import { getCart } from "../features/cart/cartSlice.ts";
import { CartItem } from "../features/cart/components/CartItem.tsx";
import { NadoumiButton } from "../components/shared/NadoumiButton.tsx";
import { NadoumiCard } from "../components/shared/NadoumiCard.tsx";
import { PriceField } from "../components/shared/PriceField.tsx";
import { LoadingState } from "../components/shared/LoadingState.tsx";
import { EmptyState } from "../components/shared/EmptyState.tsx";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { cart, isLoading, error } = useSelector(
    (state: RootState) => state.cart,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const subtotal =
    cart?.items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ) || 0;
  const itemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  if (isLoading && !cart) {
    return <LoadingState fullScreen message="Loading your cart..." />;
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Section */}
          <div className="flex-grow lg:w-3/4">
            <NadoumiCard className="p-6">
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                <h1 className="text-3xl font-normal text-gray-900">
                  Shopping Cart
                </h1>
                <span className="text-sm text-gray-500 hidden sm:block">
                  Price
                </span>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {!cart || cart.items.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="Your NadoumiShop Cart is empty"
                  description="Your Shopping Cart lives to serve. Give it purpose — fill it with tech gadgets, electronics, and more."
                  actionText="Continue Shopping"
                  actionPath="/products"
                />
              ) : (
                <>
                  <div className="space-y-0">
                    {cart.items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200 mt-4 font-medium text-xl">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}
                    ):{" "}
                    <PriceField amount={subtotal} size="lg" className="ml-2" />
                  </div>
                </>
              )}
            </NadoumiCard>

            <div className="mt-4 p-4 text-[13px] text-gray-500 leading-tight">
              The price and availability of items at NadoumiShop.com are subject
              to change. The Cart is a temporary place to store a list of your
              items and reflects each item's most recent price. <br />
              Do you have a gift card or promotional code? We'll ask you to
              enter your claim code when it's time to pay.
            </div>
          </div>

          {/* Sidebar / Checkout Summary */}
          {cart && cart.items.length > 0 && (
            <div className="lg:w-1/4">
              <NadoumiCard className="p-5 sticky top-24">
                {/* Removed Free Shipping text */}
                <div className="text-xl font-medium mb-4">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
                  <PriceField
                    amount={subtotal}
                    size="xl"
                    className="block mt-1"
                  />
                </div>

                <div className="flex items-center gap-2 mb-6 text-sm">
                  <input
                    type="checkbox"
                    id="is_gift"
                    className="h-4 w-4 rounded border-gray-300 text-[#007185] focus:ring-[#007185]"
                  />
                  <label htmlFor="is_gift">This order contains a gift</label>
                </div>

                <NadoumiButton
                  variant="yellow"
                  onClick={() => navigate("/checkout")}
                  className="w-full"
                >
                  Proceed to Checkout
                </NadoumiButton>
              </NadoumiCard>

              {/* Mock items you might like */}
              <div className="mt-6 bg-white p-4 border border-gray-200 rounded">
                <h3 className="font-bold text-base mb-4">Suggested items</h3>
                <p className="text-xs text-gray-500 italic">
                  Continue shopping to see more recommendations tailored to your
                  needs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
