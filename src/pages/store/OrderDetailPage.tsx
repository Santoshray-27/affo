import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { OrderStatus } from '../../types';
import { businessInfo } from '../../config/business';
import {
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  Check,
  FileText,
  RotateCcw,
  HelpCircle,
  XCircle,
  Phone,
  Mail,
} from 'lucide-react';

const ORDER_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Out for Delivery',
  'Delivered',
];

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder, addToCart } = useAppStore();
  const toast = useToast();

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);

  const order = getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Order not found"
          description={`No recorded order found with reference "${orderId}".`}
          actionLabel="View All Orders"
          onAction={() => navigate('/orders')}
        />
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.productId, item.quantity);
    });
    toast.success('Items added to basket', 'Items re-added to your basket.');
    navigate('/cart');
  };

  const handleDownloadInvoice = () => {
    toast.info('Invoice generated', `Invoice for ${order.id} downloaded.`);
  };

  const handleConfirmCancel = () => {
    cancelOrder(order.id, 'Customer cancelled through customer portal');
    setIsCancelConfirmOpen(false);
    toast.success('Order cancelled', 'Reserved produce returned to inventory.');
  };

  const paymentMethodLabel =
    order.paymentMethod === 'upi'
      ? 'UPI'
      : order.paymentMethod === 'card_netbanking'
      ? 'Card / NetBanking'
      : order.paymentMethod === 'wallet'
      ? 'Annapurna Wallet'
      : 'Cash on Delivery';

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Breadcrumb */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-2">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/orders" className="hover:text-forest transition-colors">
            Orders
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-ink font-mono">{order.id}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink">
                Order {order.id}
              </h1>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-muted mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadInvoice}
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHelpDrawerOpen(true)}
              icon={<HelpCircle className="w-3.5 h-3.5" />}
            >
              Help
            </Button>
          </div>
        </div>
      </div>

      {/* Order Tracking: Horizontal Timeline (Desktop) / Vertical (Mobile) per Section 6 */}
      <section className="bg-white rounded-card border border-line p-6 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Order fulfillment timeline
        </h2>

        {isCancelled ? (
          <div className="p-4 bg-red/10 rounded-[10px] border border-red/20 text-xs text-red">
            <span className="font-semibold block">Order Cancelled</span>
            <p className="mt-0.5 text-ink/70">
              This order was cancelled and inventory was restocked.
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Horizontal Timeline */}
            <div className="hidden sm:flex items-center justify-between relative pt-3 pb-2">
              {/* Connecting Background Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-line -translate-y-1/2 z-0" />
              {/* Active Progress Line */}
              <div
                className="absolute top-6 left-6 h-0.5 bg-forest -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`,
                }}
              />

              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-forest text-white ring-4 ring-forest/15'
                          : isPassed
                          ? 'bg-forest text-white'
                          : 'bg-white border-2 border-line text-muted'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3 stroke-[2.5]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium ${
                        isCurrent ? 'text-forest font-semibold' : isPassed ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="sm:hidden space-y-4 pt-2">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                        isCurrent
                          ? 'bg-forest text-white ring-2 ring-forest/20'
                          : isPassed
                          ? 'bg-forest text-white'
                          : 'bg-white border border-line text-muted'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs ${
                        isCurrent ? 'text-forest font-semibold' : isPassed ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Main Order Details: Left Items + Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-card border border-line p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-ink pb-3 border-b border-line">
              Items in this harvest ({order.items.length})
            </h3>

            <div className="divide-y divide-line">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 rounded-[6px] object-cover bg-cream border border-line shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-ink block truncate">{item.name}</span>
                      <p className="text-muted text-[11px] mt-0.5">{item.unitLabel}</p>
                      <p className="text-muted text-[11px]">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-ink tabular-nums shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white rounded-card border border-line p-5 space-y-2">
              <span className="font-semibold uppercase tracking-wider text-muted text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-forest" /> Delivery destination
              </span>
              <p className="font-semibold text-ink">{order.deliveryAddress.name}</p>
              <p className="text-muted leading-relaxed">
                {order.deliveryAddress.line}, {order.deliveryAddress.locality}
                <br />
                {order.deliveryAddress.city} – {order.deliveryAddress.pinCode}
              </p>
              <p className="text-muted text-[11px] pt-1">Phone: {order.deliveryAddress.mobile}</p>
            </div>

            <div className="bg-white rounded-card border border-line p-5 space-y-2">
              <span className="font-semibold uppercase tracking-wider text-muted text-[11px] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-forest" /> Payment details
              </span>
              <p className="font-semibold text-ink">{paymentMethodLabel}</p>
              <p className="text-muted">Payment status: {order.paymentStatus}</p>
              <p className="text-muted text-[11px] pt-1">
                Scheduled slot: {order.deliverySlot || 'Morning 6:00 AM – 9:00 AM'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Summary Card & Actions */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-card border border-line p-5 space-y-4">
            <h3 className="font-heading text-base font-medium text-ink pb-2 border-b border-line">
              Price breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Items subtotal</span>
                <span className="tabular-nums font-semibold text-ink">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery charge</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-line flex justify-between items-baseline font-semibold text-ink">
                <span className="text-sm">Total paid</span>
                <span className="text-base tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-line space-y-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleReorder}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Reorder harvest
              </Button>

              {canCancel && (
                <Button
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={() => setIsCancelConfirmOpen(true)}
                  icon={<XCircle className="w-4 h-4" />}
                >
                  Cancel order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Harvest Order?"
        description="Are you sure you want to cancel this order? Produce reserved in today's harvest batch will be restocked to inventory."
        confirmText="Yes, cancel order"
        cancelText="Keep order"
        isDestructive={true}
      />

      {/* Help Drawer */}
      <Drawer
        isOpen={isHelpDrawerOpen}
        onClose={() => setIsHelpDrawerOpen(false)}
        title="Need help with this order?"
        subtitle={`Reference: ${order.id}`}
      >
        <div className="space-y-4 text-xs text-ink">
          <div className="p-4 bg-cream rounded-[10px] border border-line space-y-2">
            <p className="font-semibold text-ink">Farm Dispatch Helpline</p>
            <p className="text-muted leading-relaxed">
              If you need to change your morning delivery instructions or report an item issue, reach out to customer care.
            </p>
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-forest" />
                <span>{businessInfo.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-forest" />
                <span>{businessInfo.supportEmail}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => {
              setIsHelpDrawerOpen(false);
              toast.info('Support ticket opened', `Support team notified regarding ${order.id}.`);
            }}
          >
            Report an issue with this delivery
          </Button>
        </div>
      </Drawer>
    </div>
  );
};
export default OrderDetailPage;
