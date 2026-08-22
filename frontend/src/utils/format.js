export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => currency.format(Number(value) || 0);

export const stockBadge = (stock) => {
  if (Number(stock) <= 0) {
    return { label: "Out of stock", className: "bg-red-50 text-red-600" };
  }

  if (Number(stock) <= 5) {
    return { label: `${stock} left`, className: "bg-amber-50 text-amber-700" };
  }

  return { label: `${stock} in stock`, className: "bg-green-50 text-green-700" };
};

export const isOutOfStock = (product) => Number(product?.stock) <= 0;
