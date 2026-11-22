import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { OrderStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const ORDER_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Out for Delivery',
  'Delivered',
];

export const AdminOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, cancelOrder } = useAppStore();
  const toast = useToast();

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const order = getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="py-12 text-center">
        <EmptyState
          title="Order Not Found"
          description={`No recorded order found with reference "${orderId}".`}
          actionLabel="Return to Orders Queue"
          onAction={() => navigate('/admin/orders')}
        />
      </div>
    );
  }

  const currentFlowIdx = ORDER_FLOW.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const isDelivered = order.orderStatus === 'Delivered';

  const handleAdvanceStatus = (nextStatus: OrderStatus) => {
    updateOrderStatus(order.id, nextStatus, internalNoteInput || order.internalNote);
    toast.success(
      `Status Advanced to "${nextStatus}"`,
      `Customer tracking at /orders/${order.id} is now updated immediately.`
    );
  };

  const handleSaveInternalNote = () => {
    updateOrderStatus(order.id, order.orderStatus, internalNoteInput);
    toast.success('Internal Note Saved');
  };

  const handleConfirmCancel = () => {
    cancelOrder(order.id, 'Cancelled by store owner from admin portal');
    setIsCancelConfirmOpen(false);
    toast.info('Order Cancelled', 'Produce items restocked to inventory.');
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-xs font-mono text-muted hover:text-forest flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-normal text-ink font-mono">
              {order.id}
            </h2>
            <StatusBadge status={order.orderStatus} size="sm" />
          </div>
          <p className="text-xs text-muted font-mono mt-0.5">
            Placed {formatDateTime(order.createdAt)} • Slot: {order.deliverySlot || 'Morning 6–9 AM'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/orders/${order.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white border border-line text-xs font-mono text-ink hover:bg-cream transition-colors"
            title="Inspect how customer sees this order"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3 h-3 text-muted" />
          </Link>

          {!isCancelled && !isDelivered && (
            <Button
              variant="outline"
              size="sm"
              className="text-red hover:bg-red/5 hover:border-red"
              onClick={() => setIsCancelConfirmOpen(true)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Fulfillment Stage Control */}
      <div className="bg-white rounded-card border border-line p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <h3 className="font-heading text-base font-normal text-ink">
            Fulfillment Stage
          </h3>
          <span className="text-[11px] font-mono text-muted">
            Click any step to update live state
          </span>
        </div>

        {isCancelled ? (
          <div className="p-3.5 bg-red/5 rounded-[8px] border border-red/20 text-xs text-red font-mono">
            Order Status: Cancelled. Produce quantities have been returned to stock.
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {ORDER_FLOW.map((statusStep, idx) => {
              const isCompleted = currentFlowIdx >= idx;
              const isCurrent = currentFlowIdx === idx;

              return (
                <button
                  key={statusStep}
                  onClick={() => handleAdvanceStatus(statusStep)}
                  className={`px-3.5 py-2 rounded-[8px] text-xs font-medium transition-colors flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-forest text-white'
                      : isCompleted
                      ? 'bg-cream text-forest border border-line'
                      : 'bg-white text-muted hover:text-ink border border-line/60'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="font-mono">{idx + 1}</span>}
                  <span>{statusStep}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Items + Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Items in Order */}
        <div className="lg:col-span-8 bg-white rounded-card border border-line p-6 space-y-4">
          <h3 className="font-heading text-base font-normal text-ink pb-2 border-b border-line">
            Harvest Items ({order.items.length})
          </h3>

          <div className="divide-y divide-line">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-10 h-10 rounded-[6px] object-cover bg-cream border border-line"
                  />
                  <div>
                    <h5 className="font-medium text-ink">{it.name}</h5>
                    <p className="text-[11px] text-muted font-mono">{it.productId}</p>
                    <p className="text-muted font-mono text-[11px]">
                      {it.unitLabel} • {it.quantity} × {formatCurrency(it.price)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-medium text-ink">
                    {formatCurrency(it.price * it.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-line space-y-1.5 text-xs text-muted max-w-xs ml-auto font-mono">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-ink">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-forest">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-line">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="text-[11px] text-muted pt-1">
              Method: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
            </div>
          </div>
        </div>

        {/* Right: Customer & Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer & Address */}
          <div className="bg-white rounded-card border border-line p-5 space-y-3 text-xs">
            <h4 className="font-heading text-sm font-normal text-ink pb-2 border-b border-line">
              Customer &amp; Destination
            </h4>

            <div className="space-y-0.5">
              <p className="font-semibold text-ink">{order.customerName}</p>
              <p className="font-mono text-muted text-[11px]">Ph: {order.customerMobile}</p>
            </div>

            <div className="pt-2 border-t border-line space-y-1 text-muted">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
                Delivery Address:
              </span>
              <p className="text-ink">{order.deliveryAddress.line}</p>
              <p>
                {order.deliveryAddress.locality}, {order.deliveryAddress.city} – {order.deliveryAddress.pinCode}
              </p>
              {order.deliveryAddress.deliveryNote && (
                <p className="text-[11px] text-muted italic pt-1">
                  Note: {order.deliveryAddress.deliveryNote}
                </p>
              )}
            </div>
          </div>

          {/* Internal Dispatch Note */}
          <div className="bg-white rounded-card border border-line p-5 space-y-3 text-xs">
            <h4 className="font-heading text-sm font-normal text-ink">
              Internal Dispatch Notes
            </h4>
            {order.internalNote && (
              <div className="p-3 bg-cream/40 rounded-[8px] border border-line text-[11px] text-muted italic">
                Current: &quot;{order.internalNote}&quot;
              </div>
            )}
            <textarea
              rows={2}
              value={internalNoteInput}
              onChange={(e) => setInternalNoteInput(e.target.value)}
              placeholder="Driver name, crate ID, delivery verification..."
              className="w-full bg-cream/40 border border-line rounded-[10px] p-2.5 text-xs text-ink focus:outline-none focus:border-forest"
            />
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleSaveInternalNote}
            >
              Save Internal Note
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel This Order?"
        description="Cancelling will immediately return all reserved produce items to inventory and update customer tracking."
        confirmText="Cancel Order"
        isDestructive={true}
      />
    </div>
  );
};
