import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { OrderStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Search } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders } = useAppStore();

  const urlStatus = (searchParams.get('status') as any) || 'all';
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>(urlStatus);
  const [searchQuery, setSearchQuery] = useState('');

  const statusList: Array<'all' | OrderStatus> = [
    'all',
    'Pending',
    'Confirmed',
    'Processing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedStatus !== 'all' && o.orderStatus !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = o.customerName?.toLowerCase().includes(q);
        const matchMobile = o.customerMobile?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchMobile) return false;
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Orders Queue
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            {orders.length} total orders recorded • Real-time fulfillment queue
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-card border border-line p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-0.5">
          {statusList.map((st) => {
            const count =
              st === 'all'
                ? orders.length
                : orders.filter((o) => o.orderStatus === st).length;

            return (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  if (st === 'all') {
                    searchParams.delete('status');
                  } else {
                    searchParams.set('status', st);
                  }
                  setSearchParams(searchParams);
                }}
                className={`px-3 py-1.5 rounded-[8px] text-xs capitalize shrink-0 transition-colors flex items-center gap-1.5 ${
                  selectedStatus === st
                    ? 'bg-forest text-white font-medium'
                    : 'bg-cream/50 text-muted hover:text-ink border border-line'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] font-mono px-1.5 rounded-full ${
                  selectedStatus === st ? 'bg-white/20 text-white' : 'bg-white text-muted border border-line/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID or phone..."
            className="w-full bg-cream/50 border border-line rounded-[10px] pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF8] border-b border-line text-muted font-mono uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 font-normal">Order</th>
                <th className="p-3.5 font-normal">Customer</th>
                <th className="p-3.5 font-normal">Items</th>
                <th className="p-3.5 font-normal">Slot</th>
                <th className="p-3.5 font-normal">Total</th>
                <th className="p-3.5 font-normal">Payment</th>
                <th className="p-3.5 font-normal">Status</th>
                <th className="p-3.5 text-right font-normal">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted">
                    No orders matching selected status or query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    className="hover:bg-[#FBFBF9] cursor-pointer transition-colors h-[52px]"
                  >
                    <td className="p-3.5">
                      <span className="font-mono font-medium text-ink block">{o.id}</span>
                      <span className="text-[11px] text-muted font-mono">{formatDateTime(o.createdAt)}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-ink">{o.customerName}</div>
                      <div className="text-[11px] text-muted font-mono">{o.customerMobile}</div>
                    </td>

                    <td className="p-3.5 text-muted">
                      <span className="font-mono text-ink">{o.items.length} items</span>
                      <span className="text-[11px] text-muted block truncate max-w-[150px]">
                        {o.items.map((i) => i.name).join(', ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-[11px] text-muted font-mono">
                      {o.deliverySlot || 'Morning 6–9 AM'}
                    </td>

                    <td className="p-3.5 font-mono font-medium text-ink tabular-nums">
                      {formatCurrency(o.total)}
                    </td>

                    <td className="p-3.5">
                      <div className="text-ink font-mono uppercase text-[11px]">
                        {o.paymentMethod}
                      </div>
                      <div className="text-[10px] text-muted font-mono">{o.paymentStatus}</div>
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={o.orderStatus} size="sm" />
                    </td>

                    <td className="p-3.5 text-right">
                      <span className="text-forest hover:underline text-xs font-mono">
                        Manage →
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
