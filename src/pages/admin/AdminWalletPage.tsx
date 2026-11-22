import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppStoreContext';
import { WalletTransactionType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Search, Plus } from 'lucide-react';

export const AdminWalletPage: React.FC = () => {
  const { walletTransactions, customers, dispatch } = useAppStore();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | WalletTransactionType>('all');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Adjustment form state
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState('Customer courtesy adjustment');

  const customerMap = useMemo(() => {
    const map = new Map<string, string>();
    customers.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [customers]);

  const filteredTransactions = useMemo(() => {
    return walletTransactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cName = (customerMap.get(tx.customerId) || '').toLowerCase();
        const desc = tx.description.toLowerCase();
        if (!cName.includes(q) && !desc.includes(q) && !tx.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [walletTransactions, typeFilter, searchQuery, customerMap]);

  const handleApplyAdjustment = () => {
    if (!selectedCustomerId || adjustAmount <= 0) return;

    dispatch({
      type: 'ADD_WALLET_ADJUSTMENT',
      payload: {
        customerId: selectedCustomerId,
        amount: adjustAmount,
        type: adjustType,
        reason: adjustReason,
      },
    });

    const cName = customerMap.get(selectedCustomerId) || 'Customer';
    toast.success(
      'Wallet Adjustment Posted',
      `${adjustType === 'credit' ? 'Credited' : 'Debited'} ${formatCurrency(adjustAmount)} for ${cName}.`
    );

    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Wallet Ledger
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            Customer balance audit log • Immediate synchronization
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdjustModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Adjustment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-card border border-line p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, description or ID..."
            className="w-full bg-cream/50 border border-line rounded-[10px] pl-9 pr-3 py-1.5 text-xs text-ink focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'credit', 'debit', 'reward', 'refund'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-[8px] text-xs capitalize shrink-0 transition-colors ${
                typeFilter === t
                  ? 'bg-forest text-white font-medium'
                  : 'bg-cream/50 text-muted hover:text-ink border border-line'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF8] border-b border-line text-muted font-mono uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 font-normal">Transaction ID</th>
                <th className="p-3.5 font-normal">Customer</th>
                <th className="p-3.5 font-normal">Type</th>
                <th className="p-3.5 font-normal">Description</th>
                <th className="p-3.5 font-normal">Date &amp; Time</th>
                <th className="p-3.5 text-right font-normal">Amount Delta</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {filteredTransactions.map((tx) => {
                const isCredit = tx.type === 'credit' || tx.type === 'reward' || tx.type === 'refund';
                const cName = customerMap.get(tx.customerId) || tx.customerId;

                return (
                  <tr key={tx.id} className="hover:bg-[#FBFBF9] transition-colors h-[52px]">
                    <td className="p-3.5 font-mono text-muted text-[11px]">{tx.id}</td>

                    <td className="p-3.5">
                      <span className="font-medium text-ink block">{cName}</span>
                      <span className="text-[10px] text-muted font-mono">{tx.customerId}</span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                          isCredit
                            ? 'bg-mint/30 text-forest border-forest/20'
                            : 'bg-cream text-muted border-line'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>

                    <td className="p-3.5 text-ink max-w-sm">
                      <p>{tx.description}</p>
                      {tx.referenceId && (
                        <p className="text-[10px] text-muted font-mono">Ref: {tx.referenceId}</p>
                      )}
                    </td>

                    <td className="p-3.5 text-muted text-[11px] font-mono whitespace-nowrap">
                      {formatDateTime(tx.createdAt)}
                    </td>

                    <td className="p-3.5 text-right font-mono tabular-nums">
                      <span className={`font-medium ${isCredit ? 'text-forest' : 'text-ink'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Add Manual Wallet Adjustment"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-ink block mb-1">Customer Account</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-cream/40 border border-line rounded-[10px] p-2.5 text-xs text-ink focus:outline-none focus:border-forest"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile}) — Current: ₹{c.walletBalance}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-ink block mb-1">Type</label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="w-full bg-cream/40 border border-line rounded-[10px] p-2.5 text-xs text-ink focus:outline-none focus:border-forest"
              >
                <option value="credit">Credit Balance (+)</option>
                <option value="debit">Debit Balance (-)</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-ink block mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                className="w-full bg-cream/40 border border-line rounded-[10px] px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-ink block mb-1">Reason</label>
            <input
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g. Returnable crate deposit refund, goodwill credit..."
              className="w-full bg-cream/40 border border-line rounded-[10px] px-3 py-2 text-xs text-ink focus:outline-none focus:border-forest"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyAdjustment}>
              Post Adjustment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
