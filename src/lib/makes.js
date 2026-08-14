// OEM logo lookup. Logos come from the open car-logos-dataset served via the
// jsDelivr CDN (high-res, reliable). Any make without a slug — or whose image
// fails to load — falls back to a branded initial badge (see MakeLogo).

const LOGO_BASE =
  'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/'

export const OEM_LOGO_SLUG = {
  Audi: 'audi',
  BMW: 'bmw',
  Cadillac: 'cadillac',
  Chevrolet: 'chevrolet',
  Ford: 'ford',
  Genesis: 'genesis',
  GMC: 'gmc',
  Honda: 'honda',
  Hyundai: 'hyundai',
  Jeep: 'jeep',
  Kia: 'kia',
  Lexus: 'lexus',
  Lucid: 'lucid',
  'Mercedes-Benz': 'mercedes-benz',
  Nissan: 'nissan',
  Polestar: 'polestar',
  Porsche: 'porsche',
  Ram: 'ram',
  Rivian: 'rivian',
  Subaru: 'subaru',
  Tesla: 'tesla',
  Toyota: 'toyota',
  Volkswagen: 'volkswagen',
  Volvo: 'volvo',
}

export function logoUrl(make) {
  const slug = OEM_LOGO_SLUG[make]
  return slug ? `${LOGO_BASE}${slug}.png` : null
}

export function makeInitials(make) {
  if (!make) return ''
  const cleaned = make.replace(/[^A-Za-z]/g, '')
  return cleaned.slice(0, 1).toUpperCase()
}
