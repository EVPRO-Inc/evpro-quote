// Shape of a quote request + its vehicles. Mirrors the EV.PRO intake
// spreadsheet columns; kept in one place so the form, the review step, and
// (Phase 3) the submit edge function all agree on field names.

let seq = 0
const nextId = () => `v${Date.now().toString(36)}-${seq++}`

export function blankVehicle() {
  return {
    id: nextId(),
    make: '',
    model: '',
    condition: 'Either',
    color: '',
    trim: '',
    dailyMiles: '',
    annualMiles: '',
    targetDelivery: '',
    garagingAddress: '',
    city: '',
    state: '',
    zip: '',
    needsVaas: true,
    needsCaas: false,
    comments: '',
  }
}

export function blankRequest() {
  return {
    company: '',
    opportunity: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    vehicles: [blankVehicle()],
  }
}

// Duplicate a vehicle's details onto a fresh row (new id). Handy for fleets of
// identical vehicles at consecutive addresses.
export function duplicateVehicle(v) {
  return { ...v, id: nextId() }
}

export const CONDITIONS = ['Either', 'New', 'Used']

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Returns a map of field -> error message for step 1 (contact details).
export function validateContact(req) {
  const errors = {}
  if (!req.company.trim()) errors.company = 'Company name is required.'
  if (!req.contactName.trim()) errors.contactName = 'Your name is required.'
  if (!req.contactEmail.trim()) errors.contactEmail = 'Work email is required.'
  else if (!EMAIL_RE.test(req.contactEmail.trim())) errors.contactEmail = 'Enter a valid email.'
  return errors
}

// A vehicle counts as filled in if it has at least a make or model.
export function vehicleHasContent(v) {
  return Boolean(v.make.trim() || v.model.trim())
}

export function vehicleLabel(v, index) {
  const name = [v.make.trim(), v.model.trim()].filter(Boolean).join(' ')
  return name || `Vehicle ${index + 1}`
}
