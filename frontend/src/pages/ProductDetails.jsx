import {
  AlertCircle,
  ArrowLeft,
  Minus,
  PackageSearch,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../api/axios";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { useToast } from "../components/toastContext";
import { formatPrice, isOutOfStock, stockBadge } from "../utils/format";

const RELATED_LIMIT = 4;

const TRUST_POINTS = [
  { icon: Truck, title: "Free delivery", copy: "On orders above 499" },
  { icon: RotateCcw, title: "Easy returns", copy: "7 day return window" },
  { icon: ShieldCheck, title: "Secure payment", copy: "Encrypted checkout" },
];

const DetailsSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-2">
    <div className="aspect-square animate-pulse rounded-2xl bg-gray-200" />

    <div className="space-y-4 py-2">
      <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
    </div>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await api.get("/products");

      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to load this product";

      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // The API has no GET /products/:id, so the product is picked out of the list.
  const product = useMemo(
    () => products.find((item) => item._id === id) || null,
    [products, id],
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (item) =>
          item._id !== product._id &&
          item.category &&
          item.category === product.category,
      )
      .slice(0, RELATED_LIMIT);
  }, [products, product]);

  // Reset the stepper whenever a different product is shown.
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  const soldOut = product ? isOutOfStock(product) : false;
  const maxQuantity = Math.max(Number(product?.stock) || 0, 1);

  const changeQuantity = (delta) => {
    setQuantity((prev) => Math.min(Math.max(prev + delta, 1), maxQuantity));
  };

  const handleAddToCart = () => {
    toast.success(
      `${quantity} x ${product.title} added to cart`,
    );
  };

  const handleBuyNow = () => {
    toast.info("Checkout is not available yet");
  };

  const badge = product ? stockBadge(product.stock) : null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <DetailsSkeleton />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <p className="text-base font-semibold text-slate-900">
              {loadError}
            </p>

            <p className="max-w-sm text-sm text-gray-500">
              Check that the server is running, then try again.
            </p>

            <Button
              size="md"
              onClick={fetchProducts}
              className="mt-2"
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Try again
            </Button>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <PackageSearch className="h-7 w-7 text-blue-600" />
            </div>

            <p className="text-base font-semibold text-slate-900">
              Product not found
            </p>

            <p className="max-w-sm text-sm text-gray-500">
              This product may have been removed from the catalogue.
            </p>

            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    className="aspect-square w-full object-contain p-6"
                    fallbackClassName="aspect-square w-full"
                    iconClassName="h-12 w-12"
                  />

                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <span className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                        Out of stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {product.category || "Uncategorised"}
                  </span>

                  <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {product.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="text-3xl font-bold text-slate-900">
                      {formatPrice(product.price)}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Description
                    </h2>

                    <p className="mt-2 leading-relaxed text-gray-600">
                      {product.description ||
                        "No description available for this product."}
                    </p>
                  </div>

                  {/* Quantity + actions */}
                  <div className="mt-8 space-y-4">
                    {!soldOut && (
                      <div className="flex items-center gap-4">
                        <span
                          id="quantity-label"
                          className="text-sm font-semibold text-slate-700"
                        >
                          Quantity
                        </span>

                        <div
                          role="group"
                          aria-labelledby="quantity-label"
                          className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white p-1"
                        >
                          <Button
                            variant="ghostSlate"
                            size="icon"
                            onClick={() => changeQuantity(-1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span
                            aria-live="polite"
                            className="min-w-10 text-center font-semibold text-slate-900"
                          >
                            {quantity}
                          </span>

                          <Button
                            variant="ghostSlate"
                            size="icon"
                            onClick={() => changeQuantity(1)}
                            disabled={quantity >= maxQuantity}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        size="none"
                        radius="xl"
                        disabled={soldOut}
                        onClick={handleAddToCart}
                        className="flex-1 px-6 py-3 text-sm"
                        icon={<ShoppingCart className="h-5 w-5" />}
                      >
                        {soldOut ? "Out of stock" : "Add to cart"}
                      </Button>

                      <Button
                        variant="secondaryBlue"
                        size="none"
                        radius="xl"
                        disabled={soldOut}
                        onClick={handleBuyNow}
                        className="flex-1 px-6 py-3 text-sm"
                        icon={<Zap className="h-5 w-5" />}
                      >
                        Buy now
                      </Button>
                    </div>
                  </div>

                  {/* Trust row */}
                  <div className="mt-8 grid gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3">
                    {TRUST_POINTS.map(({ icon: Icon, title, copy }) => (
                      <div key={title} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related */}
            {relatedProducts.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-slate-900">
                  More in {product.category}
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedProducts.map((item) => (
                    <ProductCard key={item._id} product={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
