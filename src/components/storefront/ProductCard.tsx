import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency } from '../../lib/utils';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Eye, Plus } from 'lucide-react';
import { getProductImageUrl } from '../../lib/images';

export interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQty, removeFromCart, getCategoryById } = useAppStore();
  const toast = useToast();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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
    toast.success('Added to basket', `${product.name} (${product.unitLabel})`);
  };

  const handleQtyChange = (newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(product.id);
    } else {
      updateCartQty(product.id, newQty);
    }
  };

  return (
    <>
      {/* 1. LIST LAYOUT */}
      {layout === 'list' && (
        <div className="bg-white rounded-card border border-line p-4 flex flex-col sm:flex-row items-center gap-4 transition-colors hover:border-forest/40">
          <div className="relative w-full sm:w-32 aspect-[4/5] sm:h-36 shrink-0 rounded-[10px] overflow-hidden bg-cream cursor-pointer">
            <img
              src={imageUrl}
              alt={product.name}
              onClick={() => navigate(`/product/${product.id}`)}
              className={`w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03] ${
                isOutOfStock ? 'grayscale opacity-75' : ''
              }`}
              loading="lazy"
            />
            {discountPercent && !isOutOfStock && (
              <span className="absolute top-2 left-2 bg-red text-white text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
                {discountPercent}% OFF
              </span>
            )}
            {isOutOfStock && (
              <span className="absolute top-2 left-2 bg-ink/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
                Sold out
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">
              {category?.name || 'Produce'}
            </div>
            <Link
              to={`/product/${product.id}`}
              className="text-base font-semibold text-ink hover:text-forest transition-colors block leading-snug"
            >
              {product.name}
            </Link>
            <p className="text-xs text-muted mt-1 line-clamp-1">{product.description}</p>
            <p className="text-xs text-muted mt-2">{product.unitLabel}</p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
            <div className="text-left sm:text-right">
              <div className="text-base font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </div>
              {product.compareAtPrice && (
                <div className="text-xs text-muted line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQuickViewOpen(true)}
                className="p-2 rounded-[8px] border border-line text-muted hover:text-ink hover:border-forest transition-colors"
                title="Quick preview"
                aria-label="Quick preview"
              >
                <Eye className="w-4 h-4 stroke-[1.5]" />
              </button>

              {isOutOfStock ? (
                <span className="px-3 py-1.5 text-xs text-muted bg-cream rounded-[8px] border border-line select-none">
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPACT LAYOUT */}
      {layout === 'compact' && (
        <div className="group bg-white rounded-card border border-line p-2.5 flex flex-col justify-between transition-colors hover:border-forest/40">
          <div>
            <div className="relative aspect-[4/5] w-full rounded-[8px] overflow-hidden bg-cream mb-2 cursor-pointer">
              <img
                src={imageUrl}
                alt={product.name}
                onClick={() => navigate(`/product/${product.id}`)}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                  isOutOfStock ? 'grayscale opacity-75' : ''
                }`}
                loading="lazy"
              />
              {discountPercent && !isOutOfStock && (
                <span className="absolute top-1.5 left-1.5 bg-red text-white text-[9px] font-semibold px-1.5 py-0.2 rounded-[3px]">
                  {discountPercent}%
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute top-1.5 left-1.5 bg-ink/80 text-white text-[9px] font-semibold px-1.5 py-0.2 rounded-[3px]">
                  Sold out
                </span>
              )}
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted truncate">
                {category?.name || 'Produce'}
              </div>
              <Link
                to={`/product/${product.id}`}
                className="text-xs font-semibold text-ink hover:text-forest transition-colors block truncate mt-0.5"
                title={product.name}
              >
                {product.name}
              </Link>
              <p className="text-[10px] text-muted truncate">{product.unitLabel}</p>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-line flex items-center justify-between gap-1.5">
            <div>
              <div className="text-xs font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </div>
            </div>

            <div>
              {isOutOfStock ? (
                <span className="text-[10px] text-muted">Sold out</span>
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
                  onClick={handleAddToCart}
                  className="px-2.5 py-1 bg-red hover:bg-red-hover text-white rounded-[6px] text-xs font-medium transition-colors"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. GRID LAYOUT (Standard Default) */}
      {layout === 'grid' && (
        <div className="group bg-white rounded-card border border-line p-3 flex flex-col justify-between transition-all duration-200 hover:border-forest/40 hover:shadow-soft">
          <div>
            {/* Image (4:5 aspect ratio, 10px radius) */}
            <div className="relative aspect-[4/5] w-full rounded-[10px] overflow-hidden bg-cream mb-3 cursor-pointer">
              <img
                src={imageUrl}
                alt={product.name}
                onClick={() => navigate(`/product/${product.id}`)}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                  isOutOfStock ? 'grayscale opacity-75' : ''
                }`}
                loading="lazy"
              />

              {discountPercent && !isOutOfStock && (
                <span className="absolute top-2 left-2 bg-red text-white text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
                  {discountPercent}% OFF
                </span>
              )}

              {isOutOfStock && (
                <span className="absolute top-2 left-2 bg-ink/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
                  Sold out
                </span>
              )}

              {/* Quick View Icon on Hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-[6px] bg-white text-ink border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Quick preview"
                aria-label="Quick preview"
              >
                <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>

            {/* Info */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted block">
                {category?.name || 'Produce'}
              </span>
              <Link
                to={`/product/${product.id}`}
                className="text-sm font-semibold text-ink hover:text-forest transition-colors block mt-0.5 line-clamp-1"
                title={product.name}
              >
                {product.name}
              </Link>
              <p className="text-xs text-muted mt-0.5">{product.unitLabel}</p>
            </div>
          </div>

          {/* Price & Add Stepper */}
          <div className="pt-3 mt-3 border-t border-line flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </div>
              {product.compareAtPrice && (
                <div className="text-[11px] text-muted line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </div>
              )}
            </div>

            <div>
              {isOutOfStock ? (
                <span className="text-xs text-muted font-medium">Sold out</span>
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      <Modal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        maxWidth="md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="aspect-[4/5] rounded-[10px] overflow-hidden bg-cream">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {category?.name}
              </span>
              <h3 className="font-heading text-xl font-semibold text-ink mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">{product.unitLabel}</p>

              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-xl font-semibold text-ink tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-muted line-through tabular-nums">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-semibold text-red bg-red/10 px-1.5 py-0.5 rounded-[4px]">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-muted leading-relaxed mt-4">
                {product.description}
              </p>
            </div>

            <div className="pt-4 border-t border-line flex items-center gap-3">
              {isOutOfStock ? (
                <div className="w-full text-center py-2 text-xs font-medium text-muted bg-cream rounded-[8px] border border-line">
                  Currently out of stock
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setIsQuickViewOpen(false);
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      handleAddToCart(e);
                      setIsQuickViewOpen(false);
                    }}
                  >
                    Add to Basket
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ProductCard;
