import { useState } from "react";
import { Star } from "lucide-react";
import { NadoumiButton } from "../../../components/shared/NadoumiButton";
import { cn } from "../../../lib/utils";

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  isLoading?: boolean;
}

export const ReviewForm = ({ onSubmit, isLoading }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setError(null);
    await onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-lg border border-gray-200"
    >
      <h3 className="text-xl font-bold mb-4">Write a product review</h3>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Overall rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  (hover || rating) >= star
                    ? "fill-[#febd69] text-[#febd69]"
                    : "text-gray-300",
                )}
              />
            </button>
          ))}
        </div>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-bold mb-2">
          Add a written review
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#007185] outline-none text-sm"
          placeholder="What did you like or dislike? What did you use this product for?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="flex justify-end">
        <NadoumiButton type="submit" isLoading={isLoading} className="px-8">
          Submit
        </NadoumiButton>
      </div>
    </form>
  );
};
