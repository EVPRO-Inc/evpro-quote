// A segmented toggle — a more visual replacement for a small dropdown.
// `fill` makes it stretch to its container (for use inside a form grid cell).
export default function Segmented({ options, value, onChange, ariaLabel, fill }) {
  return (
    <div className={`segmented${fill ? ' fill' : ''}`} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const on = opt === value
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={on}
            className={`seg${on ? ' on' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
