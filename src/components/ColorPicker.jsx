import { useState } from 'react'
import { EXTERIOR_COLORS } from '../lib/quoteModel.js'

// Visual exterior-color picker: clickable swatches plus an "Other" free-text
// escape hatch. The stored value is always a real color name or free text —
// "Other" mode is tracked locally so nothing sentinel-shaped leaks out.
export default function ColorPicker({ value, onChange }) {
  const known = EXTERIOR_COLORS.some((c) => c.name === value)
  const [otherOpen, setOtherOpen] = useState(Boolean(value) && !known)
  const isOther = otherOpen || (Boolean(value) && !known)

  const pickSwatch = (name) => {
    setOtherOpen(false)
    onChange(value === name ? '' : name)
  }
  const pickOther = () => {
    if (isOther) { setOtherOpen(false); onChange('') }
    else { setOtherOpen(true); if (known) onChange('') }
  }

  return (
    <div className="color-picker">
      <div className="swatches">
        {EXTERIOR_COLORS.map((c) => {
          const on = !isOther && value === c.name
          return (
            <button
              key={c.name}
              type="button"
              className={`swatch${on ? ' on' : ''}${c.border ? ' bordered' : ''}`}
              style={{ '--sw': c.hex }}
              onClick={() => pickSwatch(c.name)}
              aria-pressed={on}
              title={c.name}
            >
              <span className="swatch-dot" />
              <span className="swatch-name">{c.name}</span>
            </button>
          )
        })}
        <button
          type="button"
          className={`swatch other${isOther ? ' on' : ''}`}
          onClick={pickOther}
          aria-pressed={isOther}
        >
          <span className="swatch-dot swatch-other-dot" />
          <span className="swatch-name">Other</span>
        </button>
      </div>
      {isOther && (
        <input
          className="color-other"
          placeholder="Describe the color"
          autoFocus
          value={known ? '' : value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}
