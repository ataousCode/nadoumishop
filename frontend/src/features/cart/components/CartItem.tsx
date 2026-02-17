import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import type { CartItem as CartItemType } from "../../../types/cart";
import { useAppDispatch } from "../../../store/hooks";
import { updateCartItem, removeFromCart } from "../cartSlice";
import { getImageUrl } from "../../../lib/utils";
import { motion } from "framer-motion";
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
} from "../../../components/ui/alert-dialog";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(
      updateCartItem({ itemId: item.id, data: { quantity: newQuantity } }),
    );
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className="flex bg-white p-4 items-start gap-4 border-b border-gray-200 last:border-0 h-full min-h-[160px]"
    >
      {/* Product Image */}
      <div className="w-40 h-40 flex-shrink-0 bg-gray-50 p-2 border border-gray-100 rounded flex items-center justify-center">
        <img
          src={getImageUrl(item.product.images?.[0])}
          alt={item.product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <Link
              to={`/products/${item.product.id}`}
              className="text-lg font-medium text-[#007185] hover:text-[#c7511f] hover:underline line-clamp-2 pr-4 leading-6"
            >
              {item.product.name}
            </Link>
            <div className="text-xl font-bold text-right flex-shrink-0">
              ${Number(item.product?.price || 0).toFixed(2)}
            </div>
          </div>
          <div className="text-xs text-green-700 mt-1">In Stock</div>
          <div className="text-xs text-gray-500 mt-1">
            Eligible for FREE Shipping
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-4 gap-4 text-sm">
          <div className="flex items-center bg-[#F0F2F2] border border-[#D5D9D9] rounded-lg h-8 shadow-[0_2px_5px_0_rgba(213,217,217,0.5)]">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-8 rounded-l-lg rounded-r-none hover:bg-gray-200"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-8 rounded-r-lg rounded-l-none hover:bg-gray-200"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="w-[1px] h-4 bg-gray-300 mx-1 hidden sm:block"></div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-[#007185] hover:underline flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove from Cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this item from your cart?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Confirm Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="w-[1px] h-4 bg-gray-300 mx-1 hidden sm:block"></div>

          <button className="text-[#007185] hover:underline">
            Save for later
          </button>
        </div>
      </div>
    </motion.div>
  );
};
