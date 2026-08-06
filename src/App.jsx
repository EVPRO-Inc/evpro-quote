export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="inner">
          <span className="brand">EV.PRO</span>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <h1>Request a fleet quote</h1>
          <p>
            Tell us about your company and the vehicles you need. Add one card
            per vehicle — we&rsquo;ll follow up with pricing for Vehicle-as-a-Service
            and Charger-as-a-Service.
          </p>
        </section>

        <div className="card" style={{ marginTop: 32 }}>
          <p style={{ color: 'var(--text-muted)' }}>
            The intake form goes here (Phase 2).
          </p>
        </div>
      </main>
    </>
  )
}
