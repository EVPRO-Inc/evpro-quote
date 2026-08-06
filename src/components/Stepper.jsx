const STEPS = ['Your details', 'Vehicles', 'Review & submit']

export default function Stepper({ current, maxReached, onJump }) {
  return (
    <ol className="stepper" aria-label="Progress">
      {STEPS.map((label, i) => {
        const state = i === current ? 'active' : i < current ? 'done' : 'todo'
        const reachable = i <= maxReached
        return (
          <li key={label} className={`step ${state}`}>
            <button
              type="button"
              className="step-btn"
              disabled={!reachable}
              aria-current={i === current ? 'step' : undefined}
              onClick={() => reachable && onJump(i)}
            >
              <span className="step-num">{i < current ? '✓' : i + 1}</span>
              <span className="step-label">{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="step-bar" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
