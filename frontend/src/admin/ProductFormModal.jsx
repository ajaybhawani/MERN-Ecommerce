import {
  AlertCircle,
  Boxes,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useToast } from "../components/toastContext";

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const toFormData = (product) => {
  if (!product) {
    return EMPTY_FORM;
  }

  return {
    title: product.title ?? "",
    description: product.description ?? "",
    price: product.price ?? "",
    category: product.category ?? "",
    image: product.image ?? "",
    stock: product.stock ?? "",
  };
};

const ProductFormModal = ({ open, product, onClose, onSaved }) => {
  const toast = useToast();
  const isEditMode = Boolean(product?._id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset the form whenever the modal opens for a different product
  useEffect(() => {
    if (open) {
      setFormData(toFormData(product));
      setErrors({});
    }
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!String(formData.title).trim()) {
      newErrors.title = "Product title is required";
    }

    if (!String(formData.description).trim()) {
      newErrors.description = "Product description is required";
    }

    if (formData.price === "" || formData.price === null) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!String(formData.category).trim()) {
      newErrors.category = "Category is required";
    }

    if (!String(formData.image).trim()) {
      newErrors.image = "Product image URL is required";
    }

    if (formData.stock === "" || formData.stock === null) {
      newErrors.stock = "Stock quantity is required";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: String(formData.title).trim(),
      description: String(formData.description).trim(),
      price: Number(formData.price),
      category: String(formData.category).trim(),
      image: String(formData.image).trim(),
      stock: Number(formData.stock),
    };

    try {
      setLoading(true);

      const response = isEditMode
        ? await api.put(`/products/update/${product._id}`, payload)
        : await api.post("/products/add", payload);

      toast.success(
        response.data?.message ||
          (isEditMode
            ? "Product updated successfully"
            : "Product created successfully"),
      );

      setFormData(EMPTY_FORM);
      setErrors({});

      onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) {
          onClose?.();
        }
      }}
      title={isEditMode ? "Edit Product" : "Add Product"}
      description={
        isEditMode
          ? "Update the details of this product"
          : "Add a new product to your store"
      }
      icon={<Package className="h-5 w-5" />}
      closeOnBackdropClick={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Product Title
          </label>

          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. MacBook Air"
            disabled={loading}
            className={inputClass("title")}
          />

          {errors.title && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a short description of your product..."
            disabled={loading}
            className={`resize-none ${inputClass("description")}`}
          />

          {errors.description && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Price
            </label>

            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="price"
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="89999"
                disabled={loading}
                className={`pl-10 ${inputClass("price")}`}
              />
            </div>

            {errors.price && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Stock
            </label>

            <div className="relative">
              <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="stock"
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                disabled={loading}
                className={`pl-10 ${inputClass("stock")}`}
              />
            </div>

            {errors.stock && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Laptop"
            disabled={loading}
            className={inputClass("category")}
          />

          {errors.category && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Product Image URL
          </label>

          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              id="image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              disabled={loading}
              className={`pl-12 ${inputClass("image")}`}
            />
          </div>

          {errors.image ? (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {errors.image}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">
              Add a publicly accessible image URL for the product.
            </p>
          )}
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-sm font-medium text-gray-600">
              Image Preview
            </p>

            <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img
                src={formData.image}
                alt="Product preview"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => onClose?.()}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            loadingText={isEditMode ? "Saving..." : "Adding..."}
            icon={
              isEditMode ? (
                <Save className="h-5 w-5" />
              ) : (
                <Package className="h-5 w-5" />
              )
            }
          >
            {isEditMode ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
