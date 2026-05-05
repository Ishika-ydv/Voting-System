export default function OptionsBuilder({ options, onChange }) {

  const updateField = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    onChange(updated);
  };

  const updateImage = (index, file) => {
    const updated = [...options];
    updated[index].image = file;
    onChange(updated);
  };

  const addOption = () => {
    onChange([
      ...options,
      { name: "", description: "", image: null },
    ]);
  };

  const removeOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">

      {options.map((opt, i) => (
        <div key={i} className="border p-3 rounded-lg space-y-2">

          <input
            placeholder="Option name"
            value={opt.name}
            onChange={(e) =>
              updateField(i, "name", e.target.value)
            }
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Description"
            value={opt.description}
            onChange={(e) =>
              updateField(i, "description", e.target.value)
            }
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            onChange={(e) =>
              updateImage(i, e.target.files[0])
            }
          />

          <button
            type="button"
            onClick={() => removeOption(i)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>

        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="text-blue-600 text-sm"
      >
        + Add Option
      </button>

    </div>
  );
}