import Field from './Field.jsx'
import { BuildingIcon, UserIcon, MailIcon, PhoneIcon } from './icons.jsx'

function IconInput({ icon, children }) {
  return (
    <div className="input-icon">
      <span className="input-icon-glyph" aria-hidden="true">{icon}</span>
      {children}
    </div>
  )
}

export default function ContactStep({ req, errors, onChange }) {
  const set = (key) => (e) => onChange({ ...req, [key]: e.target.value })
  return (
    <section className="card">
      <h2 className="step-heading">Tell us who you are</h2>
      <p className="step-help">We&rsquo;ll use this to send your quote and follow up — no spam.</p>
      <div className="grid grid-2">
        <Field label="Company name" required error={errors.company}>
          <IconInput icon={<BuildingIcon size={18} />}>
            <input value={req.company} onChange={set('company')} />
          </IconInput>
        </Field>
        <Field label="Your name" required error={errors.contactName}>
          <IconInput icon={<UserIcon size={18} />}>
            <input value={req.contactName} onChange={set('contactName')} autoComplete="name" />
          </IconInput>
        </Field>
        <Field label="Work email" required error={errors.contactEmail}>
          <IconInput icon={<MailIcon size={18} />}>
            <input type="email" value={req.contactEmail} onChange={set('contactEmail')} autoComplete="email" />
          </IconInput>
        </Field>
        <Field label="Phone">
          <IconInput icon={<PhoneIcon size={18} />}>
            <input type="tel" value={req.phone} onChange={set('phone')} autoComplete="tel" />
          </IconInput>
        </Field>
      </div>
    </section>
  )
}
