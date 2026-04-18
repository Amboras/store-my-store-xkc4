'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  Flame,
  Leaf,
  Sparkles,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Heart,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

// Confirmed Unsplash candle/ambience imagery
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1600&q=80'
const EDITORIAL_IMAGE =
  'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=1600&q=80'
const STUDIO_IMAGE =
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1600&q=80'
const GIFT_IMAGE =
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1600&q=80'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* ========================= HERO ========================= */}
      <section className="relative bg-cream bg-grain overflow-hidden">
        <div className="container-custom grid lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-16 pb-20 lg:pt-28 lg:pb-32">
          {/* Text */}
          <div className="lg:col-span-6 space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em]">
              <Flame className="h-3.5 w-3.5 text-ember" strokeWidth={1.75} />
              <span>Small-batch · Hand-poured in Kraków</span>
            </div>

            <h1 className="font-heading font-medium tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[0.98] text-balance">
              Slow down.
              <span className="block italic text-ember">Light up.</span>
            </h1>

            <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
              Clean-burning soy candles infused with botanical fragrance oils.
              Crafted in tiny batches for people who treat rest as a ritual —
              not an afterthought.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] hover:bg-ember transition-colors"
                prefetch
              >
                Shop the Candles
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-foreground/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                prefetch
              >
                Our Story
              </Link>
            </div>

            {/* Mini social proof */}
            <div className="flex items-center gap-5 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-ember text-ember" strokeWidth={0} />
                ))}
              </div>
              <span>
                <strong className="text-foreground">4.9 / 5</strong> from 2,300+ happy homes
              </span>
            </div>
          </div>

          {/* Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-5 grid-rows-6 gap-3 h-[480px] sm:h-[560px] lg:h-[640px] animate-fade-in">
              {/* Main image */}
              <div className="col-span-3 row-span-6 relative overflow-hidden rounded-sm bg-sand">
                <Image
                  src={HERO_IMAGE}
                  alt="Lumé soy candle burning at dusk"
                  fill
                  sizes="(max-width: 1024px) 60vw, 36vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Upper right */}
              <div className="col-span-2 row-span-3 relative overflow-hidden rounded-sm bg-sand">
                <Image
                  src={STUDIO_IMAGE}
                  alt="Candle in styled interior"
                  fill
                  sizes="24vw"
                  className="object-cover"
                />
              </div>

              {/* Lower right - floating card */}
              <div className="col-span-2 row-span-3 relative rounded-sm bg-ink text-primary-foreground p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-ember opacity-70 blur-[2px] animate-flicker" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">
                    01
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">
                    Signature scent
                  </p>
                  <p className="font-heading text-xl italic">Ember &amp; Oak</p>
                  <p className="text-xs text-primary-foreground/70 leading-relaxed">
                    Smoked cedar, warm amber, soft vanilla.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value strip */}
        <div className="border-t border-foreground/10 bg-background/40 backdrop-blur-sm">
          <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-y-4">
            {[
              { icon: Leaf, label: '100% Soy Wax' },
              { icon: Flame, label: '50+ Hour Burn' },
              { icon: Sparkles, label: 'Phthalate-Free' },
              { icon: Package, label: 'Recycled Packaging' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 py-4">
                <Icon className="h-4 w-4 text-ember" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= COLLECTIONS ========================= */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map(
            (
              collection: {
                id: string
                handle: string
                title: string
                metadata?: Record<string, unknown>
              },
              index: number,
            ) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                alternate={index % 2 === 1}
              />
            ),
          )}
        </>
      ) : null}

      {/* ========================= RITUAL / EDITORIAL ========================= */}
      <section className="py-section bg-sand">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                The Lumé Ritual
              </p>
              <h2 className="mt-4 font-heading font-medium text-4xl sm:text-5xl leading-tight tracking-tight text-balance">
                Made slowly, so you can <em className="text-ember">live slowly</em>.
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
                Every candle is poured by hand in small batches of sixty. No
                shortcuts, no synthetic fragrance, no paraffin. Just clean
                soy wax, cotton wicks, and botanical oils — the way candles
                were made before the world got loud.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: 'Hand-poured',
                    desc: 'Each vessel filled and finished by a person, not a machine.',
                  },
                  {
                    title: 'Botanically scented',
                    desc: 'Steam-distilled essential oils. No phthalates, ever.',
                  },
                  {
                    title: 'Vessel-to-vessel recyclable',
                    desc: 'Return your empty jar — we refill it at 30% off.',
                  },
                ].map((f) => (
                  <li key={f.title} className="flex gap-4 border-t border-foreground/10 pt-4">
                    <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ember" />
                    <div>
                      <p className="font-medium">{f.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/about"
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] link-underline pb-1"
                prefetch
              >
                Read our story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted mt-8">
                  <Image
                    src={EDITORIAL_IMAGE}
                    alt="Candle pour in studio"
                    fill
                    sizes="(max-width: 1024px) 45vw, 24vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                  <Image
                    src={GIFT_IMAGE}
                    alt="Candle styled on linen"
                    fill
                    sizes="(max-width: 1024px) 45vw, 24vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= TESTIMONIALS ========================= */}
      <section className="py-section">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Loved in 2,300+ homes
            </p>
            <h2 className="mt-4 font-heading font-medium text-4xl sm:text-5xl tracking-tight">
              Our <em className="text-ember">readers</em> said it better.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                quote:
                  'The scent throw is unreal — it fills the whole living room without being overpowering. I finally understand why people obsess over soy candles.',
                author: 'Maja K.',
                location: 'Warsaw',
              },
              {
                quote:
                  'Ember & Oak is my new evening ritual. I light it the second I close my laptop. It\'s become a signal to my brain: you\'re off the clock.',
                author: 'Daniel R.',
                location: 'Brooklyn',
              },
              {
                quote:
                  'Beautifully made, beautifully packaged, and the refill program is genius. Bought one for myself and three as gifts.',
                author: 'Hanna W.',
                location: 'Berlin',
              },
            ].map((t, i) => (
              <figure
                key={i}
                className="flex flex-col justify-between border border-foreground/10 bg-background p-7 rounded-sm"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-ember text-ember" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote className="font-heading italic text-lg leading-snug">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-6 pt-5 border-t border-foreground/10 text-sm">
                  <span className="font-medium">{t.author}</span>
                  <span className="text-muted-foreground"> · {t.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= GIFT BANNER ========================= */}
      <section className="relative bg-ink text-primary-foreground overflow-hidden">
        <div className="container-custom grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-section">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-primary-foreground/60">
              Give something that slows people down
            </p>
            <h2 className="font-heading font-medium text-4xl sm:text-5xl leading-tight tracking-tight">
              The Lumé <em className="text-ember">gift box</em>.
            </h2>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed">
              Hand-tied in our signature linen, with a handwritten card of
              your choosing. The kind of gift people actually remember.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <Heart className="h-4 w-4 text-ember fill-ember" strokeWidth={0} />
              <span>Free gift wrapping on orders over $85</span>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-ember text-background px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity"
              prefetch
            >
              Shop Gifts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={GIFT_IMAGE}
              alt="Lumé gift box"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ========================= TRUST BAR ========================= */}
      <section className="py-section-sm border-y">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
              <Truck className="h-6 w-6 flex-shrink-0 text-ember" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Free shipping over $65</p>
                <p className="text-xs text-muted-foreground">Worldwide tracked delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <RotateCcw className="h-6 w-6 flex-shrink-0 text-ember" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">30-day &ldquo;love it&rdquo; guarantee</p>
                <p className="text-xs text-muted-foreground">Return even a lit candle</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end text-center md:text-right">
              <Shield className="h-6 w-6 flex-shrink-0 text-ember" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Secure checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL · Stripe protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= NEWSLETTER ========================= */}
      <section className="py-section bg-cream">
        <div className="container-custom max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            The slow letter
          </p>
          <h2 className="mt-3 font-heading font-medium text-4xl tracking-tight">
            Get <em className="text-ember">10% off</em> your first candle.
          </h2>
          <p className="mt-3 text-muted-foreground">
            One short email a month — new scents, quiet essays on rest, and
            the occasional early-access drop.
          </p>
          <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="you@somewhere-quiet.com"
              className="flex-1 border-b border-foreground/30 bg-transparent px-1 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-foreground text-background px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] hover:bg-ember transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-[11px] text-muted-foreground">
            No spam. Unsubscribe in one click.
          </p>
        </div>
      </section>
    </>
  )
}
