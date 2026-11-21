<template>
  <div>
    <!-- Page header -->
    <section class="pt-40 pb-20 px-6 bg-stone-50">
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-xs tracking-[0.35em] uppercase text-stone-400 mb-4">{{ $t('pood.eyebrow') }}</p>
        <h1 class="text-4xl md:text-6xl font-extralight text-stone-800 tracking-[0.08em] uppercase leading-tight">
          {{ titleLine1 }}<br />{{ titleLine2 }}
        </h1>
        <p class="mt-8 text-base text-stone-500 font-light max-w-lg mx-auto leading-relaxed">
          {{ $t('pood.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Everything for sale, from the portal's price list (group "Pood") -->
    <section class="py-24 px-6 bg-white">
      <div class="max-w-5xl mx-auto">
        <p class="text-xs tracking-[0.3em] uppercase text-stone-400 mb-16 text-center">{{ $t('pood.gridLabel') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in shopItems"
            :key="item.code"
            class="flex flex-col p-10 bg-white border border-stone-200 hover:border-stone-400 hover:shadow-xl transition-all duration-300"
          >
            <h2 class="text-base tracking-[0.1em] uppercase font-light text-stone-800 mb-5">{{ item.title }}</h2>
            <p class="text-3xl font-extralight tracking-wide text-stone-700">{{ item.price }}</p>
            <p v-if="item.description" class="font-light text-sm leading-relaxed mt-6 text-stone-500 flex-1">{{ item.description }}</p>
            <a
              :href="checkoutHref({ toode: item.code })!"
              class="mt-10 text-center text-xs tracking-[0.25em] uppercase px-6 py-4 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-all duration-300"
            >
              {{ $t('pood.orderBtn') }}
            </a>
          </div>
        </div>
        <p class="mt-10 text-center text-xs text-stone-400 font-light">{{ $t('pood.checkoutNote') }}</p>
      </div>
    </section>

    <template v-if="workbook">
    <!-- What is it -->
    <section class="py-24 px-6 bg-white">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <!-- Text -->
        <div>
          <p class="text-xs tracking-[0.3em] uppercase text-stone-400 mb-8">{{ $t('pood.whatLabel') }}</p>
          <p class="text-2xl md:text-3xl font-extralight text-stone-700 leading-relaxed mb-8">
            {{ $t('pood.whatLead') }}
          </p>
          <p class="text-stone-500 font-light leading-relaxed text-base">
            {{ $t('pood.whatBody') }}
          </p>
        </div>
        <!-- Visual placeholder — replace with actual product image -->
        <div class="aspect-[3/4] bg-stone-100 flex items-center justify-center">
          <div class="text-center px-8">
            <div class="w-16 h-16 mx-auto mb-6 text-stone-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p class="text-xs tracking-[0.2em] uppercase text-stone-400 font-light">Minu Lugu</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapters -->
    <section class="py-24 px-6 bg-stone-50">
      <div class="max-w-4xl mx-auto">
        <p class="text-xs tracking-[0.3em] uppercase text-stone-400 mb-16 text-center">{{ $t('pood.chaptersLabel') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div
            v-for="(ch, i) in chapters"
            :key="i"
            class="flex flex-col gap-3"
          >
            <span class="text-xs tracking-[0.2em] uppercase text-stone-300 font-light">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="text-sm tracking-[0.15em] uppercase text-stone-800 font-light">{{ ch.title }}</h3>
            <p class="text-xs text-stone-400 font-light leading-relaxed">{{ ch.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Specs + Price -->
    <section class="py-24 px-6 bg-white">
      <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

        <!-- Specs -->
        <div>
          <p class="text-xs tracking-[0.3em] uppercase text-stone-400 mb-8">{{ $t('pood.specLabel') }}</p>
          <ul class="space-y-4">
            <li
              v-for="(spec, i) in specs"
              :key="i"
              class="flex items-start gap-3 text-sm font-light text-stone-500"
            >
              <span class="text-stone-300 mt-0.5 flex-shrink-0">—</span>
              <span>{{ spec }}</span>
            </li>
          </ul>
        </div>

        <!-- Price -->
        <div class="flex flex-col justify-between">
          <div>
            <p class="text-4xl font-extralight text-stone-800 tracking-wide">{{ workbook?.price }}</p>
          </div>
          <div class="mt-10">
            <a
              :href="checkoutHref({ toode: workbook.code })!"
              class="inline-block border border-stone-800 text-stone-800 text-xs tracking-[0.25em] uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300"
            >
              {{ $t('pood.buyBtn') }}
            </a>
            <p class="mt-4 text-xs text-stone-400 font-light leading-relaxed">{{ $t('pood.buyNote') }}</p>
          </div>
        </div>

      </div>
    </section>

    </template>
  </div>
</template>

<script setup lang="ts">
// Hidden until the portal's shop is open; ordering and paying happen in the
// portal's checkout (one way to order, prices set on the server).
definePageMeta({ middleware: 'shop-open' })

const { t, tm } = useI18n()
// The price is the portal price list's, like every price on the site.
const { shopItems, checkoutHref } = useCatalogue()
const workbook = computed(() => shopItems.value.find(i => i.code === 'workbook'))

useSeoMeta({
  title: () => t('pood.seo.title'),
  description: () => t('pood.seo.description'),
  ogTitle: () => t('pood.seo.title'),
  ogDescription: () => t('pood.seo.description'),
  ogImage: 'https://tahistadeselu.ee/og-image.jpg',
})

const titleRaw = computed(() => t('pood.title'))
const titleLine1 = computed(() => titleRaw.value.split('\n')[0] ?? '')
const titleLine2 = computed(() => titleRaw.value.split('\n')[1] ?? '')

const chapters = computed(() => tm('pood.chapters') as Array<{ title: string; desc: string }>)
const specs = computed(() => tm('pood.specs') as string[])
</script>
