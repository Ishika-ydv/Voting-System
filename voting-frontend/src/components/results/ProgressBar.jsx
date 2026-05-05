export default function ProgressBar({
  label = "Option",
  count = 0,
  percent = 0,
  isWinner = false,
}) {
  // 🔥 Safety: clamp percent between 0 and 100
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isWinner
          ? "border-green-400 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between text-sm mb-1">
        <span
          className={`font-medium ${
            isWinner ? "text-green-700" : "text-gray-700"
          }`}
        >
          {label} {isWinner && "✓ Winner"}
        </span>

        <span className="text-gray-500">
          {count} vote{count !== 1 ? "s" : ""} ({safePercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isWinner ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}