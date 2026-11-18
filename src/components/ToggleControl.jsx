export default function ToggleControl({ checked, onChange, label }) {
  return (
    <button
      className={`toggle-control ${checked ? 'is-on' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
