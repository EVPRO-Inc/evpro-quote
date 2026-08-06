import { useState } from 'react'
import Stepper from './components/Stepper.jsx'
import ContactStep from './components/ContactStep.jsx'
import VehiclesStep from './components/VehiclesStep.jsx'
import ReviewStep from './components/ReviewStep.jsx'
import { blankRequest, validateContact } from './lib/quoteModel.js'

export default function App() {
  const [req, setReq] = useState(blankRequest)
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [contactErrors, setContactErrors] = useState({})
  const [expandedId, setExpandedId] = useState(req.vehicles[0].id)
  const [submitted, setSubmitted] = useState(false)

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

  const submit = () => {
    // Phase 3 will POST this payload to the submit-quote edge function.
    console.log('quote payload', req)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header className="site-header">
        <div className="inner"><span className="brand">EV.PRO</span></div>
      </header>

      <main className="page">
        {submitted ? (
          <section className="card success">
            <h1>Thanks — we&rsquo;ve got your request.</h1>
            <p>
              Our team will follow up at <strong>{req.contactEmail}</strong> with
              pricing for your {req.vehicles.length} vehicle{req.vehicles.length === 1 ? '' : 's'}.
            </p>
          </section>
        ) : (
          <>
            <section className="hero">
              <h1>Request a fleet quote</h1>
              <p>
                Tell us about your company and the vehicles you need. Add one card
                per vehicle — we&rsquo;ll follow up with pricing for Vehicle-as-a-Service
                and Charger-as-a-Service.
              </p>
            </section>

            <Stepper current={step} maxReached={maxReached} onJump={goTo} />

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

            <div className="nav">
              {step > 0 ? (
                <button type="button" className="btn-secondary" onClick={back}>Back</button>
              ) : <span />}
              {step < 2 ? (
                <button type="button" className="btn" onClick={next}>Continue</button>
              ) : (
                <button type="button" className="btn" onClick={submit}>Submit request</button>
              )}
            </div>
          </>
        )}
      </main>
    </>
  )
}
