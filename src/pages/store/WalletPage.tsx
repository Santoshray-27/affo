import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { WalletTransactionType } from '../../types';
import {
  Plus,
  ChevronRight,
  Info,
} from 'lucide-react';

const AnimatedBalance: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => formatCurrency(Math.round(current)));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const WalletPage: React.FC = () => {
  const { currentCustomer, walletTransactions } = useAppStore();

  const [typeFilter, setTypeFilter] = useState<'all' | WalletTransactionType>('all');
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  const customerTxs = walletTransactions.filter(
    (tx) => tx.customerId === currentCustomer.id
  );

  const filteredTxs = customerTxs.filter((tx) => {
    if (typeFilter === 'all') return true;
    return tx.type === typeFilter;
  });

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
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
          <span className="font-semibold text-ink">Wallet</span>
        </nav>
        <h1 className="font-heading text-3xl font-medium text-ink">
          Annapurna Wallet
        </h1>
        <p className="text-xs text-muted mt-1">
          Stored balance and ledger transactions
        </p>
      </div>

      {/* Balance Card per Section 6 (One balance card: large number, quiet background mint) */}
      <div className="bg-mint rounded-card p-6 sm:p-8 border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Available Balance
          </span>
          <div className="font-heading text-4xl sm:text-5xl font-semibold text-ink tabular-nums tracking-tight">
            <AnimatedBalance value={currentCustomer.walletBalance} />
          </div>
          <p className="text-xs text-muted pt-1">
            Deducted automatically at morning checkout when selected.
          </p>
        </div>

        <div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTopupModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add money
          </Button>
        </div>
      </div>

      {/* Transactions Clean Table per Section 6 */}
      <div className="bg-white rounded-card border border-line p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-line">
          <h2 className="font-heading text-base font-medium text-ink">
            Transactions ({customerTxs.length})
          </h2>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(['all', 'credit', 'debit', 'reward', 'refund'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0 transition-colors ${
                  typeFilter === t
                    ? 'bg-forest text-white'
                    : 'bg-cream text-ink border border-line hover:border-forest'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filteredTxs.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="You don't have any ledger transactions matching this filter."
          />
        ) : (
          <div className="divide-y divide-line">
            {filteredTxs.map((tx) => {
              const isCredit = tx.type === 'credit' || tx.type === 'reward' || tx.type === 'refund';

              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-medium text-ink">{tx.description}</p>
                    <p className="text-[11px] text-muted mt-0.5">{formatDateTime(tx.createdAt)}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-semibold tabular-nums text-sm block ${
                        isCredit ? 'text-forest' : 'text-ink'
                      }`}
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted">
                      {tx.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Topup Modal per Section 9 */}
      <Modal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        title="Wallet Top-Up"
        maxWidth="sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 rounded-[8px] bg-cream flex items-center justify-center text-forest mx-auto border border-line">
            <Info className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-heading font-medium text-base text-ink">
              Top-up policy
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Wallet top-up rules to be confirmed. Demo only.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => setIsTopupModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default WalletPage;
