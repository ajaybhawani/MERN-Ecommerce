import {
  AlertCircle,
  ArrowLeft,
  Boxes,
  ImageOff,
  Loader2,
  PackagePlus,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/toastContext";
import ProductFormModal from "./ProductFormModal";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const stockBadge = (stock) => {
  if (Number(stock) <= 0) {
    return { label: "Out of stock", className: "bg-red-50 text-red-600" };
  }

  if (Number(stock) <= 5) {
    return { label: `${stock} left`, className: "bg-amber-50 text-amber-700" };
  }

  return { label: `${stock} in stock`, className: "bg-green-50 text-green-700" };
};

const ProductThumbnail = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-white object-contain p-1"
    />
  );
};

const AdminProducts = () => {
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        setLoadError("");

        const response = await api.get("/products");

        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to load products";

        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const unique = new Set(
      products.map((product) => product.category).filter(Boolean),
    );

    return ["all", ...Array.from(unique).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        product.title?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });
  }, [products, search, category]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);

      const response = await api.delete(`/products/delete/${deleteTarget._id}`);

      toast.success(
        response.data?.message || "Product deleted successfully",
      );

      setDeleteTarget(null);
      await fetchProducts({ silent: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not delete the product. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) <= 0,
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>

            <p className="mt-1 text-sm text-gray-500">
              {products.length} product{products.length === 1 ? "" : "s"}
              {outOfStockCount > 0 && (
                <span className="text-amber-600">
                  {" "}
                  &middot; {outOfStockCount} out of stock
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="none"
              radius="xl"
              disabled={loading}
              onClick={() => fetchProducts()}
              className="px-4 py-3 text-sm"
              icon={
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              }
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              size="none"
              radius="xl"
              onClick={openAddModal}
              className="flex-1 px-5 py-3 text-sm sm:flex-none"
              icon={<PackagePlus className="h-5 w-5" />}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category or description..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-lg">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading products...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>

              <p className="text-base font-semibold text-slate-900">
                {loadError}
              </p>

              <Button size="md" onClick={() => fetchProducts()} className="mt-2">
                Try again
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <Boxes className="h-7 w-7 text-blue-600" />
              </div>

              <p className="text-base font-semibold text-slate-900">
                {products.length === 0
                  ? "No products yet"
                  : "No products match your filters"}
              </p>

              <p className="max-w-sm text-sm text-gray-500">
                {products.length === 0
                  ? "Add your first product to start building your catalogue."
                  : "Try a different search term or category."}
              </p>

              {products.length === 0 && (
                <Button
                  size="md"
                  onClick={openAddModal}
                  className="mt-2"
                  icon={<PackagePlus className="h-4 w-4" />}
                >
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th scope="col" className="px-4 py-4 sm:px-6">
                        Product
                      </th>
                      <th scope="col" className="px-4 py-4 sm:px-6">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-4 sm:px-6">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-4 sm:px-6">
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-right sm:px-6"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const badge = stockBadge(product.stock);

                      return (
                        <tr
                          key={product._id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-4 py-4 sm:px-6">
                            <div className="flex items-center gap-4">
                              <ProductThumbnail
                                src={product.image}
                                alt={product.title}
                              />

                              <div className="min-w-0 max-w-[18rem]">
                                <p className="truncate font-semibold text-slate-900">
                                  {product.title}
                                </p>

                                <p className="mt-0.5 truncate text-sm text-gray-500">
                                  {product.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {product.category || "Uncategorised"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900 sm:px-6">
                            {currency.format(Number(product.price) || 0)}
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="secondaryBlue"
                                size="sm"
                                onClick={() => openEditModal(product)}
                                aria-label={`Edit ${product.title}`}
                                icon={<Pencil className="h-4 w-4" />}
                              >
                                Edit
                              </Button>

                              <Button
                                variant="secondaryDanger"
                                size="sm"
                                onClick={() => setDeleteTarget(product)}
                                aria-label={`Delete ${product.title}`}
                                icon={<Trash2 className="h-4 w-4" />}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs text-gray-500 lg:hidden">
                Swipe the table sideways to see every column
              </p>
            </>
          )}
        </div>

        {!loading && !loadError && filteredProducts.length > 0 && (
          <p className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}
      </div>

      {/* Add / Edit modal */}
      <ProductFormModal
        open={formOpen}
        product={editingProduct}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSaved={() => fetchProducts({ silent: true })}
      />

      {/* Delete confirmation */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete product?"
        message={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed from your store. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
};

export default AdminProducts;
