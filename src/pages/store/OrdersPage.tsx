import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { OrderStatus } from '../../types';
import {
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, currentCustomer } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const customerOrders = orders.filter((o) => o.customerId === currentCustomer.id);

  const filteredOrders = useMemo(() => {
    return customerOrders.filter((order) => {
      if (statusFilter !== 'All' && order.orderStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchId = order.id.toLowerCase().includes(query);
        const matchItem = order.items.some((i) => i.name.toLowerCase().includes(query));
        if (!matchId && !matchItem) return false;
      }
      return true;
    });
  }, [customerOrders, statusFilter, searchQuery]);

  const filterTabs: Array<'All' | OrderStatus> = [
    'All',
    'Pending',
    'Processing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6 pb-20">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-2">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/account" className="hover:text-forest transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-ink">Orders</span>
        </nav>
        <h1 className="font-heading text-3xl font-medium text-ink">
          Order history ({customerOrders.length})
        </h1>
      </div>

      {/* Filter Tabs Above per Section 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? customerOrders.length
                : customerOrders.filter((o) => o.orderStatus === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                  statusFilter === tab
                    ? 'bg-forest text-white'
                    : 'bg-white text-ink border border-line hover:border-forest'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order ID or item..."
          className="bg-white border border-line rounded-[10px] px-3.5 py-1.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-forest w-full sm:w-64"
        />
      </div>

      {/* Orders as Table-Like Rows per Section 6 (date, ID, items thumbnails, total, status badge, "View") */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            searchQuery || statusFilter !== 'All'
              ? 'No orders matched your current search or filter.'
              : "You haven't placed any harvest orders yet."
          }
          actionLabel="Browse Produce"
          onAction={() => navigate('/shop')}
        />
      ) : (
        <div className="bg-white rounded-card border border-line divide-y divide-line overflow-hidden">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
            >
              {/* Left: ID & Date */}
              <div className="min-w-[140px]">
                <span className="font-mono text-xs font-semibold text-ink block">
                  {order.id}
                </span>
                <span className="text-[11px] text-muted block mt-0.5">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>

              {/* Middle: Items Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 flex-1 min-w-0 px-0 sm:px-4">
                {order.items.slice(0, 4).map((it, idx) => (
                  <img
                    key={idx}
                    src={it.image}
                    alt={it.name}
                    title={`${it.name} (${it.quantity}x)`}
                    className="w-10 h-10 rounded-[6px] object-cover bg-cream border border-line shrink-0"
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="text-[11px] text-muted font-medium px-2 py-1 bg-cream rounded-[6px] border border-line shrink-0">
                    +{order.items.length - 4} more
                  </span>
                )}
              </div>

              {/* Right: Total, Status Badge, View Action */}
              <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-ink tabular-nums text-sm">
                    {formatCurrency(order.total)}
                  </div>
                  <div className="text-[11px] text-muted">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <StatusBadge status={order.orderStatus} />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  icon={<ArrowRight className="w-3 h-3" />}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default OrdersPage;
