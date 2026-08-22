import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { formatPrice, isOutOfStock, stockBadge } from "../utils/format";
import Button from "./Button";
import ProductImage from "./ProductImage";
import { useToast } from "./toastContext";

const ProductCard = ({ product }) => {
  const toast = useToast();

  const badge = stockBadge(product.stock);
  const soldOut = isOutOfStock(product);

  const handleAddToCart = () => {
    toast.success(`${product.title} added to cart`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      {/* Image + copy are one link target; the button stays outside it so we
          never nest interactive elements. */}
      <Link
        to={`/product/${product._id}`}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImage
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
            fallbackClassName="h-full w-full"
            iconClassName="h-10 w-10"
          />

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
                Out of stock
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            {product.category || "Uncategorised"}
          </span>

          <h3 className="line-clamp-2 font-semibold text-slate-900 transition group-hover:text-blue-600">
            {product.title}
          </h3>

          <p className="line-clamp-2 text-sm text-gray-500">
            {product.description || "No description available"}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          size="none"
          radius="xl"
          fullWidth
          disabled={soldOut}
          onClick={handleAddToCart}
          aria-label={`Add ${product.title} to cart`}
          className="px-4 py-2.5 text-sm"
          icon={<ShoppingCart className="h-4 w-4" />}
        >
          {soldOut ? "Unavailable" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
