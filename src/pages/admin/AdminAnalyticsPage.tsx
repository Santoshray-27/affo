import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../../store/AppStoreContext';
import { OrderStatus } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Download } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { orders, categories, totalRevenue } = useAppStore();
  const toast = useToast();

  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('7');

  const multiplier = dateRange === '7' ? 1 : dateRange === '30' ? 2.8 : 4.5;

  const revenueTrendData = useMemo(() => {
    return [
      { name: 'Mon', revenue: Math.round(1800 * multiplier), orders: Math.round(5 * (multiplier * 0.7)) },
      { name: 'Tue', revenue: Math.round(2300 * multiplier), orders: Math.round(6 * (multiplier * 0.7)) },
      { name: 'Wed', revenue: Math.round(1950 * multiplier), orders: Math.round(4 * (multiplier * 0.7)) },
      { name: 'Thu', revenue: Math.round(3100 * multiplier), orders: Math.round(8 * (multiplier * 0.7)) },
      { name: 'Fri', revenue: Math.round(4200 * multiplier), orders: Math.round(11 * (multiplier * 0.7)) },
      { name: 'Sat', revenue: Math.round(5400 * multiplier), orders: Math.round(14 * (multiplier * 0.7)) },
      { name: 'Sun', revenue: Math.round(totalRevenue * multiplier), orders: Math.round(orders.length * (multiplier * 0.8)) },
    ];
  }, [dateRange, totalRevenue, orders.length, multiplier]);

  // Category sales breakdown
  const categoryChartData = useMemo(() => {
    return categories.map((c, idx) => ({
      name: c.name,
      value: Math.round((1200 + idx * 450) * multiplier),
    }));
  }, [categories, multiplier]);

  // Top products by volume
  const topProductsBarData = useMemo(() => {
    return [
      { name: 'Shimla Apple', units: Math.round(24 * multiplier) },
      { name: 'Tomatoes', units: Math.round(38 * multiplier) },
      { name: 'A2 Cow Ghee', units: Math.round(12 * multiplier) },
      { name: 'Bananas', units: Math.round(45 * multiplier) },
      { name: 'Salad Greens', units: Math.round(18 * multiplier) },
    ];
  }, [multiplier]);

  // Order status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.orderStatus] !== undefined) {
        counts[o.orderStatus]++;
      }
    });
    return [
      { name: 'Delivered', count: counts.Delivered },
      { name: 'Out for Delivery', count: counts['Out for Delivery'] },
      { name: 'Processing', count: counts.Processing },
      { name: 'Confirmed', count: counts.Confirmed },
      { name: 'Pending', count: counts.Pending },
      { name: 'Cancelled', count: counts.Cancelled },
    ];
  }, [orders]);

  const FOREST_PALETTE = ['#14612A', '#3A7D44', '#6B9E5A', '#9BBF72', '#C6E08D', '#4B6B40'];

  // Export CSV of orders
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Mobile', 'Amount', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.customerMobile,
      o.total,
      o.orderStatus,
      o.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `annapurna_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Exported', 'Orders ledger downloaded successfully.');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Date Range and CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Analytics &amp; Reports
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            Real-time sales runs and category distribution
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-white rounded-[10px] p-0.5 border border-line text-xs font-mono">
            {(['7', '30', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                  dateRange === r ? 'bg-forest text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {r === '7' ? '7 Days' : r === '30' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Primary Revenue Area Chart */}
      <div className="bg-white rounded-card border border-line p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <div>
            <h3 className="font-heading text-base font-normal text-ink">
              Revenue Run Rate
            </h3>
            <p className="text-xs text-muted font-mono mt-0.5">Dispatches breakdown</p>
          </div>
          <span className="font-mono font-bold text-lg text-forest tabular-nums">
            {formatCurrency(totalRevenue * multiplier)}
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14612A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#14612A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEFE7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7A6F', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
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
                dataKey="revenue"
                stroke="#14612A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#analyticsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Grid: Category Donut + Product Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Donut Chart */}
        <div className="bg-white rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-heading text-base font-normal text-ink">
              Sales by Category
            </h3>
            <span className="text-[11px] font-mono text-muted">Distribution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={FOREST_PALETTE[index % FOREST_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Sales']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #DDE6D6',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Bar Chart */}
        <div className="bg-white rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-heading text-base font-normal text-ink">
              Volume by Produce
            </h3>
            <span className="text-[11px] font-mono text-muted">Units Sold</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEFE7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7A6F', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7A6F', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} packs`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #DDE6D6',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="units" fill="#14612A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-card border border-line p-6 space-y-4">
        <h3 className="font-heading text-base font-normal text-ink pb-2 border-b border-line">
          Fulfillment Distribution
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {statusCounts.map((st) => (
            <div key={st.name} className="p-3.5 rounded-card bg-cream/40 border border-line text-center">
              <span className="text-xs font-mono text-muted block truncate">{st.name}</span>
              <div className="text-2xl font-bold font-mono text-ink mt-1 tabular-nums">
                {st.count}
              </div>
              <span className="text-[11px] text-muted font-mono block mt-0.5">
                {orders.length > 0 ? `${Math.round((st.count / orders.length) * 100)}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
