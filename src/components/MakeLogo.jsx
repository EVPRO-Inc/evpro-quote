import { useState, useEffect } from 'react'
import { logoUrl, makeInitials } from '../lib/makes.js'

// Renders an OEM logo, falling back to a branded initial badge if there's no
// logo for the make or the image fails to load (keeps the UI from ever showing
// a broken image).
export default function MakeLogo({ make, size = 24 }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [make])

  const url = logoUrl(make)

  if (!make) {
    return <span className="make-logo make-logo-empty" style={{ width: size, height: size }} aria-hidden="true" />
  }
  if (!url || failed) {
    return (
      <span
        className="make-logo make-logo-initial"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.44) }}
        aria-hidden="true"
      >
        {makeInitials(make)}
      </span>
    )
  }
  return (
    <img
      className="make-logo"
      src={url}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
