import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  Package,
  Search,
  X,
  MapPin,
  AlertTriangle,
  Plus,
} from "lucide-react";
import type { AppDispatch, RootState } from "../store";
import {
  getOrders,
  cancelOrder,
  updateOrderAddress,
} from "../features/orders/orderSlice";
import { getAddresses, createAddress } from "../features/address/addressSlice";
import { AddressForm } from "../features/address/components/AddressForm";
import { addToCart } from "../features/cart/cartSlice";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const OrderHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<
    "ALL" | "BUY_AGAIN" | "NOT_SHIPPED" | "CANCELLED"
  >("ALL");
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.orders,
  );
  const { addresses } = useSelector((state: RootState) => state.address);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedOrderForAddress, setSelectedOrderForAddress] = useState<
    string | null
  >(null);

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [cancelConfirmation, setCancelConfirmation] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getOrders());
      dispatch(getAddresses());
    }
  }, [dispatch, isAuthenticated]);

  const handleBuyAgain = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }));
    navigate("/cart");
  };

  const handleOpenCancelModal = (orderId: string) => {
    setOrderToCancel(orderId);
    setCancelConfirmation("");
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel && cancelConfirmation === "Cancel") {
      dispatch(cancelOrder(orderToCancel));
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const handleOpenAddressModal = (orderId: string) => {
    setSelectedOrderForAddress(orderId);
    setShowNewAddressForm(false);
    setIsAddressModalOpen(true);
  };

  const handleCreateNewAddress = async (formData: any) => {
    const resultAction = await dispatch(createAddress(formData));
    if (createAddress.fulfilled.match(resultAction)) {
      const newAddress = resultAction.payload;
      if (selectedOrderForAddress) {
        dispatch(
          updateOrderAddress({
            id: selectedOrderForAddress,
            addressId: (newAddress as any).id,
          }),
        ).then(() => {
          setIsAddressModalOpen(false);
          setSelectedOrderForAddress(null);
          setShowNewAddressForm(false);
        });
      }
    }
  };

  const handleChangeAddress = (addressId: string) => {
    if (selectedOrderForAddress) {
      dispatch(
        updateOrderAddress({ id: selectedOrderForAddress, addressId }),
      ).then(() => {
        setIsAddressModalOpen(false);
        setSelectedOrderForAddress(null);
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    if (filter === "NOT_SHIPPED")
      return order.status === "PENDING" || order.status === "PROCESSING";
    if (filter === "CANCELLED") return order.status === "CANCELLED";
    if (filter === "BUY_AGAIN") return order.status === "DELIVERED";
    return true;
  });

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
    return `${baseUrl}${path}`;
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#007185]" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 relative">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link
            to="/dashboard"
            className="hover:text-orange-700 hover:underline"
          >
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-orange-700">Your Orders</span>
        </div>

        <h1 className="text-3xl font-normal text-gray-900 mb-6">Your Orders</h1>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={cn(
              "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              filter === "ALL"
                ? "border-orange-600 text-gray-900"
                : "border-transparent text-gray-600 hover:bg-gray-100",
            )}
          >
            Orders
          </button>
          <button
            onClick={() => setFilter("BUY_AGAIN")}
            className={cn(
              "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              filter === "BUY_AGAIN"
                ? "border-orange-600 text-gray-900"
                : "border-transparent text-gray-600 hover:bg-gray-100",
            )}
          >
            Buy Again
          </button>
          <button
            onClick={() => setFilter("NOT_SHIPPED")}
            className={cn(
              "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              filter === "NOT_SHIPPED"
                ? "border-orange-600 text-gray-900"
                : "border-transparent text-gray-600 hover:bg-gray-100",
            )}
          >
            Not Yet Shipped
          </button>
          <button
            onClick={() => setFilter("CANCELLED")}
            className={cn(
              "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              filter === "CANCELLED"
                ? "border-orange-600 text-gray-900"
                : "border-transparent text-gray-600 hover:bg-gray-100",
            )}
          >
            Cancelled
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 h-8 rounded-md border-gray-300"
              placeholder="Search all orders"
            />
          </div>
          <Button className="h-8 bg-[#333] hover:bg-[#444] text-white rounded-full px-6 text-xs">
            Search Orders
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              No matching orders found.
            </h2>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="rounded-lg border-gray-200 overflow-hidden shadow-none"
              >
                <CardHeader className="bg-gray-100 border-b border-gray-200 py-3 px-6 text-xs text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="uppercase">Order Placed</div>
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase">Total</div>
                    <div className="text-sm text-gray-900">
                      $
                      {Number(
                        (order as any).totalAmount || (order as any).total || 0,
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase">Ship To</div>
                    <div className="text-sm text-[#007185] hover:text-orange-700 flex items-center gap-1 group">
                      <span className="cursor-pointer">
                        {(order as any).address
                          ? `${(order as any).address.city}`
                          : user?.name || "Nadoumi User"}
                      </span>
                      {(order.status === "PENDING" ||
                        order.status === "PROCESSING") && (
                        <button
                          onClick={() => handleOpenAddressModal(order.id)}
                          className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#007185] underline"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <div className="uppercase">
                      Order # {order.id.substring(0, 12)}...
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-sm text-[#007185] hover:text-orange-700 cursor-pointer block"
                    >
                      View order details
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {order.status === "DELIVERED"
                          ? "Delivered"
                          : order.status === "CANCELLED"
                            ? "Cancelled"
                            : order.status === "SHIPPED"
                              ? "Shipped"
                              : "Processing"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        order.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                      }
                      className={cn(
                        "capitalize",
                        order.status === "DELIVERED" &&
                          "bg-green-100 text-green-800 border-green-200",
                        order.status === "SHIPPED" &&
                          "bg-blue-100 text-blue-800 border-blue-200",
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row gap-4"
                      >
                        <div className="w-20 h-20 bg-gray-50 border p-1 rounded flex-shrink-0">
                          {item.product?.images && item.product.images[0] ? (
                            <img
                              src={getImageUrl(item.product.images[0])}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product.id}`}
                            className="text-[#007185] hover:text-orange-700 hover:underline font-medium text-sm line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-gray-600 mt-1">
                            Quantity: {item.quantity}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {(order.status === "PENDING" ||
                              order.status === "PROCESSING") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenCancelModal(order.id)}
                                className="h-7 border-red-300 text-red-600 hover:bg-red-50 rounded-md text-[11px] px-3 font-normal shadow-none"
                              >
                                Cancel order
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleBuyAgain(item.product.id)}
                              className="h-7 bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-md text-[11px] px-3 shadow-none font-normal"
                            >
                              Buy it again
                            </Button>
                            {(order.status === "PENDING" ||
                              order.status === "PROCESSING") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenAddressModal(order.id)}
                                className="h-7 border-gray-300 rounded-md text-[11px] px-3 font-normal shadow-none"
                              >
                                Change address
                              </Button>
                            )}
                            <Link to={`/products/${item.product.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-gray-300 rounded-md text-[11px] px-3 font-normal"
                              >
                                View your item
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Order Cancellation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-2">
              <div className="bg-red-50 border border-red-100 p-3 rounded-md text-red-800 text-sm">
                <strong>Warning:</strong> Once cancelled, this order cannot be
                restored. Any rewards or points used may be lost.
              </div>
              <p>
                To avoid accidental cancellations, please type{" "}
                <span className="font-bold text-gray-900 select-none">
                  Cancel
                </span>{" "}
                below to continue.
              </p>
              <Input
                value={cancelConfirmation}
                onChange={(e) => setCancelConfirmation(e.target.value)}
                placeholder="Type 'Cancel' here"
                className="focus-visible:ring-red-500"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsCancelModalOpen(false);
                setOrderToCancel(null);
                setCancelConfirmation("");
              }}
              className="rounded-full shadow-none"
            >
              No, keep order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelConfirmation !== "Cancel"}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full shadow-none disabled:opacity-50"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {showNewAddressForm
                  ? "Add a New Address"
                  : "Select Shipping Address"}
              </h2>
              <button
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setShowNewAddressForm(false);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {showNewAddressForm ? (
                <AddressForm
                  onSubmit={handleCreateNewAddress}
                  onCancel={() => setShowNewAddressForm(false)}
                  isLoading={isLoading}
                />
              ) : (
                <>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[#007185] hover:text-[#007185] transition-colors mb-4 group"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-bold">Add new address</span>
                  </button>

                  {addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">
                        No saved addresses found.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleChangeAddress(addr.id)}
                          className="p-3 border rounded-lg hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                            <div className="text-sm">
                              <p className="font-bold text-gray-900">
                                {user?.name}
                              </p>
                              <p>{addr.street}</p>
                              <p>
                                {addr.city}, {addr.state} {addr.zip}
                              </p>
                              <p>{addr.country}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
