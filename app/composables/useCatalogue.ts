// Every price on this site, from one place.
//
// app/data/catalogue.json is written by scripts/fetch-catalogue.mjs from the
// portal's public price feed when the site is built. Pages never hardcode a
// price or a package's contents: the portal's price list (Seaded → Hinnakiri)
// is the source, so the site and the invoice cannot disagree.
import catalogue from '~/data/catalogue.json'

type Lang = 'et' | 'en'

interface CatalogueItem {
  code: string
  priceCents: number
  requiresShipping: boolean
  /** Bought at the checkout; otherwise it starts with a free introductory call. Absent in older feeds. */
  orderOnline?: boolean
  name: Record<Lang, string>
  description: Record<Lang, string>
  features: Record<Lang, string[]>
}

type Group = 'pre_planning' | 'ceremony' | 'shop'

// The portal's codes predate this site's package ids. The booking form and
// its Apps Script backend still speak the site's ids, so they are mapped here
// until the codes are renamed on both sides (owner: "don't rename yet").
const SITE_PACKAGE_ID: Record<string, string> = {
  basic: 'self',
  standard: 'supported',
  full: 'personal',
}

/** 4900 -> "49 €" (et, non-breaking space as the site always had) / "€49" (en). */
export function formatPrice(cents: number, lang: Lang): string {
  const whole = cents % 100 === 0
  const value = whole ? String(cents / 100) : (cents / 100).toFixed(2)
  return lang === 'et' ? `${value.replace('.', ',')}\u00A0€` : `€${value}`
}

interface ShopFlag { open: boolean; checkoutUrl: string | null; requestUrl?: string | null }

export function useCatalogue() {
  const { locale } = useI18n()
  const lang = computed<Lang>(() => (locale.value === 'en' ? 'en' : 'et'))
  const groups = (catalogue as { groups: Record<Group, { fromCents: number | null; items: CatalogueItem[] }> }).groups

  const view = (item: CatalogueItem) => ({
    code: item.code,
    id: SITE_PACKAGE_ID[item.code] ?? item.code,
    title: item.name[lang.value],
    price: formatPrice(item.priceCents, lang.value),
    priceCents: item.priceCents,
    fit: item.description[lang.value],
    description: item.description[lang.value],
    list: item.features[lang.value],
    requiresShipping: item.requiresShipping,
    orderOnline: item.orderOnline !== false,
  })

  const packages = computed(() => groups.pre_planning.items.map(view))
  const shopItems = computed(() => groups.shop.items.map(view))

  /** "Alates 49 €" / "From €49" — the cheapest visible item in the group. */
  function fromPrice(group: Group): string {
    const cents = groups[group]?.fromCents
    return cents === null || cents === undefined ? '' : formatPrice(cents, lang.value)
  }

  // The portal's checkout, once the shop is open (payments set up and terms
  // written). Decided when the site is built; while closed, the buy buttons
  // keep leading to the booking form and /pood stays hidden.
  const shop = ((catalogue as { shop?: ShopFlag }).shop ?? { open: false, checkoutUrl: null }) as ShopFlag
  const shopOpen = shop.open && !!shop.checkoutUrl

  /**
   * Absolute link into the checkout with one thing preselected, or null while
   * the shop is closed — or for a package that starts with a call instead.
   */
  function checkoutHref(what: { pakett: string } | { toode: string }): string | null {
    if (!shopOpen) return null
    if ('pakett' in what && groups.pre_planning.items.find((i) => i.code === what.pakett)?.orderOnline === false) return null
    const q = new URLSearchParams(what as Record<string, string>)
    if (lang.value === 'en') q.set('lang', 'en')
    return `${shop.checkoutUrl}?${q.toString()}`
  }

  // The portal's "book a free introductory call" form (owner, 2026-11-23): the
  // larger packages and ceremonies start with a conversation. Needs no payment
  // setup, so it is offered whenever the portal says where it is.
  const requestUrl = shop.requestUrl ?? null

  /** Absolute link to the portal's request form, or null if the feed names none. */
  function requestHref(what: { pakett?: string; teema?: 'tseremoonia' } = {}): string | null {
    if (!requestUrl) return null
    const q = new URLSearchParams(Object.entries(what).filter(([, v]) => v) as [string, string][])
    if (lang.value === 'en') q.set('lang', 'en')
    const qs = q.toString()
    return qs ? `${requestUrl}?${qs}` : requestUrl
  }

  return { packages, shopItems, fromPrice, lang, shopOpen, checkoutHref, requestHref }
}
