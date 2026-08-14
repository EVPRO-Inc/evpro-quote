import Field from './Field.jsx'
import { CONDITIONS, US_STATES, OEMS, PRODUCTS, modelsFor, vehicleLabel, vehicleQty } from '../lib/quoteModel.js'
import { ChevronIcon, CopyIcon, TrashIcon, CheckIcon, PRODUCT_ICONS } from './icons.jsx'

export default function VehicleCard({
  vehicle, index, expanded, canRemove, onToggle, onChange, onDuplicate, onRemove,
}) {
  const set = (key) => (e) => onChange({ ...vehicle, [key]: e.target.value })

  // Changing make resets the model so a stale selection can't survive.
  const setMake = (e) =>
    onChange({ ...vehicle, make: e.target.value, model: '', modelOther: '' })

  const qty = vehicleQty(vehicle)
  const setQty = (n) => onChange({ ...vehicle, qty: Math.max(1, n) })
  const toggleProduct = (key) => onChange({ ...vehicle, [key]: !vehicle[key] })

  const models = modelsFor(vehicle.make)

  if (!expanded) {
    const chosen = PRODUCTS.filter((p) => vehicle[p.key])
    return (
      <div className="vehicle collapsed">
        <button type="button" className="vehicle-summary" onClick={onToggle} aria-expanded="false">
          <span className="vehicle-summary-main">
            {qty > 1 && <span className="qty-badge">{qty}×</span>}
            <span className="vehicle-title">{vehicleLabel(vehicle, index)}</span>
            {vehicle.condition && vehicle.condition !== 'Either' && (
              <span className="cond-tag">{vehicle.condition}</span>
            )}
          </span>
          <span className="vehicle-summary-right">
            {chosen.map((p) => {
              const I = PRODUCT_ICONS[p.icon]
              return <span key={p.key} className="mini-icon" title={p.label}><I size={16} /></span>
            })}
            <span className="chev" aria-hidden="true"><ChevronIcon /></span>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="vehicle expanded">
      <div className="vehicle-head">
        <button type="button" className="vehicle-title-btn" onClick={onToggle} aria-expanded="true">
          <span className="vehicle-title">{vehicleLabel(vehicle, index)}</span>
          <span className="chev open" aria-hidden="true"><ChevronIcon /></span>
        </button>
        <div className="vehicle-actions">
          <button type="button" className="icon-btn" onClick={onDuplicate} title="Duplicate this vehicle">
            <CopyIcon /> Duplicate
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={onRemove}
            disabled={!canRemove}
            title={canRemove ? 'Remove this vehicle' : 'Keep at least one vehicle'}
          >
            <TrashIcon /> Remove
          </button>
        </div>
      </div>

      {/* Vehicle identity */}
      <div className="vsection">
        <span className="group-label">Vehicle</span>
        <div className="grid">
          <Field label="Make">
            <select value={vehicle.make} onChange={setMake}>
              <option value="">Select a make</option>
              {OEMS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Model">
            {models ? (
              <select value={vehicle.model} onChange={set('model')}>
                <option value="">Select a model</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                value={vehicle.model}
                onChange={set('model')}
                disabled={!vehicle.make}
                placeholder={vehicle.make ? '' : 'Select a make first'}
              />
            )}
          </Field>
          <Field label="New / used">
            <select value={vehicle.condition} onChange={set('condition')}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        {vehicle.model === 'Other' && (
          <div className="grid" style={{ marginTop: 14 }}>
            <Field label="Model (type it in)" className="col-full">
              <input value={vehicle.modelOther} onChange={set('modelOther')} autoFocus />
            </Field>
          </div>
        )}

        {/* Quantity — prominent stepper */}
        <div className="qty-control">
          <div className="qty-control-text">
            <span className="qty-control-title">How many of this vehicle?</span>
            <span className="qty-control-sub">Same spec at the same location — otherwise add a separate card.</span>
          </div>
          <div className="qty-stepper" role="group" aria-label="Quantity">
            <button type="button" className="qty-btn" onClick={() => setQty(qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
            <input
              className="qty-input"
              type="number"
              min="1"
              value={vehicle.qty}
              onChange={(e) => onChange({ ...vehicle, qty: e.target.value })}
              onBlur={() => setQty(qty)}
              aria-label="Quantity"
            />
            <button type="button" className="qty-btn" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="vsection">
        <span className="group-label">Usage</span>
        <div className="grid">
          <Field label="Max daily miles">
            <input value={vehicle.dailyMiles} onChange={set('dailyMiles')} inputMode="numeric" />
          </Field>
          <Field label="Annual miles">
            <input value={vehicle.annualMiles} onChange={set('annualMiles')} inputMode="numeric" />
          </Field>
          <Field label="Target delivery">
            <input type="date" value={vehicle.targetDelivery} onChange={set('targetDelivery')} />
          </Field>
        </div>
      </div>

      {/* Appearance */}
      <div className="vsection">
        <span className="group-label">Details</span>
        <div className="grid">
          <Field label="Exterior color">
            <input value={vehicle.color} onChange={set('color')} />
          </Field>
          <Field label="Trim">
            <input value={vehicle.trim} onChange={set('trim')} />
          </Field>
        </div>
      </div>

      {/* Garaging */}
      <div className="vsection">
        <span className="group-label">Garaging address</span>
        <div className="grid">
          <Field label="Street address" className="col-2">
            <input value={vehicle.garagingAddress} onChange={set('garagingAddress')} />
          </Field>
          <Field label="City"><input value={vehicle.city} onChange={set('city')} /></Field>
          <Field label="State">
            <select value={vehicle.state} onChange={set('state')}>
              <option value="">—</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="ZIP"><input value={vehicle.zip} onChange={set('zip')} inputMode="numeric" /></Field>
        </div>
      </div>

      {/* Products — selectable cards */}
      <div className="vsection">
        <span className="group-label">Products needed</span>
        <div className="product-grid">
          {PRODUCTS.map((p) => {
            const I = PRODUCT_ICONS[p.icon]
            const on = Boolean(vehicle[p.key])
            return (
              <button
                key={p.key}
                type="button"
                className={`product-card${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleProduct(p.key)}
              >
                <span className="product-check" aria-hidden="true">{on && <CheckIcon size={14} />}</span>
                <span className="product-icon"><I size={26} /></span>
                <span className="product-title">{p.short}</span>
                <span className="product-desc">{p.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="vsection">
        <Field label="Other comments (uplifting needs, etc.)" className="col-full">
          <textarea rows={2} value={vehicle.comments} onChange={set('comments')} />
        </Field>
      </div>
    </div>
  )
}
