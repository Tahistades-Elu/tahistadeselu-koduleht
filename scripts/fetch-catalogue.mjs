// Fetches the portal's public price feed and writes app/data/catalogue.json,
// which every price on this site is rendered from.
//
// Runs before `nuxt generate`. The portal (iseteenindus) owns prices; this
// site only prints them, so the two can never quote different numbers.
//
//   PORTAL_CATALOGUE_URL set   -> fetch it; ANY problem fails the build, so a
//                                 broken feed can never publish blank or wrong
//                                 prices — the live site simply stays as it was.
//   PORTAL_CATALOGUE_URL unset -> keep the committed snapshot (local dev).
//
// No secrets: the feed is public, and so is everything it says.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const out = fileURLToPath(new URL('../app/data/catalogue.json', import.meta.url))
const url = process.env.PORTAL_CATALOGUE_URL

const GROUPS = ['pre_planning', 'ceremony', 'shop']

function fail(message) {
  console.error(`fetch-catalogue: ${message}`)
  process.exit(1)
}

function isText(v) { return typeof v === 'string' }
function isTexts(v) { return Array.isArray(v) && v.every(isText) }

/** Refuse anything that is not exactly the shape the pages expect. */
export function validate(body) {
  if (!body || body.currency !== 'EUR' || typeof body.groups !== 'object') return 'not a catalogue'
  for (const g of GROUPS) {
    const group = body.groups[g]
    if (!group || !Array.isArray(group.items)) return `group ${g} missing`
    if (group.fromCents !== null && !Number.isInteger(group.fromCents)) return `group ${g}: bad fromCents`
    for (const item of group.items) {
      if (!isText(item.code) || !Number.isInteger(item.priceCents) || item.priceCents < 0) {
        return `group ${g}: bad item ${JSON.stringify(item.code)}`
      }
      for (const field of ['name', 'description']) {
        if (!item[field] || !isText(item[field].et) || !isText(item[field].en)) return `${item.code}: bad ${field}`
      }
      if (!item.name.et || !item.name.en) return `${item.code}: empty name`
      if (!item.features || !isTexts(item.features.et) || !isTexts(item.features.en)) return `${item.code}: bad features`
    }
  }
  // The site has a packages section and two "from" prices; an empty group
  // there means the price list lost something, not that it should vanish.
  if (!body.groups.pre_planning.items.length) return 'no pre-planning packages'
  if (body.groups.ceremony.fromCents === null) return 'no ceremony price'
  return null
}

if (!url) {
  const problem = validate(JSON.parse(readFileSync(out, 'utf8')))
  if (problem) fail(`committed snapshot is invalid: ${problem}`)
  console.log('fetch-catalogue: PORTAL_CATALOGUE_URL not set, using the committed snapshot')
  process.exit(0)
}

let body
try {
  const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20_000) })
  if (!res.ok) fail(`${url} answered ${res.status}`)
  body = await res.json()
} catch (e) {
  fail(`could not read ${url}: ${e.message}`)
}
const problem = validate(body)
if (problem) fail(`${url}: ${problem}`)
writeFileSync(out, JSON.stringify(body, null, 2) + '\n')
console.log(`fetch-catalogue: wrote ${out} from ${url}`)
