import { useState, useEffect } from 'react'
import { resolveModel } from '../lib/quoteModel.js'

// Vehicle render from imagin.studio. The `img` customer is imagin's public
// demo key — fine for testing, but production needs EV.PRO's own licensed key
// (swap IMAGIN_CUSTOMER below). Hides itself if no image is available.
const IMAGIN_CUSTOMER = 'img'

const slug = (s) =>
  s.toLowerCase().trim()
    .replace(/[().]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function imageUrl(make, model) {
  const params = new URLSearchParams({
    customer: IMAGIN_CUSTOMER,
    make: slug(make),
    angle: '23',
    width: '600',
  })
  if (model) params.set('modelFamily', slug(model))
  return `https://cdn.imagin.studio/getimage?${params.toString()}`
}

export default function VehicleImage({ vehicle }) {
  const [failed, setFailed] = useState(false)
  const model = resolveModel(vehicle)
  const url = vehicle.make ? imageUrl(vehicle.make, model) : null

  useEffect(() => setFailed(false), [url])

  if (!url || failed) return null

  return (
    <div className="vehicle-image">
      <img src={url} alt="" onError={() => setFailed(true)} />
    </div>
  )
}
