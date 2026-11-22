import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import {
  Plus,
  ArrowRight,
  Boxes,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    orders,
    products,
    customers,
    lowStockProducts,
    pendingOrdersCount,
    totalRevenue,
  } = useAppStore();

  const recentOrders = orders.slice(0, 6);

  // Derive mock sales trend by day for Recharts
  const salesTrendData = [
    { day: 'Mon', sales: 1850 },
    { day: 'Tue', sales: 2400 },
    { day: 'Wed', sales: 1950 },
    { day: 'Thu', sales: 3200 },
    { day: 'Fri', sales: 4100 },
    { day: 'Sat', sales: 5300 },
    { day: 'Today', sales: totalRevenue },
  ];

  // Best selling products derived
  const productSalesMap = new Map<string, { name: string; qty: number; revenue: number }>();
  orders.forEach((o) => {
    if (o.orderStatus !== 'Cancelled') {
      o.items.forEach((it) => {
        const cur = productSalesMap.get(it.productId) || { name: it.name, qty: 0, revenue: 0 };
        cur.qty += it.quantity;
        cur.revenue += it.price * it.quantity;
        productSalesMap.set(it.productId, cur);
      });
    }
  });

  const bestSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const metrics = [
    {
      label: 'Gross Sales',
      value: formatCurrency(totalRevenue),
      subtext: `${orders.filter((o) => o.orderStatus !== 'Cancelled').length} completed orders`,
      link: '/admin/analytics',
    },
    {
      label: 'Orders Queue',
      value: orders.length.toString(),
      subtext: `${orders.filter((o) => o.orderStatus === 'Delivered').length} fulfilled`,
      link: '/admin/orders',
    },
    {
      label: 'Pending Packing',
      value: pendingOrdersCount.toString(),
      subtext: pendingOrdersCount > 0 ? 'Requires attention' : 'All clear',
      link: '/admin/orders?status=Pending',
      highlight: pendingOrdersCount > 0,
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockProducts.length.toString(),
      subtext: lowStockProducts.length > 0 ? `${lowStockProducts.length} below 10 units` : 'Healthy levels',
      link: '/admin/inventory',
      highlight: lowStockProducts.length > 0,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Operations Overview
          </h2>
          <p className="text-xs text-muted mt-0.5 font-mono">
            Morning dispatch status and catalog inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/inventory')}
            icon={<Boxes className="w-3.5 h-3.5" />}
          >
            Inventory
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/products/new')}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Produce
          </Button>
        </div>
      </div>

      {/* 1. Metric Cards Grid (Row of 4 Compact Cards, No colorful icon circles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Link
            key={idx}
            to={m.link}
            className="p-5 rounded-card bg-white border border-line hover:border-forest/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                {m.label}
              </span>
              <div className="text-2xl font-bold font-sans text-ink tabular-nums mt-1">
                {m.value}
              </div>
            </div>
            <div className={`text-xs mt-3 ${m.highlight ? 'text-forest font-medium' : 'text-muted'}`}>
              {m.subtext}
            </div>
          </Link>
        ))}
      </div>

      {/* 2. Charts (2/3) & Best Selling Section (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recharts Sales Trend Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <h3 className="font-heading text-base font-normal text-ink">
                Weekly Revenue Run Rate
              </h3>
              <p className="text-xs text-muted font-mono mt-0.5">
                Past 7 days simulated revenue
              </p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs font-mono text-forest hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14612A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#14612A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEFE7" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7A6F', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7A6F', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #DDE6D6',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#14612A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Produce */}
        <div className="lg:col-span-4 bg-white rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-heading text-base font-normal text-ink">
              Top Produce
            </h3>
            <span className="text-[11px] font-mono text-muted">By Quantity</span>
          </div>

          <div className="divide-y divide-line">
            {bestSellingProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2.5">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="w-5 h-5 rounded-[6px] bg-cream text-muted font-mono text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="font-medium text-ink truncate">{p.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-ink tabular-nums">{p.qty} packs</span>
                  <span className="text-[10px] text-muted block font-mono">{formatCurrency(p.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Queue */}
        <div className="lg:col-span-8 bg-white rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <h3 className="font-heading text-base font-normal text-ink">
                Recent Orders
              </h3>
              <p className="text-xs text-muted font-mono mt-0.5">
                Fulfillment queue
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-mono text-forest hover:underline flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted font-mono uppercase text-[10px]">
                  <th className="pb-2.5 font-normal">Order</th>
                  <th className="pb-2.5 font-normal">Customer</th>
                  <th className="pb-2.5 font-normal">Items</th>
                  <th className="pb-2.5 font-normal">Total</th>
                  <th className="pb-2.5 font-normal">Status</th>
                  <th className="pb-2.5 text-right font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    className="hover:bg-[#FBFBF9] cursor-pointer transition-colors h-[52px]"
                  >
                    <td className="font-mono font-medium text-ink">{o.id}</td>
                    <td>
                      <div className="font-medium text-ink">{o.customerName}</div>
                      <div className="text-[11px] text-muted font-mono">{o.customerMobile}</div>
                    </td>
                    <td className="text-muted font-mono">{o.items.length}</td>
                    <td className="font-mono font-medium text-ink">{formatCurrency(o.total)}</td>
                    <td>
                      <StatusBadge status={o.orderStatus} size="sm" />
                    </td>
                    <td className="text-right">
                      <span className="text-forest hover:underline text-xs font-mono">
                        Open →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-heading text-base font-normal text-ink">
              Low Stock Alerts
            </h3>
            <Link
              to="/admin/inventory"
              className="text-xs font-mono text-forest hover:underline"
            >
              Inventory →
            </Link>
          </div>

          <div className="divide-y divide-line">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-muted text-center py-6">All produce items above stock threshold.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-ink truncate">{p.name}</p>
                    <p className="text-[11px] text-muted font-mono">{p.unitLabel}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-red tabular-nums">{p.stockQuantity} left</span>
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="block text-[11px] text-forest underline font-mono mt-0.5"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
