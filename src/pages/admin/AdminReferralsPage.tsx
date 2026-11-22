import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppStoreContext';
import { Referral } from '../../types';
import { pricingConfig } from '../../config/pricing';
import { formatCurrency, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { Search } from 'lucide-react';

export const AdminReferralsPage: React.FC = () => {
  const { referrals } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'Pending'>('all');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const completedCount = referrals.filter((r) => r.status === 'Completed').length;
  const pendingCount = referrals.filter((r) => r.status === 'Pending').length;
  const totalRewardsIssued = referrals
    .filter((r) => r.status === 'Completed')
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const code = r.referralCode.toLowerCase();
        const referrer = (r.referrerName || '').toLowerCase();
        const referred = (r.referredCustomerName || '').toLowerCase();
        if (!code.includes(q) && !referrer.includes(q) && !referred.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [referrals, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Referrals Performance
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            Community invitations and wallet reward dispatches
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-card bg-white border border-line flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted">Total Invitations</span>
          <div className="font-heading text-2xl font-bold text-ink mt-2 tabular-nums">{referrals.length}</div>
          <span className="text-xs text-muted mt-2 font-mono">{pendingCount} pending order</span>
        </div>

        <div className="p-5 rounded-card bg-white border border-line flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted">Completed Orders</span>
          <div className="font-heading text-2xl font-bold text-forest mt-2 tabular-nums">{completedCount}</div>
          <span className="text-xs text-muted mt-2 font-mono">First orders placed</span>
        </div>

        <div className="p-5 rounded-card bg-white border border-line flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted">Rewards Issued</span>
          <div className="font-heading text-2xl font-bold text-forest mt-2 tabular-nums">
            {formatCurrency(totalRewardsIssued)}
          </div>
          <span className="text-xs text-muted mt-2 font-mono">₹{pricingConfig.referralRewardAmount} / referral</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-card border border-line p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or neighbor..."
            className="w-full bg-cream/50 border border-line rounded-[10px] pl-9 pr-3 py-1.5 text-xs text-ink focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'Completed', 'Pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-[8px] text-xs capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-forest text-white font-medium'
                  : 'bg-cream/50 text-muted hover:text-ink border border-line'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF8] border-b border-line text-muted font-mono uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 font-normal">Code</th>
                <th className="p-3.5 font-normal">Referrer</th>
                <th className="p-3.5 font-normal">Neighbor</th>
                <th className="p-3.5 font-normal">Date</th>
                <th className="p-3.5 font-normal">Status</th>
                <th className="p-3.5 font-normal">Reward</th>
                <th className="p-3.5 text-right font-normal">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {filteredReferrals.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedReferral(r)}
                  className="hover:bg-[#FBFBF9] cursor-pointer transition-colors h-[52px]"
                >
                  <td className="p-3.5 font-mono font-medium text-forest">{r.referralCode}</td>

                  <td className="p-3.5">
                    <span className="font-medium text-ink block">{r.referrerName}</span>
                    <span className="text-[10px] text-muted font-mono">{r.referrerCustomerId}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-medium text-ink block">
                      {r.referredCustomerName || 'Direct Invite'}
                    </span>
                    {r.referredCustomerId && (
                      <span className="text-[10px] text-muted font-mono">{r.referredCustomerId}</span>
                    )}
                  </td>

                  <td className="p-3.5 text-muted text-[11px] font-mono">{formatDate(r.createdAt)}</td>

                  <td className="p-3.5">
                    <StatusBadge
                      status={r.status === 'Completed' ? 'Delivered' : 'Pending'}
                      size="sm"
                    />
                  </td>

                  <td className="p-3.5 font-mono font-medium text-forest tabular-nums">
                    {r.status === 'Completed' ? `+${formatCurrency(r.rewardAmount)}` : '—'}
                  </td>

                  <td className="p-3.5 text-right">
                    <span className="text-forest hover:underline text-xs font-mono">
                      Inspect →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Record Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedReferral)}
        onClose={() => setSelectedReferral(null)}
        title="Referral Record"
        subtitle={`ID: ${selectedReferral?.id}`}
      >
        {selectedReferral && (
          <div className="space-y-4 text-xs text-ink font-mono">
            <div className="bg-cream/40 p-4 rounded-card border border-line space-y-2">
              <p>
                <span className="text-muted">Invite Code:</span>{' '}
                <span className="font-bold text-forest">{selectedReferral.referralCode}</span>
              </p>
              <p>
                <span className="text-muted">Referrer:</span> {selectedReferral.referrerName} ({selectedReferral.referrerCustomerId})
              </p>
              <p>
                <span className="text-muted">Neighbor:</span> {selectedReferral.referredCustomerName}
              </p>
              <p>
                <span className="text-muted">Status:</span> {selectedReferral.status}
              </p>
              <p>
                <span className="text-muted">Reward:</span> {formatCurrency(selectedReferral.rewardAmount)}
              </p>
              <p>
                <span className="text-muted">Created:</span> {formatDate(selectedReferral.createdAt)}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
