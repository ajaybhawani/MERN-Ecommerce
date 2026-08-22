import { Loader2 } from "lucide-react";

const BASE =
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed";

const VARIANTS = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-100 active:scale-[0.99] disabled:bg-blue-400 disabled:active:scale-100",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-100 active:scale-[0.99] disabled:bg-red-400 disabled:active:scale-100",
  secondary:
    "border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 focus-visible:ring-gray-100 disabled:opacity-60 disabled:hover:bg-white",
  secondaryBlue:
    "border border-gray-300 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-blue-100 disabled:opacity-60",
  secondaryDanger:
    "border border-gray-300 bg-white text-slate-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-100 disabled:opacity-60",
  ghost:
    "text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-gray-100 disabled:opacity-60",
  ghostSlate:
    "text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-slate-100 disabled:opacity-60",
  plain:
    "text-gray-500 hover:text-gray-700 focus-visible:ring-gray-100 disabled:opacity-60",
};

const SIZES = {
  none: { padding: "", radius: "rounded-md", spinner: "h-4 w-4" },
  iconSm: { padding: "p-1", radius: "rounded-md", spinner: "h-4 w-4" },
  icon: { padding: "p-2", radius: "rounded-lg", spinner: "h-5 w-5" },
  sm: { padding: "px-3 py-2 text-sm", radius: "rounded-lg", spinner: "h-4 w-4" },
  md: {
    padding: "px-5 py-2.5 text-sm",
    radius: "rounded-xl",
    spinner: "h-4 w-4",
  },
  lg: { padding: "px-6 py-3", radius: "rounded-xl", spinner: "h-5 w-5" },
};

const RADII = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const Button = ({
  type = "button",
  variant = "primary",
  size = "lg",
  radius,
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  icon,
  className = "",
  children,
  ...rest
}) => {
  const sizeStyles = SIZES[size] || SIZES.lg;
  const isDisabled = disabled || loading;

  const classes = [
    BASE,
    VARIANTS[variant] || VARIANTS.primary,
    sizeStyles.padding,
    (radius && RADII[radius]) || sizeStyles.radius,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {loading ? (
        <Loader2 className={`${sizeStyles.spinner} animate-spin`} />
      ) : (
        icon
      )}

      {loading && loadingText ? loadingText : children}
    </button>
  );
};

export default Button;
