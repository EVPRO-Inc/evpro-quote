import Field from './Field.jsx'
import { CONDITIONS, US_STATES, OEMS, PRODUCTS, modelsFor, vehicleLabel } from '../lib/quoteModel.js'

export default function VehicleCard({
  vehicle, index, expanded, canRemove, onToggle, onChange, onDuplicate, onRemove,
}) {
  const set = (key) => (e) => onChange({ ...vehicle, [key]: e.target.value })
  const setBool = (key) => (e) => onChange({ ...vehicle, [key]: e.target.checked })

  // Changing make resets the model so a stale selection can't survive.
  const setMake = (e) =>
    onChange({ ...vehicle, make: e.target.value, model: '', modelOther: '' })

  const models = modelsFor(vehicle.make)

  if (!expanded) {
    return (
      <div className="vehicle collapsed">
        <button type="button" className="vehicle-summary" onClick={onToggle} aria-expanded="false">
          <span className="vehicle-title">
            {vehicle.qty > 1 && <span className="qty-badge">{vehicle.qty}×</span>}
            {vehicleLabel(vehicle, index)}
          </span>
          <span className="chev" aria-hidden="true">▾</span>
        </button>
      </div>
    )
  }

  return (
    <div className="vehicle expanded">
      <div className="vehicle-head">
        <button type="button" className="vehicle-title-btn" onClick={onToggle} aria-expanded="true">
          <span className="vehicle-title">Vehicle {index + 1}</span>
          <span className="chev open" aria-hidden="true">▾</span>
        </button>
        <div className="vehicle-actions">
          <button type="button" className="icon-btn" onClick={onDuplicate} title="Duplicate this vehicle">
            Duplicate
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={onRemove}
            disabled={!canRemove}
            title={canRemove ? 'Remove this vehicle' : 'Keep at least one vehicle'}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Row 1 — identity */}
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

      {/* Row 2 — usage */}
      <div className="grid" style={{ marginTop: 14 }}>
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

      {/* Row 3 — specs + quantity */}
      <div className="grid" style={{ marginTop: 14 }}>
        <Field label="Exterior color">
          <input value={vehicle.color} onChange={set('color')} />
        </Field>
        <Field label="Trim">
          <input value={vehicle.trim} onChange={set('trim')} />
        </Field>
        <Field label="Quantity">
          <input type="number" min="1" value={vehicle.qty} onChange={set('qty')} />
        </Field>
      </div>

      <div className="subhead">Garaging address</div>
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

      <div className="products">
        <span className="subhead inline">Products needed</span>
        {PRODUCTS.map((p) => (
          <label key={p.key} className="check">
            <input type="checkbox" checked={vehicle[p.key]} onChange={setBool(p.key)} /> {p.label}
          </label>
        ))}
      </div>

      <Field label="Other comments (uplifting needs, etc.)" className="col-full">
        <textarea rows={2} value={vehicle.comments} onChange={set('comments')} />
      </Field>
    </div>
  )
}
