// A segmented toggle — a more visual replacement for a small dropdown.
export default function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={ariaLabel}>
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
