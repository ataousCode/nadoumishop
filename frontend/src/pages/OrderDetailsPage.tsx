import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  Package,
  CreditCard,
  ChevronRight,
  Printer,
  ChevronLeft,
  Plus,
} from "lucide-react";
import type { AppDispatch, RootState } from "../store";
import {
  getOrderById,
  updateOrderAddress,
} from "../features/orders/orderSlice";
import { getAddresses, createAddress } from "../features/address/addressSlice";
import { AddressForm } from "../features/address/components/AddressForm";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import { X, MapPin } from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    currentOrder: order,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.orders);
  const { addresses } = useSelector((state: RootState) => state.address);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
      dispatch(getAddresses());
    }
  }, [dispatch, id]);

  const handleChangeAddress = (addressId: string) => {
    if (id) {
      dispatch(updateOrderAddress({ id, addressId })).then(() => {
        setIsAddressModalOpen(false);
        setShowNewAddressForm(false);
      });
    }
  };

  const handleCreateNewAddress = async (formData: any) => {
    const resultAction = await dispatch(createAddress(formData));
    if (createAddress.fulfilled.match(resultAction)) {
      const newAddress = resultAction.payload;
      if (id) {
        dispatch(
          updateOrderAddress({
            id: id,
            addressId: (newAddress as any).id,
          }),
        ).then(() => {
          setIsAddressModalOpen(false);
          setShowNewAddressForm(false);
        });
      }
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
    return `${baseUrl}${path}`;
  };

  if (isLoading && !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#007185]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          {error || "We couldn't find the order you're looking for."}
        </p>
        <Link to="/orders">
          <Button variant="outline" className="rounded-full shadow-none">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link
            to="/dashboard"
            className="text-[#565959] hover:text-[#c7511f] hover:underline"
          >
            Your Account
          </Link>
          <ChevronRight className="h-4 w-4 text-[#565959] mx-1" />
          <Link
            to="/orders"
            className="text-[#565959] hover:text-[#c7511f] hover:underline"
          >
            Your Orders
          </Link>
          <ChevronRight className="h-4 w-4 text-[#565959] mx-1" />
          <span className="text-[#c7511f]">Order Details</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-normal text-gray-900 leading-tight">
            Order Details
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Ordered on {formattedDate}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">Order# {order.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-none border-gray-200">
            <CardHeader className="py-2 px-4 border-b font-bold text-sm bg-gray-50 uppercase">
              Shipping Address
            </CardHeader>
            <CardContent className="p-4 text-sm leading-relaxed">
              {order.address ? (
                <div className="relative group">
                  <p className="font-bold mb-1 flex items-center justify-between">
                    Shipping to:
                    {(order.status === "PENDING" ||
                      order.status === "PROCESSING") && (
                      <button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-normal"
                      >
                        Change
                      </button>
                    )}
                  </p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zip}
                  </p>
                  <p>{order.address.country}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No address provided</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="py-2 px-4 border-b font-bold text-sm bg-gray-50 uppercase">
              Payment Method
            </CardHeader>
            <CardContent className="p-4 text-sm leading-relaxed">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="font-bold">
                  {order.payment?.method || "Not Specified"}
                </span>
              </div>
              <p className="text-gray-600">
                Status:{" "}
                <span className="capitalize">{order.paymentStatus}</span>
              </p>
              {order.payment?.transactionId && (
                <p className="text-xs text-gray-400 mt-2">
                  ID: {order.payment.transactionId}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="py-2 px-4 border-b font-bold text-sm bg-gray-50 uppercase">
              Order Summary
            </CardHeader>
            <CardContent className="p-4 text-sm space-y-2 font-medium">
              <div className="flex justify-between">
                <span className="text-gray-600">Item(s) Subtotal:</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping & Handling:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-base mt-2">
                <span>Grand Total:</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none border-gray-200 mb-8 overflow-hidden">
          <CardHeader className="py-3 px-6 border-b bg-gray-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-gray-600" />
              <span className="font-bold text-lg leading-tight">
                {order.status === "DELIVERED"
                  ? "Delivered"
                  : order.status === "CANCELLED"
                    ? "Cancelled"
                    : order.status === "SHIPPED"
                      ? "Shipped"
                      : "Preparing Package"}
              </span>
            </div>
            <Badge
              variant={order.status === "CANCELLED" ? "destructive" : "outline"}
              className={cn(
                "capitalize font-bold text-xs uppercase px-3 py-0.5 border-2 rounded",
                order.status === "DELIVERED" &&
                  "bg-green-50 text-green-700 border-green-200",
                order.status === "SHIPPED" &&
                  "bg-blue-50 text-blue-700 border-blue-200",
                order.status === "PENDING" &&
                  "bg-yellow-50 text-yellow-700 border-yellow-200",
              )}
            >
              {order.status}
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 border p-1 rounded flex-shrink-0">
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
                      className="text-[#007185] hover:text-[#c7511f] hover:underline font-bold text-sm block line-clamp-2 leading-snug"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-gray-600 mt-1 uppercase font-bold tracking-wide">
                      Condition: New
                    </div>
                    <div className="font-bold text-[#b12704] mt-1">
                      ${Number(item.price).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/products/${item.product.id}`)}
                        className="h-7 bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full px-6 text-[11px] shadow-sm font-medium"
                      >
                        Buy it again
                      </Button>
                      {(order.status === "PENDING" ||
                        order.status === "PROCESSING") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsAddressModalOpen(true)}
                          className="h-7 border-gray-300 rounded-full px-6 text-[11px] shadow-sm font-medium"
                        >
                          Change address
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4 items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 rounded-full border-gray-300 font-bold px-6 h-9 text-sm shadow-none"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full border-gray-300 font-bold px-6 h-9 text-sm shadow-none"
          >
            <Printer className="h-4 w-4" />
            Print Order Receipt
          </Button>
        </div>
      </div>

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

export default OrderDetailsPage;
