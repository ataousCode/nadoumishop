import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Lock } from "lucide-react";
import type { AppDispatch, RootState } from "../store/index.ts";
import { previewOrder, createOrder } from "../features/orders/orderSlice.ts";
import { getAddresses } from "../features/address/addressSlice.ts";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group.tsx";
import { Label } from "../components/ui/label.tsx";
import { Separator } from "../components/ui/separator.tsx";
import { NadoumiButton } from "../components/shared/NadoumiButton.tsx";
import { NadoumiCard } from "../components/shared/NadoumiCard.tsx";
import { PriceField } from "../components/shared/PriceField.tsx";
import { LoadingState } from "../components/shared/LoadingState.tsx";

const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { cart } = useSelector((state: RootState) => state.cart);
  const {
    preview,
    isLoading: isOrderLoading,
    error: orderError,
  } = useSelector((state: RootState) => state.orders);
  const { addresses, isLoading: isAddressLoading } = useSelector(
    (state: RootState) => state.address,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate("/cart");
      return;
    }

    dispatch(previewOrder());
    dispatch(getAddresses());
  }, [dispatch, isAuthenticated, cart, navigate]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    const result = await dispatch(
      createOrder({
        addressId: selectedAddressId,
        paymentMethod: "COD",
      }),
    );

    if (createOrder.fulfilled.match(result)) {
      navigate("/order-success");
    }
  };

  if (
    (isOrderLoading && !preview) ||
    (isAddressLoading && addresses.length === 0)
  ) {
    return <LoadingState fullScreen message="Preparing your checkout..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mini Header for Checkout */}
      <div className="bg-[#fcfcfc] border-b border-gray-200 py-4 mb-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight flex items-baseline"
          >
            <span className="text-black">Nadoumi</span>
            <span className="text-[#febd69]">.</span>
          </Link>
          <h1 className="text-3xl font-normal text-gray-900 ml-4 hidden md:block">
            Checkout
          </h1>
          <div className="text-gray-400">
            <Lock className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Section */}
          <div className="flex-grow lg:w-2/3 space-y-6">
            {/* 1. Shipping Address */}
            <NadoumiCard stepNumber={1} title="Shipping address">
              {addresses.length === 0 ? (
                <div className="py-4">
                  <p className="text-sm mb-4">
                    You don't have any saved addresses.
                  </p>
                  <NadoumiButton
                    variant="outline"
                    className="text-xs"
                    onClick={() => navigate("/account")}
                  >
                    Add a new address
                  </NadoumiButton>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAddressId}
                  onValueChange={setSelectedAddressId}
                  className="space-y-4"
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={address.id}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={address.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-bold text-sm">
                          {address.street}
                          {address.isDefault && (
                            <span className="ml-2 text-xs text-orange-600 font-normal">
                              (Default)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {address.city}, {address.state} {address.zip},{" "}
                          {address.country}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </NadoumiCard>

            {/* 2. Payment Method */}
            <NadoumiCard stepNumber={2} title="Payment method">
              <div className="p-3 border rounded border-orange-200 bg-orange-50 flex items-center gap-3">
                <div className="bg-orange-600 text-white rounded p-1">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">
                    Cash on Delivery (COD)
                  </div>
                  <div className="text-xs text-gray-600 italic">
                    Currently the only supported payment method.
                  </div>
                </div>
              </div>
            </NadoumiCard>

            {/* 3. Review items and shipping */}
            <NadoumiCard stepNumber={3} title="Review items and shipping">
              <div className="space-y-4">
                {preview?.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-50 border p-1 rounded">
                      {/* We don't have image in preview items from backend DTO, might need adjustment or dummy */}
                      <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">
                        {item.productName}
                      </div>
                      <div className="text-xs text-gray-600">
                        Quantity: {item.quantity}
                      </div>
                      <PriceField
                        amount={item.price}
                        size="sm"
                        className="mt-1 text-red-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </NadoumiCard>
          </div>

          {/* Sidebar / Order Summary */}
          <div className="lg:w-1/3">
            <NadoumiCard className="p-5 sticky top-8 border-gray-200 shadow-sm border rounded">
              <NadoumiButton
                variant="yellow"
                disabled={!selectedAddressId || isOrderLoading}
                onClick={handlePlaceOrder}
                className="w-full h-10 font-bold mb-4"
              >
                Place your order
              </NadoumiButton>

              <div className="text-[11px] text-gray-500 text-center mb-4 leading-tight">
                By placing your order, you agree to NadoumiShop's
                <span className="text-blue-600 hover:underline mx-1">
                  Privacy Notice
                </span>
                and
                <span className="text-blue-600 hover:underline ml-1">
                  Conditions of Use
                </span>
                .
              </div>

              <Separator className="my-4" />

              <h3 className="font-bold text-lg mb-3">Order Summary</h3>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <PriceField amount={preview?.subtotal || 0} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span>Shipping & handling:</span>
                  <PriceField amount={preview?.shipping || 0} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <PriceField amount={preview?.tax || 0} size="sm" />
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex justify-between text-lg font-bold text-red-700">
                <span>Order Total:</span>
                <PriceField
                  amount={preview?.total || 0}
                  size="lg"
                  className="text-red-700"
                />
              </div>

              {orderError && (
                <div className="mt-4 text-xs text-red-600 bg-red-50 p-2 border border-red-100 rounded">
                  {orderError}
                </div>
              )}
            </NadoumiCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
