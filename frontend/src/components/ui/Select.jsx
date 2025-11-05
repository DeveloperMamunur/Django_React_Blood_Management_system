// Select.jsx
export default function Select({ label, options, value, onChange, isMulti = false }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}
      <select
        multiple={isMulti}
        value={isMulti ? value : value || ""}
        onChange={(e) => {
          if (isMulti) {
            const selected = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            onChange(selected);
          } else {
            onChange(e.target.value);
          }
        }}
        className="border rounded p-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
