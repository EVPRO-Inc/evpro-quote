// Shape of a quote request + its vehicles. Mirrors the EV.PRO intake
// spreadsheet columns; kept in one place so the form, the review step, and
// (Phase 3) the submit edge function all agree on field names.

let seq = 0
const nextId = () => `v${Date.now().toString(36)}-${seq++}`

export function blankVehicle() {
  return {
    id: nextId(),
    qty: 1,
    make: '',
    model: '',
    modelOther: '',
    condition: 'Either',
    color: '',
    trim: '',
    trimOther: '',
    dailyMiles: '',
    annualMiles: '',
    targetDelivery: '',
    garagingAddress: '',
    city: '',
    state: '',
    zip: '',
    needsVaas: true,
    needsCaas: false,
    needsOm: false,
    comments: '',
  }
}

export function blankRequest() {
  return {
    company: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    vehicles: [blankVehicle()],
  }
}

// Duplicate a vehicle's details onto a fresh row (new id). Handy for fleets of
// near-identical vehicles that differ only by garaging address.
export function duplicateVehicle(v) {
  return { ...v, id: nextId() }
}

export const CONDITIONS = ['New', 'Used', 'Either']

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

// Major OEMs offering EVs to fleets. 'Other' lets customers type anything.
export const OEMS = [
  'Audi', 'BMW', 'Cadillac', 'Chevrolet', 'Ford', 'Genesis', 'GMC', 'Honda',
  'Hyundai', 'Jeep', 'Kia', 'Lexus', 'Lucid', 'Mercedes-Benz', 'Nissan',
  'Polestar', 'Porsche', 'Ram', 'Rivian', 'Subaru', 'Tesla', 'Toyota',
  'Volkswagen', 'Volvo', 'Other',
]

// Model lists per make (EV / fleet-relevant). Makes without an entry (or 'Other')
// fall back to a free-text model field.
export const MODELS_BY_MAKE = {
  Audi: ['Q4 e-tron', 'Q6 e-tron', 'Q8 e-tron', 'e-tron GT'],
  BMW: ['i4', 'i5', 'i7', 'iX', 'iX1', 'iX3'],
  Cadillac: ['Lyriq', 'Optiq', 'Escalade IQ', 'Celestiq'],
  Chevrolet: ['Blazer EV', 'Equinox EV', 'Silverado EV', 'Bolt EV', 'Bolt EUV'],
  Ford: ['Mustang Mach-E', 'F-150 Lightning', 'E-Transit', 'Escape', 'Explorer'],
  Genesis: ['GV60', 'Electrified GV70', 'Electrified G80'],
  GMC: ['Hummer EV', 'Sierra EV'],
  Honda: ['Prologue'],
  Hyundai: ['Ioniq 5', 'Ioniq 6', 'Kona Electric'],
  Jeep: ['Wagoneer S', 'Recon'],
  Kia: ['EV6', 'EV9', 'Niro EV'],
  Lexus: ['RZ'],
  Lucid: ['Air', 'Gravity'],
  'Mercedes-Benz': ['EQB', 'EQE Sedan', 'EQE SUV', 'EQS Sedan', 'EQS SUV', 'eSprinter'],
  Nissan: ['Ariya', 'Leaf'],
  Polestar: ['Polestar 2', 'Polestar 3', 'Polestar 4'],
  Porsche: ['Taycan', 'Macan Electric'],
  Ram: ['1500 REV', 'ProMaster EV'],
  Rivian: ['R1T', 'R1S', 'EDV (Delivery Van)'],
  Subaru: ['Solterra'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Toyota: ['bZ4X'],
  Volkswagen: ['ID.4', 'ID.Buzz'],
  Volvo: ['EX30', 'EX40', 'EC40', 'EX90'],
}

// Returns the model list for a make, or null if the model should be free text.
export function modelsFor(make) {
  return MODELS_BY_MAKE[make] ?? null
}

// Trim options per model (EV / fleet-relevant). Models without an entry fall
// back to a free-text trim field.
export const TRIMS_BY_MODEL = {
  Lyriq: ['Tech', 'Luxury', 'Sport', 'Premium Luxury'],
  Optiq: ['Luxury', 'Sport'],
  'Escalade IQ': ['Luxury', 'Sport'],
  'Model 3': ['Standard', 'Long Range', 'Performance'],
  'Model Y': ['Long Range', 'Performance'],
  'Model S': ['All-Wheel Drive', 'Plaid'],
  'Model X': ['All-Wheel Drive', 'Plaid'],
  Cybertruck: ['All-Wheel Drive', 'Cyberbeast'],
  'Mustang Mach-E': ['Select', 'Premium', 'GT', 'Rally'],
  'F-150 Lightning': ['Pro', 'XLT', 'Lariat', 'Platinum'],
  'E-Transit': ['Cargo Van', 'Chassis Cab'],
  'Ioniq 5': ['SE', 'SEL', 'Limited'],
  'Ioniq 6': ['SE', 'SEL', 'Limited'],
  EV6: ['Light', 'Wind', 'GT-Line', 'GT'],
  EV9: ['Light', 'Wind', 'Land', 'GT-Line'],
  'Blazer EV': ['LT', 'RS', 'SS'],
  'Equinox EV': ['LT', 'RS'],
  'Silverado EV': ['WT', 'RST'],
  i4: ['eDrive35', 'eDrive40', 'xDrive40', 'M50'],
  i5: ['eDrive40', 'xDrive40', 'M60'],
  iX: ['xDrive50', 'M60'],
  'Q4 e-tron': ['Premium', 'Premium Plus', 'Prestige'],
  'Q6 e-tron': ['Premium', 'Premium Plus', 'Prestige'],
  'ID.4': ['Standard', 'Pro', 'Pro S'],
  'ID.Buzz': ['Pro S', '1st Edition'],
  Ariya: ['Engage', 'Venture+', 'Evolve+', 'Platinum+'],
  Leaf: ['S', 'SV Plus'],
  EX30: ['Core', 'Plus', 'Ultra'],
  EX90: ['Plus', 'Ultra'],
  'Polestar 2': ['Standard Range', 'Long Range'],
  'Polestar 3': ['Long Range', 'Performance'],
  Taycan: ['Base', '4S', 'Turbo', 'Turbo S'],
  'Macan Electric': ['Base', '4', 'Turbo'],
  Air: ['Pure', 'Touring', 'Grand Touring'],
  Gravity: ['Touring', 'Grand Touring'],
  'R1T': ['Adventure', 'Ascend'],
  'R1S': ['Adventure', 'Ascend'],
  bZ4X: ['XLE', 'Limited'],
  Solterra: ['Premium', 'Limited'],
  GV60: ['Standard', 'Advanced', 'Performance'],
}

export function trimsFor(model) {
  return TRIMS_BY_MODEL[model] ?? null
}

// Annual mileage buckets (10k → 50k in 5k steps, plus 50k+).
export const ANNUAL_MILEAGE_OPTIONS = [
  '10,000', '15,000', '20,000', '25,000', '30,000',
  '35,000', '40,000', '45,000', '50,000', '50,000+',
]

// Common exterior colors with paint-accurate swatch hexes (approximating real
// automotive finishes). This is a universal palette — the same options for
// every vehicle. `border` flags near-white swatches that need an outline.
export const EXTERIOR_COLORS = [
  { name: 'Black', hex: '#141519' },
  { name: 'White', hex: '#EDEFF2', border: true },
  { name: 'Silver', hex: '#C6CACF' },
  { name: 'Gray', hex: '#7C8186' },
  { name: 'Gunmetal', hex: '#3A3E45' },
  { name: 'Blue', hex: '#1F3E73' },
  { name: 'Light Blue', hex: '#6E93BE' },
  { name: 'Red', hex: '#A21F26' },
  { name: 'Green', hex: '#2A4A37' },
  { name: 'Beige', hex: '#C9BA98' },
  { name: 'Brown', hex: '#4E3A29' },
  { name: 'Bronze', hex: '#8F7143' },
  { name: 'Orange', hex: '#C55A28' },
  { name: 'Yellow', hex: '#E6B92E' },
]

export const PRODUCTS = [
  { key: 'needsVaas', icon: 'car',    label: 'Vehicle-as-a-Service',        short: 'Vehicle-as-a-Service',   desc: 'The vehicle, one monthly cost' },
  { key: 'needsCaas', icon: 'bolt',   label: 'Charger-as-a-Service',        short: 'Charger-as-a-Service',   desc: 'Charging hardware + install' },
  { key: 'needsOm',   icon: 'wrench', label: 'Operations & Maintenance (O&M)', short: 'Operations & Maintenance', desc: 'Servicing, repairs, uptime' },
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
  return Boolean(v.make.trim() || resolveModel(v).trim())
}

// The effective model string, resolving the free-text override.
export function resolveModel(v) {
  return v.model === 'Other' ? v.modelOther : v.model
}

// The effective trim string, resolving the free-text override.
export function resolveTrim(v) {
  return v.trim === 'Other' ? v.trimOther : v.trim
}

export function vehicleQty(v) {
  const n = parseInt(v.qty, 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

// Total number of physical vehicles across all cards (respecting Qty).
export function totalUnits(vehicles) {
  return vehicles.reduce((sum, v) => sum + vehicleQty(v), 0)
}

export function vehicleLabel(v, index) {
  const name = [v.make.trim(), resolveModel(v).trim()].filter(Boolean).join(' ')
  return name || `Vehicle ${index + 1}`
}
