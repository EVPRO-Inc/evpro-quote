import { useState } from 'react'
import Stepper from './components/Stepper.jsx'
import ContactStep from './components/ContactStep.jsx'
import VehiclesStep from './components/VehiclesStep.jsx'
import ReviewStep from './components/ReviewStep.jsx'
import { blankRequest, validateContact, totalUnits } from './lib/quoteModel.js'
import { submitQuote } from './lib/submitQuote.js'
import { CircleCheckIcon, CheckIcon } from './components/icons.jsx'

export default function App() {
  const [req, setReq] = useState(blankRequest)
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [contactErrors, setContactErrors] = useState({})
  const [expandedId, setExpandedId] = useState(req.vehicles[0].id)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [website, setWebsite] = useState('') // honeypot — stays empty for humans

  const goTo = (i) => {
    setStep(i)
    setMaxReached((m) => Math.max(m, i))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => {
    if (step === 0) {
      const errs = validateContact(req)
      setContactErrors(errs)
      if (Object.keys(errs).length) return
    }
    goTo(step + 1)
  }

  const back = () => goTo(step - 1)

  const submit = async () => {
    setSubmitError(null)
    setSubmitting(true)
    try {
      await submitQuote({ ...req, website })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <span className="brand-lockup">
            <img src={`${import.meta.env.BASE_URL}logo.png`} className="brand-logo" alt="EV.PRO" width="112" height="36" />
          </span>
          <span className="header-tag">Fleet electrification, simplified.</span>
        </div>
      </header>

      <main className="page">
        {submitted ? (
          <section className="card success">
            <span className="success-icon" aria-hidden="true"><CircleCheckIcon size={52} /></span>
            <h1>Thanks — we&rsquo;ve got your request.</h1>
            <p>
              Our team will follow up at <strong>{req.contactEmail}</strong> with
              pricing for your {totalUnits(req.vehicles)} vehicle{totalUnits(req.vehicles) === 1 ? '' : 's'}.
            </p>
          </section>
        ) : (
          <>
            <section className="hero">
              <span className="eyebrow">Fleet quote</span>
              <h1>Request a fleet quote</h1>
              <p>
                Tell us about your company and the vehicles you need. Add one card
                per vehicle — we&rsquo;ll follow up with pricing for Vehicle-as-a-Service
                and Charger-as-a-Service.
              </p>
              <ul className="trust-bar">
                <li><CheckIcon size={15} /> Zero down</li>
                <li><CheckIcon size={15} /> One monthly cost</li>
                <li><CheckIcon size={15} /> 95% uptime</li>
              </ul>
            </section>

            <Stepper current={step} maxReached={maxReached} onJump={goTo} />

            <div className="step-anim" key={step}>
              {step === 0 && (
                <ContactStep req={req} errors={contactErrors} onChange={setReq} />
              )}
              {step === 1 && (
                <VehiclesStep
                  vehicles={req.vehicles}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  onChange={(vehicles) => setReq({ ...req, vehicles })}
                />
              )}
              {step === 2 && (
                <ReviewStep
                  req={req}
                  onEditContact={() => goTo(0)}
                  onEditVehicles={() => goTo(1)}
                />
              )}
            </div>

            {/* Honeypot — hidden from humans; bots that fill it get silently dropped. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />

            {submitError && step === 2 && <p className="submit-error">{submitError}</p>}

            <div className="nav">
              {step > 0 ? (
                <button type="button" className="btn-secondary" onClick={back} disabled={submitting}>Back</button>
              ) : <span />}
              {step < 2 ? (
                <button type="button" className="btn" onClick={next}>
                  Continue <span className="btn-arrow" aria-hidden="true">→</span>
                </button>
              ) : (
                <button type="button" className="btn" onClick={submit} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit request'}
                </button>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="inner">
          <span>© 2026 EV.PRO</span>
          <span className="foot-tag">Fleet electrification, simplified.</span>
        </div>
      </footer>
    </>
  )
}
