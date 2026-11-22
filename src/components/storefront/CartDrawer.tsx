import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { QuantityStepper } from '../ui/QuantityStepper';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency } from '../../lib/utils';
import { pricingConfig } from '../../config/pricing';
import { ShoppingBag, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { getProductImageUrl } from '../../lib/images';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    detailedCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    cartCount,
    updateCartQty,
    removeFromCart,
  } = useAppStore();

  const freeDeliveryThreshold = pricingConfig.freeDeliveryThreshold;
  const amountToFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <span>Your Basket ({cartCount})</span>
        </div>
      }
      subtitle="Fresh harvest reserved for 15 mins"
      footer={
        detailedCart.length > 0 ? (
          <div className="space-y-3">
            {/* Price breakdown summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Items Subtotal</span>
                <span className="font-medium text-app-text">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery (Sample Demo Pricing)</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <span className="text-success font-semibold">FREE</span>
                  ) : (
                    formatCurrency(cartDeliveryFee)
                  )}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-leaf font-medium">
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-app-text pt-2 border-t border-border">
                <span>Estimated Total</span>
                <span className="text-primary-dark font-heading text-base">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="md"
                onClick={handleViewCart}
                className="flex-1"
              >
                View Full Cart
              </Button>
              <Button
                variant="primary-red"
                size="md"
                onClick={handleCheckout}
                className="flex-1"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Checkout
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {detailedCart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center text-primary mb-4">
            <ShoppingBag className="w-8 h-8 opacity-60" />
          </div>
          <h4 className="font-heading text-lg font-bold text-app-text">Your basket is empty</h4>
          <p className="text-xs text-muted max-w-xs mt-1">
            Add seasonal greens, orchard fruits or organic cold-pressed essentials to start.
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-6"
            onClick={() => {
              onClose();
              navigate('/shop');
            }}
          >
            Explore Fresh Harvest
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Free delivery progress strip */}
          <div className="bg-mint/60 border border-mint-dark/40 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-primary-dark mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lime-dark" />
                {amountToFree === 0
                  ? '🎉 You unlocked FREE Delivery!'
                  : `Add ${formatCurrency(amountToFree)} more for FREE Delivery`}
              </span>
              <span>{freeProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-lime transition-all duration-300"
                style={{ width: `${freeProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="divide-y divide-border/60">
            {detailedCart.map((item) => {
              const imgUrl = getProductImageUrl(item.product.id, item.product.image);
              const isOutOfStock = item.product.stockQuantity <= 0;

              return (
                <div key={item.productId} className="py-3 flex items-center gap-3">
                  <img
                    src={imgUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-cream border border-border/60 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm text-app-text truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-xs text-muted">{item.product.unitLabel}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary-dark">
                        {formatCurrency(item.product.price)}
                      </span>
                      {item.product.compareAtPrice && (
                        <span className="text-xs text-muted line-through">
                          {formatCurrency(item.product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {isOutOfStock && (
                      <p className="text-[11px] text-brand-red font-semibold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> Out of stock in farm inventory
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
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
                    <span className="text-xs font-semibold text-app-text tabular-nums">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Drawer>
  );
};

