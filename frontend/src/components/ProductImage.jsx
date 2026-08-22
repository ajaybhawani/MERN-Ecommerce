import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Product image with a graceful fallback when `src` is missing or fails to
 * load. `className` styles the <img>, `fallbackClassName` the placeholder box,
 * so both can share the same footprint.
 */
const ProductImage = ({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  iconClassName = "h-5 w-5",
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} (no image available)` : "No image available"}
        className={`flex items-center justify-center bg-gray-50 text-gray-400 ${fallbackClassName}`}
      >
        <ImageOff className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default ProductImage;
