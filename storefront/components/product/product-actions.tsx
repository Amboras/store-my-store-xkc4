'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { formatPrice } from '@/lib/utils/format-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  title?: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

// Is the given option a "bundle/pack"-like option that we should render as bundle cards?
function isPackOption(title: string): boolean {
  const t = title.toLowerCase()
  return t === 'pack' || t === 'bundle' || t === 'quantity pack' || t === 'pack size'
}

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 12

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return
    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1

  return (
    <div className="space-y-6">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Option Selectors */}
      {hasMultipleVariants && options.map((option: ProductOptionWithValues) => {
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        // === PACK / BUNDLE option: render as bundle cards ===
        if (isPackOption(option.title)) {
          return (
            <div key={optionId}>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-xs uppercase tracking-[0.18em] font-semibold">
                  Choose your pack
                </h3>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Most pick the Trio
                </span>
              </div>

              <div className="space-y-2.5">
                {values.map((value, idx) => {
                  const isSelected = selectedValue === value

                  // Find the matching variant for this pack value
                  const matchVariant = variants.find((v) =>
                    v.options?.some(
                      (o) =>
                        (o.option_id === optionId || o.option?.id === optionId) &&
                        o.value === value,
                    ),
                  )
                  const matchExt = matchVariant?.id ? variantExtensions?.[matchVariant.id] : null
                  const matchPrice = getVariantPriceAmount(matchVariant)
                  const matchCurrency =
                    (matchVariant?.calculated_price &&
                    typeof matchVariant.calculated_price !== 'number'
                      ? matchVariant.calculated_price.currency_code
                      : undefined) || currency
                  const matchCompare = matchExt?.compare_at_price

                  // Check availability
                  const isAvailable = !!matchVariant && (
                    (matchExt?.allow_backorder ?? false) ||
                    matchExt?.inventory_quantity == null ||
                    matchExt.inventory_quantity > 0
                  )

                  // Compute savings
                  const savings =
                    matchPrice != null && matchCompare != null && matchCompare > matchPrice
                      ? matchCompare - matchPrice
                      : 0
                  const savingsPct =
                    matchCompare && matchCompare > 0 && savings > 0
                      ? Math.round((savings / matchCompare) * 100)
                      : 0

                  // Label parts (split on em-dash if present)
                  const [packLabel, ...rest] = value.split('—').map((s) => s.trim())
                  const packTag = rest.join(' — ')

                  // Is this the "best value" card? Highlight the trio / largest
                  const isBestValue = idx === values.length - 1 && values.length >= 2

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionId, value)}
                      disabled={!isAvailable}
                      className={`relative w-full text-left border rounded-sm transition-all p-4 sm:p-5 ${
                        isSelected
                          ? 'border-foreground bg-foreground/[0.03] ring-1 ring-foreground'
                          : isAvailable
                          ? 'border-border hover:border-foreground/50'
                          : 'border-border text-muted-foreground/50 cursor-not-allowed'
                      }`}
                    >
                      {isBestValue && (
                        <span className="absolute -top-2 left-4 inline-flex items-center gap-1 bg-ember text-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] rounded-sm">
                          <Sparkles className="h-3 w-3" strokeWidth={2} />
                          Best Value
                        </span>
                      )}

                      <div className="flex items-start gap-3">
                        {/* Radio indicator */}
                        <span
                          className={`mt-1 h-4 w-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-foreground' : 'border-border'
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-foreground" />
                          )}
                        </span>

                        {/* Label + tag */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <div>
                              <p className="font-medium">{packLabel}</p>
                              {packTag && (
                                <p className="text-xs text-ember mt-0.5 font-medium">{packTag}</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              {matchPrice != null && (
                                <p className="font-semibold tabular-nums">
                                  {formatPrice(matchPrice, matchCurrency)}
                                </p>
                              )}
                              {matchCompare && matchCompare > (matchPrice ?? 0) && (
                                <p className="text-xs text-muted-foreground line-through tabular-nums">
                                  {formatPrice(matchCompare, matchCurrency)}
                                </p>
                              )}
                            </div>
                          </div>
                          {savingsPct > 0 && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              You save {formatPrice(savings, matchCurrency)} ({savingsPct}% off)
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }

        // Default: pill buttons
        return (
          <div key={optionId}>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value
                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt) return true
                  if (vExt.allow_backorder) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : isAvailable
                        ? 'border-border hover:border-foreground'
                        : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Low Stock Warning */}
      {isLowStock && inventoryQuantity != null && (
        <div className="flex items-center gap-3 rounded-sm border border-ember/30 bg-ember/5 px-4 py-3">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-ember opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
          </span>
          <p className="text-xs sm:text-sm">
            <span className="font-semibold">Only {inventoryQuantity} left</span>
            <span className="text-muted-foreground"> in this batch — refilled in ~2 weeks.</span>
          </p>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        <div className="flex items-center border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-muted transition-colors"
            disabled={isOutOfStock || (!allowBackorder && inventoryQuantity != null && quantity >= inventoryQuantity)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
              ? 'bg-green-700 text-white'
              : 'bg-foreground text-background hover:bg-ember'
          }`}
        >
          {isAddingItem ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            'Add to Bag'
          )}
        </button>
      </div>
    </div>
  )
}
