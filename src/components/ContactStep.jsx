import Field from './Field.jsx'

export default function ContactStep({ req, errors, onChange }) {
  const set = (key) => (e) => onChange({ ...req, [key]: e.target.value })
  return (
    <section className="card">
      <h2 className="step-heading">Tell us who you are</h2>
      <div className="grid">
        <Field label="Company name" required error={errors.company}>
          <input value={req.company} onChange={set('company')} />
        </Field>
        <Field label="Your name" required error={errors.contactName}>
          <input value={req.contactName} onChange={set('contactName')} autoComplete="name" />
        </Field>
        <Field label="Work email" required error={errors.contactEmail}>
          <input type="email" value={req.contactEmail} onChange={set('contactEmail')} autoComplete="email" />
        </Field>
        <Field label="Phone">
          <input type="tel" value={req.phone} onChange={set('phone')} autoComplete="tel" />
        </Field>
      </div>
    </section>
  )
}
