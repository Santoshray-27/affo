import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/AppStoreContext';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import {
  Check,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useAppStore();

  const order = getOrderById(orderId || '');

  useEffect(() => {
    if (order) {
      // Light, restrained celebration per Section 6
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#14612A', '#4FA52A', '#A6CE39'],
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Order not found"
          description={`No recorded order found with reference ID "${orderId}".`}
          actionLabel="View All Orders"
          onAction={() => navigate('/orders')}
        />
      </div>
    );
  }

  const paymentMethodLabel =
    order.paymentMethod === 'upi'
      ? 'UPI'
      : order.paymentMethod === 'card_netbanking'
      ? 'Card / NetBanking'
      : order.paymentMethod === 'wallet'
      ? 'Annapurna Wallet'
      : 'Cash on Delivery';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-8 pb-24">
      {/* Calm, Minimal Header per Section 6 */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-[10px] bg-forest text-white mx-auto flex items-center justify-center">
          <Check className="w-6 h-6 stroke-[2]" />
        </div>
        <h1 className="font-heading text-3xl font-medium text-ink">
          Order placed successfully
        </h1>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Your harvest order has been received and scheduled for morning dispatch.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-card border border-line p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
          <div>
            <span className="text-xs text-muted block">Order ID</span>
            <div className="font-mono text-base font-semibold text-ink mt-0.5">
              {order.id}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-muted block">Placed on</span>
            <div className="text-xs font-medium text-ink mt-0.5">
              {formatDateTime(order.createdAt)}
            </div>
          </div>
        </div>

        {/* 3 Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-cream rounded-[8px] border border-line space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-medium">
              <Clock className="w-3.5 h-3.5 text-forest" />
              <span>Delivery Slot</span>
            </div>
            <div className="font-semibold text-ink">
              {order.deliverySlot || 'Morning 6:00 AM – 9:00 AM'}
            </div>
          </div>

          <div className="p-3 bg-cream rounded-[8px] border border-line space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-medium">
              <MapPin className="w-3.5 h-3.5 text-forest" />
              <span>Delivery Address</span>
            </div>
            <div className="font-semibold text-ink truncate">
              {order.deliveryAddress.locality}, {order.deliveryAddress.city}
            </div>
          </div>

          <div className="p-3 bg-cream rounded-[8px] border border-line space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-medium">
              <CreditCard className="w-3.5 h-3.5 text-forest" />
              <span>Payment</span>
            </div>
            <div className="font-semibold text-ink truncate">
              {paymentMethodLabel}
            </div>
          </div>
        </div>

        {/* Items List Summary */}
        <div className="pt-2 border-t border-line space-y-2">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
            Items Ordered ({order.items.length})
          </span>
          <div className="divide-y divide-line">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-ink">{item.name}</span>
                  <span className="text-muted ml-2">{item.quantity} x {item.unitLabel}</span>
                </div>
                <span className="font-semibold text-ink tabular-nums">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-3 border-t border-line space-y-1.5 text-xs">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Delivery</span>
            <span>{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-forest font-medium">
              <span>Discount</span>
              <span className="tabular-nums">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-line flex justify-between items-baseline font-semibold text-ink">
            <span className="text-sm">Total</span>
            <span className="text-base tabular-nums">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Two Buttons per Section 6 */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            Track Order
          </Button>
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccessPage;
