import MakeLogo from './MakeLogo.jsx'
import {
  vehicleLabel, vehicleHasContent, vehicleQty, totalUnits, resolveTrim, PRODUCTS,
} from '../lib/quoteModel.js'

function fmtDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${m}/${d}/${y}`
}

function Spec({ label, value }) {
  if (!value) return null
  return (
    <div className="spec">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  )
}

function ReviewVehicle({ v, index }) {
  const qty = vehicleQty(v)
  const products = PRODUCTS.filter((p) => v[p.key])
  const address = [v.garagingAddress, v.city, v.state, v.zip].filter(Boolean).join(', ')
  return (
    <div className="rv">
      <div className="rv-head">
        <span className="rv-title">
          {qty > 1 && <span className="qty-badge">{qty}×</span>}
          {v.make && <MakeLogo make={v.make} size={20} />}
          {vehicleLabel(v, index)}
        </span>
        {v.condition && v.condition !== 'Either' && <span className="rv-cond">{v.condition}</span>}
      </div>
      <div className="spec-grid">
        <Spec label="Exterior color" value={v.color} />
        <Spec label="Trim" value={resolveTrim(v)} />
        <Spec label="Max daily miles" value={v.dailyMiles} />
        <Spec label="Annual miles" value={v.annualMiles} />
        <Spec label="Target delivery" value={fmtDate(v.targetDelivery)} />
      </div>
      {address && (
        <div className="rv-line"><span className="spec-label">Garaging</span> {address}</div>
      )}
      {products.length > 0 && (
        <div className="chips">
          {products.map((p) => <span key={p.key} className="chip">{p.label}</span>)}
        </div>
      )}
      {v.comments && <div className="rv-comments">“{v.comments}”</div>}
    </div>
  )
}

export default function ReviewStep({ req, onEditContact, onEditVehicles }) {
  const filled = req.vehicles.filter(vehicleHasContent)
  const blanks = req.vehicles.length - filled.length
  const units = totalUnits(req.vehicles)

  return (
    <section>
      <h2 className="step-heading">Review &amp; submit</h2>

      <div className="card review-block">
        <div className="review-block-head">
          <h3 className="review-h3">Contact</h3>
          <button type="button" className="link-btn" onClick={onEditContact}>Edit</button>
        </div>
        <div className="review-primary">{req.company || '—'}</div>
        <div className="review-sub">
          {[req.contactName, req.contactEmail, req.phone].filter(Boolean).join(' · ')}
        </div>
      </div>

      <div className="card review-block">
        <div className="review-block-head">
          <h3 className="review-h3">
            Vehicles <span className="count-pill">{units} total</span>
          </h3>
          <button type="button" className="link-btn" onClick={onEditVehicles}>Edit</button>
        </div>

        <div className="rv-list">
          {req.vehicles.map((v, i) =>
            vehicleHasContent(v) ? <ReviewVehicle key={v.id} v={v} index={i} /> : null,
          )}
        </div>

        {blanks > 0 && (
          <p className="notice">
            {blanks} vehicle {blanks === 1 ? 'card has' : 'cards have'} no make or model
            and won’t be included.
          </p>
        )}
      </div>
    </section>
  )
}
