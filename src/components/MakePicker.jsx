import { useState, useRef, useEffect } from 'react'
import { OEMS } from '../lib/quoteModel.js'
import MakeLogo from './MakeLogo.jsx'
import { ChevronIcon } from './icons.jsx'

// Custom make selector: shows OEM logos (native <select> can't) and supports
// type-to-filter. Falls back to the same value contract as a plain input.
export default function MakePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const list = OEMS.filter((m) => m.toLowerCase().includes(q.trim().toLowerCase()))
  const select = (m) => { onChange(m); setOpen(false); setQ('') }

  return (
    <div className="make-picker" ref={ref}>
      <button
        type="button"
        className={`make-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <span className="make-trigger-val"><MakeLogo make={value} size={22} /><span>{value}</span></span>
        ) : (
          <span className="make-placeholder">Select a make</span>
        )}
        <span className={`chev${open ? ' open' : ''}`} aria-hidden="true"><ChevronIcon size={18} /></span>
      </button>

      {open && (
        <div className="make-pop">
          <input
            className="make-search"
            autoFocus
            placeholder="Search makes…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <ul className="make-list" role="listbox">
            {list.map((m) => (
              <li key={m}>
                <button
                  type="button"
                  className={`make-option${m === value ? ' sel' : ''}`}
                  onClick={() => select(m)}
                  role="option"
                  aria-selected={m === value}
                >
                  <MakeLogo make={m} size={22} />
                  <span>{m}</span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="make-empty">No matches</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
