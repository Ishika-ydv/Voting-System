export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const disabledStyles = "opacity-60 cursor-not-allowed";

  return (
    <button
      className={`${base} ${variants[variant]} ${
        loading ? disabledStyles : ""
      } ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {loading ? "Please wait..." : children}
    </button>
  );
}