import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  fallbackImage?: string;
}

export const ProductGallery = ({
  images,
  productName,
  fallbackImage,
}: ProductGalleryProps) => {
  // Filter out empty strings and include fallback if images is empty
  const galleryImages =
    images && images.length > 0 ? images : fallbackImage ? [fallbackImage] : [];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] || "");
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    display: "none",
  });

  useEffect(() => {
    if (galleryImages.length > 0 && !galleryImages.includes(selectedImage)) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages, selectedImage]);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
    return `${baseUrl}${path}`;
  };

  if (galleryImages.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 flex items-center justify-center border border-gray-100 shadow-sm h-[500px]">
        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 italic">
          No Image Available
        </div>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${getImageUrl(selectedImage)})`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail List */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto w-full md:w-16 h-auto md:max-h-[600px] scrollbar-hide pb-2 md:pb-0">
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setSelectedImage(img)}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "flex-shrink-0 w-12 h-12 md:w-16 md:h-16 border-2 rounded-md p-0.5 hover:border-[#e77600] transition-all overflow-hidden flex items-center justify-center bg-white shadow-sm",
              selectedImage === img
                ? "border-[#e77600] ring-1 ring-[#e77600]"
                : "border-gray-200",
            )}
          >
            <img
              src={getImageUrl(img)}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div className="flex-1 bg-white rounded-xl p-4 md:p-8 border border-gray-100 shadow-sm relative group h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="relative w-full h-full flex items-center justify-center cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={getImageUrl(selectedImage)}
            alt={productName}
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-opacity duration-300"
          />

          {/* Zoom Overlay (Hidden on touch devices, shown on hover) */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none bg-no-repeat z-20 transition-opacity duration-200 md:block hidden"
            style={{
              ...zoomStyle,
              backgroundColor: "white",
            }}
          ></div>
        </div>

        {/* Gallery Hint */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
            {galleryImages.indexOf(selectedImage) + 1} / {galleryImages.length}
          </div>
        )}
      </div>
    </div>
  );
};
