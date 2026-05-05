export default function OptionsBuilder({
  options = [],
  onChange,
}) {
  // ➕ Add option
  const add = () => {
    onChange([...options, ""]);
  };

  // ❌ Remove option (min 2 enforced)
  const remove = (index) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== index));
  };

  // ✏️ Update option (trim input for safety)
  const update = (index, value) => {
    const next = [...options];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">

      {options.map((opt, i) => {
        const trimmed = opt.trim();

        return (
          <div key={i} className="flex gap-2 items-center">

            {/* Input */}
            <input
              value={opt}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={options.length <= 2}
              className={`text-sm ${
                options.length <= 2
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700"
              }`}
            >
              Remove
            </button>
          </div>
        );
      })}

      {/* Add button */}
      <button
        type="button"
        onClick={add}
        className="text-sm text-blue-600 hover:underline self-start mt-1"
      >
        + Add option
      </button>

      {/* Helper text */}
      <p className="text-xs text-gray-400 mt-2">
        Minimum 2 options required. Avoid duplicate or empty options.
      </p>
    </div>
  );
}