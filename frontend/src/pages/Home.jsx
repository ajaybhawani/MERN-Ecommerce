import {
  AlertCircle,
  LayoutDashboard,
  Loader2,
  PackageSearch,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import heroImage from "../assets/hero.png";
import api from "../api/axios";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import { useToast } from "../components/toastContext";
import useDebounce from "../hooks/useDebounce";

const ALL = "all";
const SEARCH_DEBOUNCE_MS = 400;

// A request superseded by a newer query is expected, not a failure to report.
const isCanceledRequest = (error) =>
  error?.code === "ERR_CANCELED" || error?.name === "CanceledError";

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
    <div className="aspect-square animate-pulse bg-gray-200" />

    <div className="space-y-3 p-4">
      <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-9 w-full animate-pulse rounded-xl bg-gray-200" />
    </div>
  </div>
);

const Home = () => {
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [allCategories, setAllCategories] = useState([]);
  const [catalogueEmpty, setCatalogueEmpty] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // The query the products on screen actually came from, so the result count is
  // never described with a term whose response has not landed yet.
  const [appliedQuery, setAppliedQuery] = useState({ term: "", category: ALL });

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const hasLoadedOnce = useRef(false);

  // The pill list has to survive server-side filtering, so it comes from one
  // unfiltered read rather than from the (filtered) product response.
  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await api.get("/products");

        if (!active) {
          return;
        }

        const list = Array.isArray(response.data) ? response.data : [];
        const unique = new Set(
          list.map((item) => item.category).filter(Boolean),
        );

        setAllCategories(Array.from(unique).sort());
        setCatalogueEmpty(list.length === 0);
      } catch {
        // The product fetch below reports load failures; pills just stay empty.
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  // Search and category are applied by the API; the cleanup abort keeps a slow
  // earlier response from overwriting a newer one.
  useEffect(() => {
    const controller = new AbortController();

    const params = {};
    const term = debouncedSearch.trim();

    if (term) {
      params.search = term;
    }

    if (category !== ALL) {
      params.category = category;
    }

    const loadProducts = async () => {
      try {
        if (hasLoadedOnce.current) {
          setRefreshing(true);
        }

        setLoadError("");

        const response = await api.get("/products", {
          params,
          signal: controller.signal,
        });

        setProducts(Array.isArray(response.data) ? response.data : []);
        setAppliedQuery({ term, category });
        hasLoadedOnce.current = true;
      } catch (error) {
        if (isCanceledRequest(error)) {
          return;
        }

        const message =
          error.response?.data?.message || "Unable to load products";

        setLoadError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [debouncedSearch, category, reloadKey, toast]);

  const categories = [ALL, ...allCategories];
  const filtersActive = search.trim() !== "" || category !== ALL;

  const clearFilters = () => {
    setSearch("");
    setCategory(ALL);
  };

  const resultSummary = () => {
    const count = products.length;
    const noun = count === 1 ? "product" : "products";
    const { term, category: appliedCategory } = appliedQuery;

    if (term && appliedCategory !== ALL) {
      return `${count} ${noun} for "${term}" in ${appliedCategory}`;
    }

    if (term) {
      return `${count} ${noun} for "${term}"`;
    }

    if (appliedCategory !== ALL) {
      return `${count} ${noun} in ${appliedCategory}`;
    }

    return `${count} ${noun} available`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShoppingBag className="h-5 w-5" />
            </span>
            Shopnest
          </Link>

          {/* <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Products</span>
          </Link> */}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-slate-900 text-white">
          <div className="flex flex-col items-center gap-6 p-8 sm:p-12 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                New season
              </p>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Everything you need, in one place
              </h1>

              <p className="mt-4 max-w-md text-slate-300">
                Browse the full catalogue, filter by category and find exactly
                what you are looking for.
              </p>
            </div>

            <img src={heroImage} alt="" className="w-44 shrink-0 sm:w-56" />
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-18 z-20 -mx-4 mt-8 bg-gray-100/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name, category or description..."
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-11 text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:appearance-none"
            />

            {refreshing ? (
              <Loader2
                aria-hidden="true"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600"
              />
            ) : (
              search && (
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )
            )}
          </div>

          {allCategories.length > 0 && (
            <div
              role="group"
              aria-label="Filter by category"
              className="mt-3 flex gap-2 overflow-x-auto pb-1"
            >
              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {item === ALL ? "All categories" : item}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Result count */}
        {!loading && !loadError && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm font-medium text-gray-600">
              {refreshing ? "Searching..." : resultSummary()}
            </p>

            {filtersActive && (
              <Button
                variant="plain"
                size="sm"
                onClick={clearFilters}
                icon={<X className="h-4 w-4" />}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Products */}
        <section className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
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
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-2"
                icon={<RefreshCw className="h-4 w-4" />}
              >
                Try again
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <PackageSearch className="h-7 w-7 text-blue-600" />
              </div>

              <p className="text-base font-semibold text-slate-900">
                {catalogueEmpty
                  ? "No products yet"
                  : "No products match your filters"}
              </p>

              <p className="max-w-sm text-sm text-gray-500">
                {catalogueEmpty
                  ? "The catalogue is empty right now. Add products from the admin dashboard."
                  : "Try a different search term or pick another category."}
              </p>

              {catalogueEmpty ? (
                <Link
                  to="/admin/products"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to dashboard
                </Link>
              ) : (
                <Button size="md" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div
              aria-busy={refreshing || undefined}
              className={`grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                refreshing ? "opacity-60" : "opacity-100"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
