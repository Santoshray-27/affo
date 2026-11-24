import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency } from '../../lib/utils';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Eye, Plus, Check, Sparkles, Sun, ShieldCheck } from 'lucide-react';
import { getProductImageUrl } from '../../lib/images';

export interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list' | 'compact';
  isSelected?: boolean;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  isSelected = false,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQty, removeFromCart, getCategoryById } = useAppStore();
  const toast = useToast();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isTouchedExpanded, setIsTouchedExpanded] = useState(false);
  const [justAddedPulse, setJustAddedPulse] = useState(false);

  const cartItem = cart.find((i) => i.productId === product.id);
  const cartQty = cartItem?.quantity || 0;
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= 10;
  const category = getCategoryById(product.categoryId);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const imageUrl = getProductImageUrl(product.id, product.image);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product.id, 1);
    setJustAddedPulse(true);
    setTimeout(() => setJustAddedPulse(false), 900);
    toast.success('Added to basket', `${product.name} (${product.unitLabel})`);
  };

  const handleQtyChange = (newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(product.id);
    } else {
      updateCartQty(product.id, newQty);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(product);
    }
    // On touch screens, toggle expansion if clicking card background
    setIsTouchedExpanded((prev) => !prev);
  };

  // =========================================================================
  // 1. LIST LAYOUT: Open horizontal produce row with calm dividers
  // =========================================================================
  if (layout === 'list') {
    return (
      <>
        <div
          onClick={handleCardClick}
          className={`group relative rounded-2xl bg-white/85 hover:bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 cursor-pointer ${
            isSelected
              ? 'border-forest ring-2 ring-forest/20 bg-mint/30 shadow-soft'
              : 'border-line/70 hover:border-forest/40 hover:shadow-soft hover:-translate-y-0.5'
          } ${isOutOfStock ? 'opacity-85' : ''}`}
        >
          {/* Produce Photography */}
          <div className="relative w-full sm:w-36 aspect-[4/5] sm:h-36 shrink-0 rounded-xl overflow-hidden bg-[#F6F7F0] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={product.name}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                isOutOfStock ? 'grayscale opacity-75' : ''
              }`}
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {discountPercent && !isOutOfStock && (
                <span className="bg-red text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                  {discountPercent}% OFF
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-ink/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-2xs">
                  Sold out
                </span>
              )}
              {isLowStock && (
                <span className="bg-marigold text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-2xs">
                  Low stock
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/95 text-ink border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
              title="Quick preview"
              aria-label="Quick preview"
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          {/* Narrative Info */}
          <div className="flex-1 min-w-0 w-full text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-leaf font-semibold">
                {category?.name || 'Produce'}
              </span>
              <span className="w-1 h-1 rounded-full bg-line" />
              <span className="text-[11px] text-muted flex items-center gap-1 font-mono">
                <Sun className="w-3 h-3 text-leaf" /> Sunrise harvest
              </span>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-base sm:text-lg font-heading font-medium text-ink hover:text-forest transition-colors block leading-snug"
            >
              {product.name}
            </Link>

            <p className="text-xs sm:text-[13px] text-muted mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mt-2.5">
              <span className="text-xs font-mono font-medium text-ink/80 bg-cream border border-line/60 rounded-md px-2 py-0.5">
                {product.unitLabel}
              </span>
              {isLowStock && (
                <span className="text-[11px] text-marigold-dark font-medium">
                  Only {product.stockQuantity} left
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Cart Action */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-line/80 shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </div>
              {product.compareAtPrice && (
                <div className="text-xs text-muted line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {isOutOfStock ? (
                <span className="px-3.5 py-1.5 text-xs text-muted bg-cream rounded-lg border border-line select-none font-medium">
                  Sold out
                </span>
              ) : cartQty > 0 ? (
                <QuantityStepper
                  quantity={cartQty}
                  max={product.stockQuantity}
                  min={0}
                  showDeleteAtMin={true}
                  onChange={handleQtyChange}
                  size="sm"
                />
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-4 py-2 bg-red hover:bg-red-hover text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  {justAddedPulse ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        {isQuickViewOpen && renderQuickViewModal()}
      </>
    );
  }

  // =========================================================================
  // 2. COMPACT DENSE LAYOUT: Structured for fast scanning & small screens
  // =========================================================================
  if (layout === 'compact') {
    return (
      <>
        <div
          onClick={handleCardClick}
          className={`group relative rounded-xl bg-white/90 hover:bg-white border transition-all duration-300 p-2.5 flex flex-col justify-between cursor-pointer ${
            isSelected
              ? 'border-forest ring-2 ring-forest/20 bg-mint/30 shadow-soft'
              : 'border-line/70 hover:border-forest/40 hover:shadow-soft hover:-translate-y-0.5'
          } ${isOutOfStock ? 'opacity-85' : ''}`}
        >
          <div>
            {/* Image */}
            <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-[#F6F7F0] mb-2">
              <img
                src={imageUrl}
                alt={product.name}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  isOutOfStock ? 'grayscale opacity-75' : ''
                }`}
                loading="lazy"
              />

              <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                {discountPercent && !isOutOfStock && (
                  <span className="bg-red text-white text-[9px] font-semibold px-1.5 py-0.2 rounded-full shadow-2xs">
                    {discountPercent}%
                  </span>
                )}
                {isOutOfStock && (
                  <span className="bg-ink/80 text-white text-[9px] font-medium px-1.5 py-0.2 rounded-full shadow-2xs">
                    Sold out
                  </span>
                )}
              </div>
            </div>

            {/* Title & Category */}
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted truncate">
                {category?.name || 'Produce'}
              </div>
              <Link
                to={`/product/${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs sm:text-[13px] font-semibold text-ink hover:text-forest transition-colors block truncate mt-0.5"
                title={product.name}
              >
                {product.name}
              </Link>
              <p className="text-[11px] text-muted truncate font-mono mt-0.5">
                {product.unitLabel}
              </p>
            </div>
          </div>

          {/* Price & Action */}
          <div
            className="pt-2 mt-2 border-t border-line/60 flex items-center justify-between gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-xs sm:text-sm font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </div>
              {product.compareAtPrice && (
                <div className="text-[10px] text-muted line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </div>
              )}
            </div>

            <div>
              {isOutOfStock ? (
                <span className="text-[10px] text-muted font-medium">Sold out</span>
              ) : cartQty > 0 ? (
                <QuantityStepper
                  quantity={cartQty}
                  max={product.stockQuantity}
                  min={0}
                  showDeleteAtMin={true}
                  onChange={handleQtyChange}
                  size="sm"
                />
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-2.5 py-1 bg-red hover:bg-red-hover text-white rounded-md text-xs font-semibold shadow-2xs transition-colors active:scale-95"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        {isQuickViewOpen && renderQuickViewModal()}
      </>
    );
  }

  // =========================================================================
  // 3. GRID LAYOUT: Default open, tactile farm-market composition
  // =========================================================================
  const showExpandedInfo = isTouchedExpanded;

  return (
    <>
      <div
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsTouchedExpanded((prev) => !prev);
          }
        }}
        className={`group relative rounded-2xl bg-white/80 hover:bg-white border transition-all duration-300 p-3.5 sm:p-4 flex flex-col justify-between text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:border-forest ${
          isSelected
            ? 'border-forest ring-2 ring-forest/25 bg-mint/25 shadow-soft'
            : 'border-line/75 hover:border-forest/45 hover:shadow-soft hover:-translate-y-1'
        } ${isOutOfStock ? 'opacity-85' : ''}`}
      >
        <div>
          {/* Produce Photography Container */}
          <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F6F7F0] mb-3 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={product.name}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                isOutOfStock ? 'grayscale opacity-75' : ''
              }`}
              loading="lazy"
            />

            {/* Badges Top-Left */}
            <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 z-10">
              {discountPercent && !isOutOfStock && (
                <span className="bg-red text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full shadow-2xs tracking-tight">
                  {discountPercent}% OFF
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-ink/80 backdrop-blur-xs text-white text-[10.5px] font-medium px-2 py-0.5 rounded-full shadow-2xs">
                  Sold out
                </span>
              )}
              {isLowStock && (
                <span className="bg-marigold text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                  Only {product.stockQuantity} left
                </span>
              )}
            </div>

            {/* Quick View Button Top-Right (Hover or Focus) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-white/95 text-ink border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shadow-xs hover:bg-forest hover:text-white hover:border-forest"
              title="Quick preview"
              aria-label="Quick preview"
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          {/* Product Meta & Title */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-muted uppercase">
              <span>{category?.name || 'Produce'}</span>
              <span className="text-[10px] text-leaf font-medium flex items-center gap-1 normal-case font-sans">
                <Sun className="w-3 h-3" /> Sunrise fresh
              </span>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm sm:text-[15px] font-heading font-medium text-ink hover:text-forest transition-colors block mt-1 line-clamp-2 min-h-[2.5rem] leading-snug"
              title={product.name}
            >
              {product.name}
            </Link>

            <div className="flex items-center justify-between text-xs text-muted mt-1">
              <span className="font-mono">{product.unitLabel}</span>
              {product.compareAtPrice && !isOutOfStock && (
                <span className="text-[11px] text-forest font-medium">
                  Save {formatCurrency(product.compareAtPrice - product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Controlled Expandable Secondary Row (Revealed on hover, keyboard focus, or touch) */}
          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              showExpandedInfo
                ? 'max-h-16 opacity-100 pt-2 mt-2 border-t border-line/60'
                : 'max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 group-hover:pt-2 group-hover:mt-2 group-hover:border-t group-hover:border-line/60 group-focus-within:max-h-16 group-focus-within:opacity-100 group-focus-within:pt-2 group-focus-within:mt-2 group-focus-within:border-t group-focus-within:border-line/60'
            }`}
          >
            <p className="text-[11.5px] text-muted line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Pricing & Add Action Bottom Strip */}
        <div
          className="pt-3 mt-3 border-t border-line/70 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="text-base sm:text-lg font-semibold text-ink tabular-nums leading-none">
              {formatCurrency(product.price)}
            </div>
            {product.compareAtPrice && (
              <div className="text-[11px] text-muted line-through tabular-nums mt-0.5">
                {formatCurrency(product.compareAtPrice)}
              </div>
            )}
          </div>

          <div>
            {isOutOfStock ? (
              <span className="px-3 py-1.5 text-xs text-muted font-medium bg-cream rounded-lg border border-line select-none">
                Sold out
              </span>
            ) : cartQty > 0 ? (
              <QuantityStepper
                quantity={cartQty}
                max={product.stockQuantity}
                min={0}
                showDeleteAtMin={true}
                onChange={handleQtyChange}
                size="sm"
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="px-3.5 py-1.5 bg-red hover:bg-red-hover text-white rounded-[9px] text-xs font-semibold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {justAddedPulse ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && renderQuickViewModal()}
    </>
  );

  // Helper: Quick View Modal
  function renderQuickViewModal() {
    return (
      <Modal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        title={product.name}
        maxWidth="md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="aspect-square rounded-xl overflow-hidden bg-[#F6F7F0] border border-line/80 relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent && (
              <span className="absolute top-2.5 left-2.5 bg-red text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="space-y-4 text-left">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-leaf font-semibold">
                {category?.name || 'Farm Produce'}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-medium text-ink mt-1">
                {product.name}
              </h3>
              <p className="text-xs font-mono text-muted mt-0.5">{product.unitLabel}</p>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {product.description}
            </p>

            <div className="p-3 bg-cream/80 rounded-xl border border-line/60 space-y-1">
              <div className="text-[11px] font-semibold uppercase text-forest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Harvest Standard
              </div>
              <p className="text-[11px] text-muted leading-tight">
                Harvested at dawn, ozone bubble washed, dispatched before sunrise.
              </p>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="pt-2">
              {isOutOfStock ? (
                <span className="text-xs text-muted font-medium bg-cream px-4 py-2 rounded-lg border border-line inline-block">
                  Currently out of stock
                </span>
              ) : cartQty > 0 ? (
                <div className="flex items-center gap-3">
                  <QuantityStepper
                    quantity={cartQty}
                    max={product.stockQuantity}
                    min={0}
                    showDeleteAtMin={true}
                    onChange={handleQtyChange}
                    size="md"
                  />
                  <span className="text-xs text-forest font-medium">In your basket</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleAddToCart}
                  icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
                >
                  Add to basket ({formatCurrency(product.price)})
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
};

export default ProductCard;
