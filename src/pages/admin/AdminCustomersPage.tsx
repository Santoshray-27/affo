import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppStoreContext';
import { Customer } from '../../types';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Search, MapPin, ShoppingBag } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { customers, orders } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Compute orders & total spend per customer
  const customerStats = useMemo(() => {
    const stats = new Map<string, { count: number; spend: number }>();
    orders.forEach((o) => {
      if (o.orderStatus !== 'Cancelled') {
        const cur = stats.get(o.customerId) || { count: 0, spend: 0 };
        cur.count += 1;
        cur.spend += o.total;
        stats.set(o.customerId, cur);
      }
    });
    return stats;
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.mobile.includes(q);
      }
      return true;
    });
  }, [customers, searchQuery]);

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Customer Directory
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            {customers.length} registered households across Delhi NCR
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-card border border-line p-3 sm:p-4 flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or mobile..."
            className="w-full bg-cream/50 border border-line rounded-[10px] pl-9 pr-3 py-1.5 text-xs text-ink focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF8] border-b border-line text-muted font-mono uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 font-normal">Customer</th>
                <th className="p-3.5 font-normal">Mobile</th>
                <th className="p-3.5 font-normal">Email</th>
                <th className="p-3.5 font-normal">Orders</th>
                <th className="p-3.5 font-normal">Total Spend</th>
                <th className="p-3.5 font-normal">Wallet Balance</th>
                <th className="p-3.5 font-normal">Joined</th>
                <th className="p-3.5 text-right font-normal">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {filteredCustomers.map((c) => {
                const stat = customerStats.get(c.id) || { count: 0, spend: 0 };

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-[#FBFBF9] cursor-pointer transition-colors h-[52px]"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-cream text-forest font-mono font-medium text-xs flex items-center justify-center shrink-0 border border-line">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-ink block">{c.name}</span>
                          <span className="text-[10px] text-muted font-mono">{c.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-muted text-[11px]">{c.mobile}</td>
                    <td className="p-3.5 text-muted">{c.email || '—'}</td>

                    <td className="p-3.5 font-mono text-ink tabular-nums">
                      {stat.count}
                    </td>

                    <td className="p-3.5 font-mono font-medium text-ink tabular-nums">
                      {formatCurrency(stat.spend)}
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono text-ink tabular-nums">
                        {formatCurrency(c.walletBalance)}
                      </span>
                    </td>

                    <td className="p-3.5 text-muted text-[11px] font-mono">
                      {c.joinedAt ? formatDate(c.joinedAt) : 'Recent'}
                    </td>

                    <td className="p-3.5 text-right">
                      <span className="text-forest hover:underline text-xs font-mono">
                        View →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name}
        subtitle={`Account ID: ${selectedCustomer?.id}`}
        widthClass="max-w-md w-full"
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs text-ink">
            {/* Contact info */}
            <div className="bg-cream/40 p-4 rounded-card border border-line space-y-2 font-mono">
              <p>
                <span className="text-muted">Mobile:</span> {selectedCustomer.mobile}
              </p>
              <p>
                <span className="text-muted">Email:</span> {selectedCustomer.email || 'Not specified'}
              </p>
              <p>
                <span className="text-muted">Referral Code:</span>{' '}
                <span className="font-bold text-forest">{selectedCustomer.referralCode}</span>
              </p>
              <p>
                <span className="text-muted">Wallet Balance:</span>{' '}
                <span className="font-bold text-ink">{formatCurrency(selectedCustomer.walletBalance)}</span>
              </p>
            </div>

            {/* Addresses */}
            <div className="space-y-3">
              <h4 className="font-heading text-sm font-normal text-ink flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-forest" /> Saved Addresses ({selectedCustomer.addresses.length})
              </h4>
              <div className="space-y-2">
                {selectedCustomer.addresses.map((addr) => (
                  <div key={addr.id} className="p-3 bg-white rounded-[8px] border border-line">
                    <p className="font-semibold">{addr.name} {addr.isDefault && <span className="text-[10px] text-forest font-mono">(Default)</span>}</p>
                    <p className="text-muted mt-0.5">{addr.line}, {addr.locality}, {addr.city} – {addr.pinCode}</p>
                    <p className="text-muted font-mono text-[11px] mt-0.5">Ph: {addr.mobile}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders by this customer */}
            <div className="space-y-3">
              <h4 className="font-heading text-sm font-normal text-ink flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-forest" /> Order History ({customerOrders.length})
              </h4>
              <div className="space-y-2">
                {customerOrders.map((o) => (
                  <div key={o.id} className="p-3 bg-white rounded-[8px] border border-line flex items-center justify-between">
                    <div>
                      <p className="font-mono font-medium">{o.id}</p>
                      <p className="text-[11px] text-muted font-mono">{formatDate(o.createdAt)} • {o.orderStatus}</p>
                    </div>
                    <span className="font-mono font-medium text-ink">{formatCurrency(o.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
