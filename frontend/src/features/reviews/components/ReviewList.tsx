import { Star, User } from "lucide-react";
import type { Review } from "../../../types/review";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export const ReviewList = ({ reviews, isLoading }: ReviewListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-center italic">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-gray-100 pb-8 last:border-0"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-sm font-medium">{review.user.name}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-[#febd69]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    review.rating >= star ? "fill-current" : "text-gray-200",
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-900">
              {review.rating === 5 ? "Verified Purchase" : ""}
            </span>
          </div>

          <div className="text-xs text-gray-500 mb-3">
            Reviewed on{" "}
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <p className="text-sm text-gray-800 leading-relaxed">
            {review.comment}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
