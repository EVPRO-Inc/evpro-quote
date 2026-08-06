import VehicleCard from './VehicleCard.jsx'
import { blankVehicle, duplicateVehicle } from '../lib/quoteModel.js'

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

  return (
    <section>
      <div className="section-head">
        <h2 className="step-heading">One card per vehicle</h2>
        <span className="count">{vehicles.length} vehicle{vehicles.length === 1 ? '' : 's'}</span>
      </div>

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
