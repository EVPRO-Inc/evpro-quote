// Small labelled-input wrapper shared across steps.
export default function Field({ label, required, error, children, className = '' }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">
        {label}{required && <span className="req" aria-hidden="true"> *</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
