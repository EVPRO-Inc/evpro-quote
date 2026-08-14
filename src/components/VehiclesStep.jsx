import VehicleCard from './VehicleCard.jsx'
import { blankVehicle, duplicateVehicle, totalUnits } from '../lib/quoteModel.js'

export default function VehiclesStep({ vehicles, expandedId, onChange, setExpandedId }) {
  const update = (next) => onChange(next)

  const changeVehicle = (v) =>
    update(vehicles.map((x) => (x.id === v.id ? v : x)))

  const addVehicle = () => {
    const v = blankVehicle()
    update([...vehicles, v])
    setExpandedId(v.id)
  }

  const dupVehicle = (v) => {
    const copy = duplicateVehicle(v)
    const i = vehicles.findIndex((x) => x.id === v.id)
    const next = [...vehicles.slice(0, i + 1), copy, ...vehicles.slice(i + 1)]
    update(next)
    setExpandedId(copy.id)
  }

  const removeVehicle = (v) => {
    const next = vehicles.filter((x) => x.id !== v.id)
    update(next)
    if (expandedId === v.id) setExpandedId(next[Math.max(0, next.length - 1)]?.id ?? null)
  }

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  const units = totalUnits(vehicles)

  return (
    <section>
      <div className="section-head">
        <h2 className="step-heading">One card per vehicle type</h2>
        <span className="count">{units} vehicle{units === 1 ? '' : 's'} total</span>
      </div>
      <p className="step-help">
        Set <b>Quantity</b> for several of the same vehicle at one location, or{' '}
        <b>Duplicate</b> a card to reuse the details and change just what differs.
      </p>

      <div className="vehicle-list">
        {vehicles.map((v, i) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            index={i}
            expanded={expandedId === v.id}
            canRemove={vehicles.length > 1}
            onToggle={() => toggle(v.id)}
            onChange={changeVehicle}
            onDuplicate={() => dupVehicle(v)}
            onRemove={() => removeVehicle(v)}
          />
        ))}
      </div>

      <button type="button" className="btn-secondary add-vehicle" onClick={addVehicle}>
        + Add another vehicle
      </button>
    </section>
  )
}
