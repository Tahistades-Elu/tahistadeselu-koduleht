// /pood exists only while the portal's shop is open (decided when the site is
// built, from the price feed). Until then direct visitors are sent home, as
// before the shop was built.
import catalogue from '~/data/catalogue.json'

export default defineNuxtRouteMiddleware((to) => {
  const shop = (catalogue as { shop?: { open: boolean; checkoutUrl: string | null } }).shop
  if (shop?.open && shop.checkoutUrl) return
  return navigateTo(to.path.startsWith('/en') ? '/en' : '/', { redirectCode: 302 })
})
