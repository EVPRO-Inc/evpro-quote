import { useState } from 'react'
import Field from './Field.jsx'
import MakePicker from './MakePicker.jsx'
import MakeLogo from './MakeLogo.jsx'
import Segmented from './Segmented.jsx'
import ColorPicker from './ColorPicker.jsx'
import {
  CONDITIONS, US_STATES, PRODUCTS, ANNUAL_MILEAGE_OPTIONS,
  modelsFor, trimsFor, resolveModel, vehicleLabel, vehicleQty,
} from '../lib/quoteModel.js'
import { ChevronIcon, CopyIcon, TrashIcon, CheckIcon, PRODUCT_ICONS } from './icons.jsx'

export default function VehicleCard({
  vehicle, index, expanded, canRemove, onToggle, onChange, onDuplicate, onRemove,
}) {
  const set = (key) => (e) => onChange({ ...vehicle, [key]: e.target.value })

  const setMake = (make) =>
    onChange({ ...vehicle, make, model: '', modelOther: '', trim: '', trimOther: '' })
  const setModel = (e) =>
    onChange({ ...vehicle, model: e.target.value, modelOther: '', trim: '', trimOther: '' })
  const setModelText = (e) =>
    onChange({ ...vehicle, model: e.target.value, trim: '', trimOther: '' })

  const models = modelsFor(vehicle.make)
  const chosenModel = resolveModel(vehicle)
  const trims = trimsFor(chosenModel)
  const hasModel = Boolean(chosenModel)

  const qty = vehicleQty(vehicle)
  const setQty = (n) => onChange({ ...vehicle, qty: Math.max(1, n) })
  const toggleProduct = (key) => onChange({ ...vehicle, [key]: !vehicle[key] })

  const hasMore = Boolean(
    vehicle.color || vehicle.dailyMiles || vehicle.annualMiles || vehicle.targetDelivery || vehicle.comments,
  )
  const [showMore, setShowMore] = useState(hasMore)

  if (!expanded) {
    const chosen = PRODUCTS.filter((p) => vehicle[p.key])
    return (
      <div className="vehicle collapsed">
        <button type="button" className="vehicle-summary" onClick={onToggle} aria-expanded="false">
          <span className="vehicle-summary-main">
            {qty > 1 && <span className="qty-badge">{qty}×</span>}
            {vehicle.make && <MakeLogo make={vehicle.make} size={22} />}
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
          {vehicle.make && <MakeLogo make={vehicle.make} size={24} />}
          <span className="vehicle-title">{vehicleLabel(vehicle, index)}</span>
          <span className="chev open" aria-hidden="true"><ChevronIcon /></span>
        </button>
        <div className="vehicle-actions">
          <div className="qty-mini" role="group" aria-label="Quantity">
            <span className="qty-mini-label">Qty</span>
            <button type="button" className="qty-mini-btn" onClick={() => setQty(qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
            <input
              className="qty-mini-input"
              type="number"
              min="1"
              value={vehicle.qty}
              onChange={(e) => onChange({ ...vehicle, qty: e.target.value })}
              onBlur={() => setQty(qty)}
              aria-label="Quantity"
            />
            <button type="button" className="qty-mini-btn" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" className="icon-btn" onClick={onDuplicate} title="Duplicate this vehicle">
            <CopyIcon /> <span className="icon-btn-text">Duplicate</span>
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={onRemove}
            disabled={!canRemove}
            title={canRemove ? 'Remove this vehicle' : 'Keep at least one vehicle'}
          >
            <TrashIcon /> <span className="icon-btn-text">Remove</span>
          </button>
        </div>
      </div>

      {/* Essentials */}
      <div className="grid">
        <Field label="Make">
          <MakePicker value={vehicle.make} onChange={setMake} />
        </Field>
        <Field label="Model">
          {models ? (
            <select value={vehicle.model} onChange={setModel}>
              <option value="">Select a model</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              value={vehicle.model}
              onChange={setModelText}
              disabled={!vehicle.make}
              placeholder={vehicle.make ? '' : 'Select a make first'}
            />
          )}
        </Field>
        <Field label="Trim">
          {trims ? (
            <select value={vehicle.trim} onChange={set('trim')}>
              <option value="">Select a trim</option>
              {trims.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              value={vehicle.trim}
              onChange={set('trim')}
              disabled={!hasModel}
              placeholder={hasModel ? '' : 'Pick a model first'}
            />
          )}
        </Field>
      </div>

      {vehicle.model === 'Other' && (
        <Field label="Model (type it in)" className="mt">
          <input value={vehicle.modelOther} onChange={set('modelOther')} autoFocus />
        </Field>
      )}
      {vehicle.trim === 'Other' && (
        <Field label="Trim (type it in)" className="mt">
          <input value={vehicle.trimOther} onChange={set('trimOther')} autoFocus />
        </Field>
      )}

      <div className="cond-row">
        <span className="field-label">New / used</span>
        <Segmented
          options={CONDITIONS}
          value={vehicle.condition}
          onChange={(v) => onChange({ ...vehicle, condition: v })}
          ariaLabel="New or used"
        />
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

      {/* Products */}
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

      {/* Optional extras — collapsed by default to keep the card light */}
      <div className="more-block">
        <button
          type="button"
          className={`more-toggle${showMore ? ' open' : ''}`}
          onClick={() => setShowMore((s) => !s)}
          aria-expanded={showMore}
        >
          <ChevronIcon size={16} />
          {showMore ? 'Hide extra details' : 'More details (color, mileage, delivery)'}
        </button>

        {showMore && (
          <div className="more-panel">
            <div>
              <span className="field-label">Exterior color</span>
              <ColorPicker value={vehicle.color} onChange={(c) => onChange({ ...vehicle, color: c })} />
            </div>
            <div className="grid mt">
              <Field label="Max daily miles">
                <input value={vehicle.dailyMiles} onChange={set('dailyMiles')} inputMode="numeric" />
              </Field>
              <Field label="Annual miles">
                <select value={vehicle.annualMiles} onChange={set('annualMiles')}>
                  <option value="">Select</option>
                  {ANNUAL_MILEAGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Target delivery">
                <input type="date" value={vehicle.targetDelivery} onChange={set('targetDelivery')} />
              </Field>
            </div>
            <Field label="Other comments (uplifting needs, etc.)" className="col-full mt">
              <textarea rows={2} value={vehicle.comments} onChange={set('comments')} />
            </Field>
          </div>
        )}
      </div>
    </div>
  )
}
