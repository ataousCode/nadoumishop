import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Loader2, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import type { Product } from "../../types/product";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { addToCart } from "../../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { motion } from "framer-motion";
import { getImageUrl } from "../../lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { wishlist } = useSelector((state: RootState) => state.wishlist);
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = wishlist?.items.some(
    (item) => item.productId === product.id,
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products`);
      return;
    }
    setIsAdding(true);
    await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    setIsAdding(false);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products`);
      return;
    }

    if (isWishlisted) {
      await dispatch(removeFromWishlist(product.id));
    } else {
      await dispatch(addToWishlist(product.id));
    }
  };

  const displayImage =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : product.imageUrl
        ? getImageUrl(product.imageUrl)
        : `https://source.unsplash.com/random/400x400?tech&sig=${product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`rounded-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white ${
          compact
            ? "border-none shadow-none hover:shadow-none bg-transparent"
            : ""
        }`}
      >
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative bg-gray-50 aspect-square p-8 flex items-center justify-center cursor-pointer overflow-hidden group">
            <img
              src={displayImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
            />
            {!compact && product.discount && product.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-[#CC0C39] hover:bg-[#CC0C39] text-white rounded-sm px-2 py-1 text-xs font-bold">
                {product.discount}% off
              </Badge>
            )}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 border border-gray-100 shadow-sm transition-all hover:bg-white z-10 ${
                isWishlisted ? "text-red-500" : "text-gray-400"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </Link>
        <CardContent className="p-4">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-[#c7511f] hover:underline"
          >
            <h3
              className={`font-medium text-gray-900 line-clamp-2 ${
                compact ? "text-sm" : "text-base"
              }`}
            >
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center mt-1 mb-2">
            <div className="flex text-[#febd69]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(product.avgRating || 0)
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#007185] ml-1">
              {product.reviewCount || 0}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs align-top">$</span>
            <span className="text-2xl font-bold text-gray-900">
              {Math.floor(product.price)}
            </span>
            <span className="text-xs align-top">
              {(Number(product.price) % 1).toFixed(2).substring(2)}
            </span>
            {product.discount && product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                $
                {(
                  Number(product.price) /
                  (1 - (product.discount || 0) / 100)
                ).toFixed(2)}
              </span>
            )}
          </div>
          {!compact && (
            <div className="text-xs text-gray-500 mt-1">
              Delivery <strong>Tomorrow, Feb 24</strong>
            </div>
          )}
        </CardContent>
        {!compact && (
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full text-sm font-medium"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};
