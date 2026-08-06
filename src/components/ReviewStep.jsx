import { vehicleLabel, vehicleHasContent } from '../lib/quoteModel.js'

function summarize(vehicles) {
  const counts = new Map()
  vehicles.forEach((v, i) => {
    const label = vehicleLabel(v, i)
    counts.set(label, (counts.get(label) || 0) + 1)
  })
  return [...counts.entries()].map(([label, n]) => `${n}× ${label}`).join(' · ')
}

export default function ReviewStep({ req, onEditContact, onEditVehicles }) {
  const filled = req.vehicles.filter(vehicleHasContent)
  return (
    <section className="card">
      <h2 className="step-heading">Review &amp; submit</h2>

      <div className="review-row">
        <div>
          <div className="review-primary">{req.company || '—'}{req.opportunity ? ` · ${req.opportunity}` : ''}</div>
          <div className="review-sub">{req.contactName} · {req.contactEmail}{req.phone ? ` · ${req.phone}` : ''}</div>
        </div>
        <button type="button" className="link-btn" onClick={onEditContact}>Edit</button>
      </div>

      <div className="review-row">
        <div>
          <div className="review-primary">{req.vehicles.length} vehicle{req.vehicles.length === 1 ? '' : 's'}</div>
          <div className="review-sub">{summarize(req.vehicles)}</div>
        </div>
        <button type="button" className="link-btn" onClick={onEditVehicles}>Edit</button>
      </div>

      {filled.length < req.vehicles.length && (
        <p className="notice">
          {req.vehicles.length - filled.length} vehicle row(s) have no make or model and will be sent as blank.
        </p>
      )}
    </section>
  )
}
