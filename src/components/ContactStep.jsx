import Field from './Field.jsx'

export default function ContactStep({ req, errors, onChange }) {
  const set = (key) => (e) => onChange({ ...req, [key]: e.target.value })
  return (
    <section className="card">
      <h2 className="step-heading">Tell us who you are</h2>
      <div className="grid">
        <Field label="Company / customer" required error={errors.company}>
          <input value={req.company} onChange={set('company')} placeholder="Sweet EV Rides" />
        </Field>
        <Field label="Opportunity / location">
          <input value={req.opportunity} onChange={set('opportunity')} placeholder="Florida Tranche #2" />
        </Field>
        <Field label="Your name" required error={errors.contactName}>
          <input value={req.contactName} onChange={set('contactName')} autoComplete="name" />
        </Field>
        <Field label="Work email" required error={errors.contactEmail}>
          <input type="email" value={req.contactEmail} onChange={set('contactEmail')} placeholder="name@company.com" autoComplete="email" />
        </Field>
        <Field label="Phone">
          <input type="tel" value={req.phone} onChange={set('phone')} autoComplete="tel" />
        </Field>
      </div>
    </section>
  )
}
