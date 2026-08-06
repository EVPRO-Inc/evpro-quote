import Field from './Field.jsx'
import { CONDITIONS, US_STATES, vehicleLabel } from '../lib/quoteModel.js'

export default function VehicleCard({
  vehicle, index, expanded, canRemove, onToggle, onChange, onDuplicate, onRemove,
}) {
  const set = (key) => (e) => onChange({ ...vehicle, [key]: e.target.value })
  const setBool = (key) => (e) => onChange({ ...vehicle, [key]: e.target.checked })

  if (!expanded) {
    return (
      <div className="vehicle collapsed">
        <button type="button" className="vehicle-summary" onClick={onToggle} aria-expanded="false">
          <span className="vehicle-title">{vehicleLabel(vehicle, index)}</span>
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

      <div className="grid">
        <Field label="Make"><input value={vehicle.make} onChange={set('make')} placeholder="Cadillac" /></Field>
        <Field label="Model"><input value={vehicle.model} onChange={set('model')} placeholder="Lyriq" /></Field>
        <Field label="New / used">
          <select value={vehicle.condition} onChange={set('condition')}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Exterior color"><input value={vehicle.color} onChange={set('color')} placeholder="Black" /></Field>
        <Field label="Trim"><input value={vehicle.trim} onChange={set('trim')} placeholder="Luxury" /></Field>
        <Field label="Max daily miles"><input value={vehicle.dailyMiles} onChange={set('dailyMiles')} placeholder="250" inputMode="numeric" /></Field>
        <Field label="Annual miles"><input value={vehicle.annualMiles} onChange={set('annualMiles')} placeholder="60,000" inputMode="numeric" /></Field>
        <Field label="Target delivery"><input value={vehicle.targetDelivery} onChange={set('targetDelivery')} placeholder="ASAP" /></Field>
      </div>

      <div className="subhead">Garaging address</div>
      <div className="grid">
        <Field label="Street address" className="col-2">
          <input value={vehicle.garagingAddress} onChange={set('garagingAddress')} placeholder="3705 Mindy Ashley Ln" />
        </Field>
        <Field label="City"><input value={vehicle.city} onChange={set('city')} placeholder="Jacksonville" /></Field>
        <Field label="State">
          <select value={vehicle.state} onChange={set('state')}>
            <option value="">—</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="ZIP"><input value={vehicle.zip} onChange={set('zip')} placeholder="32218" inputMode="numeric" /></Field>
      </div>

      <div className="products">
        <span className="subhead inline">Products needed</span>
        <label className="check"><input type="checkbox" checked={vehicle.needsVaas} onChange={setBool('needsVaas')} /> Vehicle-as-a-Service</label>
        <label className="check"><input type="checkbox" checked={vehicle.needsCaas} onChange={setBool('needsCaas')} /> Charger-as-a-Service</label>
      </div>

      <Field label="Other comments (uplifting needs, etc.)" className="col-full">
        <textarea rows={2} value={vehicle.comments} onChange={set('comments')} />
      </Field>
    </div>
  )
}
