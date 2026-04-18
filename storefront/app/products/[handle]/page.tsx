import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600

import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Star,
  Flame,
  Leaf,
  Hand,
  Recycle,
  Clock,
  Ruler,
} from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import TrustBadges from '@/components/product/trust-badges'
import SaleCountdown from '@/components/product/sale-countdown'
import SocialProofTicker from '@/components/product/social-proof-ticker'
import ScentNotes from '@/components/product/scent-notes'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

/**
 * Curated per-product scent notes and specs. Falls back to generic bullets
 * for products we haven't hand-curated (e.g. gift sets).
 */
const SCENT_PROFILES: Record<string, { top: string; heart: string; base: string }> = {
  'ember-oak':    { top: 'Cedarwood, Bergamot', heart: 'Amber, Tobacco',    base: 'Vanilla, Sandalwood' },
  'linen-laurel': { top: 'White Tea, Bergamot', heart: 'Linen, Bay Laurel', base: 'Vetiver, Soft Musk'   },
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]

  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  const scentProfile = SCENT_PROFILES[handle]
  const scentNotes = scentProfile
    ? [
        { label: `Top: ${scentProfile.top}`,    description: 'First impression. The scent you notice the moment you light the wick.' },
        { label: `Heart: ${scentProfile.heart}`, description: 'Where the candle settles after 20 minutes — the mood of the room.' },
        { label: `Base: ${scentProfile.base}`,  description: 'The quiet, lingering warmth that stays long after the flame is out.' },
      ]
    : null

  // Determine a lead "subtitle" / tagline for the hero block
  const leadTagline =
    handle === 'ember-oak' ? 'Smoked cedar · Warm amber · Soft vanilla' :
    handle === 'linen-laurel' ? 'Sun-warmed linen · White tea · Bay laurel' :
    handle === 'the-discovery-trio' ? 'Three signature scents, linen-wrapped' :
    (product.subtitle || '')

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b bg-cream">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Small-batch badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-background/95 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-sm">
                <Flame className="h-3 w-3 text-ember" strokeWidth={2} />
                Small batch
              </div>
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: { url: string }, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden bg-muted rounded-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-7">
            {/* Title + subtitle + rating */}
            <div>
              {leadTagline && (
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  {leadTagline}
                </p>
              )}
              <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating row */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-ember text-ember"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">4.9</strong> · 820 home reviews
                </span>
              </div>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* Countdown urgency */}
            <SaleCountdown label="Bundle pricing ends tonight at midnight" />

            {/* Variant Selector + Price + Add to Cart */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* Social proof ticker */}
            <SocialProofTicker productTitle={product.title} />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Product quick specs */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y">
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto mb-1.5 text-ember" strokeWidth={1.5} />
                <p className="text-xs font-semibold">50+ hr burn</p>
                <p className="text-[11px] text-muted-foreground">Cotton wick</p>
              </div>
              <div className="text-center">
                <Leaf className="h-5 w-5 mx-auto mb-1.5 text-ember" strokeWidth={1.5} />
                <p className="text-xs font-semibold">100% soy wax</p>
                <p className="text-[11px] text-muted-foreground">Non-toxic</p>
              </div>
              <div className="text-center">
                <Hand className="h-5 w-5 mx-auto mb-1.5 text-ember" strokeWidth={1.5} />
                <p className="text-xs font-semibold">Hand-poured</p>
                <p className="text-[11px] text-muted-foreground">Small batch</p>
              </div>
            </div>

            {/* Accordion Sections */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>
      </div>

      {/* ========== SCENT NOTES BREAKDOWN ========== */}
      {scentNotes && (
        <section className="py-section-sm border-t bg-sand">
          <div className="container-custom max-w-4xl">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  The scent
                </p>
                <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium tracking-tight">
                  Built in <em className="text-ember">three acts</em>.
                </h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Every candle is a small piece of theatre. Top notes open the
                  scene, heart notes hold the room, base notes linger after
                  the flame is out.
                </p>
              </div>
              <div>
                <ScentNotes notes={scentNotes} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== HOW IT'S MADE ========== */}
      <section className="py-section-sm border-t">
        <div className="container-custom max-w-5xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground text-center">
            How it&apos;s made
          </p>
          <h2 className="mt-3 text-center font-heading text-3xl sm:text-4xl font-medium tracking-tight">
            Four steps. <em className="text-ember">No shortcuts.</em>
          </h2>

          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf,    title: 'Source',  body: 'Soy wax from non-GMO farms. Essential oils from small European distilleries.' },
              { icon: Hand,    title: 'Pour',    body: 'Sixty candles per batch. Each one filled and finished by hand.' },
              { icon: Clock,   title: 'Cure',    body: 'Rested for 14 days so the fragrance binds fully to the wax.' },
              { icon: Ruler,   title: 'Test',    body: 'Every batch gets a burn test. If it tunnels or smokes, we start over.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative border-t border-foreground/10 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
                    0{i + 1}
                  </span>
                  <Icon className="h-4 w-4 text-ember" strokeWidth={1.5} />
                </div>
                <p className="font-heading text-xl">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Recycle className="h-4 w-4 text-ember" strokeWidth={1.5} />
              <span>Return your empty jar — we refill it at <strong>30% off</strong>.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MINI FAQ ========== */}
      <section className="py-section-sm border-t bg-cream">
        <div className="container-custom max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground text-center">
            Before you light it
          </p>
          <h2 className="mt-3 text-center font-heading text-3xl sm:text-4xl font-medium tracking-tight">
            Common <em className="text-ember">questions</em>.
          </h2>

          <dl className="mt-10 divide-y divide-foreground/10 border-t border-foreground/10">
            {[
              {
                q: 'How long does each candle burn?',
                a: 'Our 8 oz candles burn for 50–55 hours when used correctly. Let the wax melt all the way to the edge on the first burn — this prevents tunneling and roughly doubles the total burn time.',
              },
              {
                q: 'Is it safe for homes with pets or kids?',
                a: 'Yes. We use 100% soy wax, cotton-paper wicks, and phthalate-free fragrance oils. No paraffin, no lead, no synthetic musks. Still — never leave any candle unattended.',
              },
              {
                q: 'What if I don\'t love the scent?',
                a: 'Send it back within 30 days — lit, burned, whatever. We\'ll refund the full amount, no questions. It\'s the only way we\'d feel good about selling something you burn inside your home.',
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes. Tracked shipping to the US, EU, UK, and Canada. Free on orders over $65. Most orders arrive in 2–5 business days.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="font-heading text-lg font-medium">{q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
