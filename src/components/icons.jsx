// Small inline SVG icons (no icon-font dependency). Inherit color via
// currentColor and size via the `size` prop.
const base = (size) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round',
})

export function CarIcon({ size = 24 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <path d="M4 14l1.7-5A2 2 0 0 1 7.6 7.6h8.8A2 2 0 0 1 18.3 9l1.7 5" />
      <rect x="3" y="13" width="18" height="5" rx="1.5" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  )
}

export function BoltIcon({ size = 24 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2" />
    </svg>
  )
}

export function WrenchIcon({ size = 24 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function CheckIcon({ size = 16 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function ChevronIcon({ size = 20 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function CopyIcon({ size = 16 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function TrashIcon({ size = 16 }) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export const PRODUCT_ICONS = { car: CarIcon, bolt: BoltIcon, wrench: WrenchIcon }
