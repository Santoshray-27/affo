import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProductCard } from '../../components/storefront/ProductCard';
import { formatCurrency } from '../../lib/utils';
import { pricingConfig } from '../../config/pricing';
import { useToast } from '../../components/ui/Toast';
import { getProductImageUrl } from '../../lib/images';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Tag,
  ChevronDown,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    detailedCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    activeProducts,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useAppStore();
  const toast = useToast();

  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const freeDeliveryThreshold = pricingConfig.freeDeliveryThreshold;
  const amountToFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const suggestedProducts = activeProducts.slice(0, 4);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    const validCoupon = pricingConfig.sampleCoupons.find((c) => c.code === code);
    if (validCoupon) {
      if (cartSubtotal < validCoupon.minOrderAmount) {
        setCouponError(`Min order of ₹${validCoupon.minOrderAmount} required for ${code}`);
        return;
      }
      applyCoupon(code);
      setCouponInput('');
      toast.success('Coupon applied', validCoupon.description);
    } else {
      setCouponError('Invalid coupon code. Try ANNA10');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info('Coupon removed');
  };

  if (detailedCart.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 space-y-16">
        <div className="max-w-md mx-auto text-center">
          <EmptyState
            title="Your basket is empty"
            description="You haven't added any fresh produce to your basket yet."
            actionLabel="Start shopping"
            onAction={() => navigate('/shop')}
          />
        </div>

        {/* Suggested Produce */}
        <div className="space-y-6 pt-8 border-t border-line">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-medium text-ink">
              Fresh seasonal arrivals
            </h3>
            <Link
              to="/shop"
              className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map((p) => (
              <ProductCard key={p.id} product={p} layout="grid" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-2">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-ink">Basket</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-medium text-ink">
            Shopping Basket ({detailedCart.length} item{detailedCart.length !== 1 ? 's' : ''})
          </h1>
          <button
            onClick={() => {
              clearCart();
              toast.info('Basket cleared');
            }}
            className="text-xs text-muted hover:text-red flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear basket</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Delivery Slim Progress Bar */}
          <div className="bg-cream border border-line rounded-[10px] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-ink">
              <span>
                {amountToFree === 0
                  ? 'Free morning delivery unlocked'
                  : `Add ${formatCurrency(amountToFree)} more for free delivery (above ₹${freeDeliveryThreshold})`}
              </span>
              <span className="tabular-nums font-semibold text-forest">{freeProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-forest transition-all duration-300 rounded-full"
                style={{ width: `${freeProgress}%` }}
              />
            </div>
          </div>

          {/* Line items with hairline dividers */}
          <div className="bg-white rounded-card border border-line divide-y divide-line overflow-hidden">
            {detailedCart.map((item) => {
              const imgUrl = getProductImageUrl(item.product.id, item.product.image);
              const isOutOfStock = item.product.stockQuantity <= 0;

              return (
                <div
                  key={item.productId}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={imgUrl}
                      alt={item.product.name}
                      className="w-16 h-20 rounded-[8px] object-cover bg-cream border border-line shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="text-sm font-semibold text-ink hover:text-forest transition-colors block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted mt-0.5">{item.product.unitLabel}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-semibold text-ink tabular-nums">
                          {formatCurrency(item.product.price)}
                        </span>
                        {item.product.compareAtPrice && (
                          <span className="text-xs text-muted line-through tabular-nums">
                            {formatCurrency(item.product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      {isOutOfStock && (
                        <p className="text-xs text-red font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Out of stock. Please remove before checkout.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
                    <QuantityStepper
                      quantity={item.quantity}
                      max={item.product.stockQuantity}
                      min={0}
                      showDeleteAtMin={true}
                      onChange={(newQty) => {
                        if (newQty <= 0) {
                          removeFromCart(item.productId);
                        } else {
                          updateCartQty(item.productId, newQty);
                        }
                      }}
                      size="sm"
                    />
                    <div className="text-right min-w-[70px]">
                      <div className="text-sm font-semibold text-ink tabular-nums">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-semibold text-forest hover:underline"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Summary Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          {/* Order Summary Card */}
          <div className="bg-white rounded-card border border-line p-5 space-y-4">
            <h4 className="font-heading text-base font-medium text-ink pb-2 border-b border-line">
              Order summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Items subtotal</span>
                <span className="font-semibold text-ink tabular-nums">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-muted">
                <span>Delivery</span>
                <span className="tabular-nums">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-forest font-semibold">FREE</span>
                  ) : (
                    formatCurrency(cartDeliveryFee)
                  )}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Discount ({appliedCoupon})</span>
                  <span className="tabular-nums">-{formatCurrency(cartDiscount)}</span>
                </div>
              )}

              {/* Coupon Collapsed Behind "Have a code?" */}
              <div className="pt-2 border-t border-line">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs bg-cream p-2.5 rounded-[8px] border border-line">
                    <div>
                      <span className="font-semibold text-ink">{appliedCoupon}</span>
                      <span className="text-[11px] text-forest block">10% discount applied</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsCouponOpen(!isCouponOpen)}
                      className="flex items-center justify-between w-full text-xs font-medium text-forest hover:underline"
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 stroke-[1.5]" />
                        <span>Have a coupon code?</span>
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isCouponOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isCouponOpen && (
                      <form onSubmit={handleApplyCoupon} className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="e.g. ANNA10"
                            className="flex-1 bg-white rounded-[8px] border border-line px-3 py-1.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-forest text-ink"
                          />
                          <Button type="submit" variant="secondary" size="sm">
                            Apply
                          </Button>
                        </div>
                        {couponError && <p className="text-xs text-red">{couponError}</p>}
                        <p className="text-[11px] text-muted">
                          Try code <button type="button" onClick={() => setCouponInput('ANNA10')} className="font-mono text-forest underline font-semibold">ANNA10</button> for 10% off.
                        </p>
                      </form>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-line flex justify-between items-baseline">
                <span className="font-heading text-sm font-medium text-ink">Total</span>
                <span className="font-heading text-xl font-semibold text-ink tabular-nums">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/checkout')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to checkout
            </Button>

            {/* Discreet Footnote per Section 9 */}
            <p className="text-[11px] text-muted text-center pt-1">
              Sample demo pricing • Delivery schedules confirmed at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
