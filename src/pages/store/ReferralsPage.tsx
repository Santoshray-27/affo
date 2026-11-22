import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { pricingConfig } from '../../config/pricing';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Copy,
  Share2,
  ChevronRight,
  UserPlus,
  Users,
  Wallet,
  ArrowRight,
} from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const { currentCustomer, referrals, dispatch } = useAppStore();
  const toast = useToast();

  const [friendNameInput, setFriendNameInput] = useState('');

  // Customer's referrals
  const customerReferrals = referrals.filter(
    (r) => r.referrerCustomerId === currentCustomer.id
  );

  const completedCount = customerReferrals.filter((r) => r.status === 'Completed').length;
  const pendingCount = customerReferrals.filter((r) => r.status === 'Pending').length;
  const totalEarned = customerReferrals
    .filter((r) => r.status === 'Completed')
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCustomer.referralCode);
    toast.success('Referral Code Copied', `Code ${currentCustomer.referralCode} ready to paste.`);
  };

  const handleShare = () => {
    const text = `Join Annapurna Farm Fresh & Organics using my invite code ${currentCustomer.referralCode} and get ₹${pricingConfig.referredRewardAmount} bonus in your wallet!`;
    if (navigator.share) {
      navigator.share({
        title: 'Annapurna Farm Fresh Invite',
        text,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.info('Share message copied to clipboard');
    }
  };

  const handleSimulateFriend = () => {
    const name = friendNameInput.trim() || undefined;
    dispatch({
      type: 'SIMULATE_FRIEND_REFERRAL',
      payload: { friendName: name },
    });
    setFriendNameInput('');
    toast.success(
      'Friend Joined & Ordered',
      `Simulated referral order complete. ₹${pricingConfig.referralRewardAmount} credited to your Annapurna wallet.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Breadcrumbs & Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-2 font-mono">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <Link to="/account" className="hover:text-forest transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <span className="font-semibold text-ink">Refer &amp; Earn</span>
        </nav>
        <h1 className="font-heading text-3xl sm:text-4xl font-normal text-ink">
          Share Clean Produce
        </h1>
        <p className="text-sm text-muted mt-1">
          Invite friends to Annapurna. Give ₹{pricingConfig.referredRewardAmount} on their first harvest order, earn ₹{pricingConfig.referralRewardAmount} in your wallet.
        </p>
      </div>

      {/* Hero Share Card */}
      <div className="bg-white rounded-card border border-line p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-muted">
              Your Referral Code
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-5 py-3 rounded-[10px] bg-cream border border-line font-mono text-xl font-bold text-forest tracking-wider select-all">
                {currentCustomer.referralCode}
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleCopyCode}
                icon={<Copy className="w-4 h-4" />}
              >
                Copy Code
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleShare}
                icon={<Share2 className="w-4 h-4" />}
              >
                Share Link
              </Button>
            </div>
            <p className="text-xs text-muted">
              Friends get ₹{pricingConfig.referredRewardAmount} welcome credit applied automatically at checkout when using your code.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3 p-4 bg-cream/50 rounded-card border border-line/60 text-center">
            <div className="p-3 bg-white rounded-[10px] border border-line/60">
              <p className="font-heading text-2xl font-bold text-forest tabular-nums">
                {formatCurrency(totalEarned)}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted mt-0.5">
                Earned to Wallet
              </p>
            </div>
            <div className="p-3 bg-white rounded-[10px] border border-line/60">
              <p className="font-heading text-2xl font-bold text-ink tabular-nums">
                {completedCount}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted mt-0.5">
                Friends Joined
              </p>
            </div>
          </div>
        </div>

        {/* 3 Steps Row */}
        <div className="pt-6 border-t border-line grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="w-7 h-7 rounded-full bg-forest text-white text-xs font-mono font-semibold flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="text-sm font-semibold text-ink">Share your code</h4>
            <p className="text-xs text-muted leading-relaxed">
              Send your personal invite code to friends, family, or neighbors via WhatsApp or link.
            </p>
          </div>
          <div className="space-y-1">
            <div className="w-7 h-7 rounded-full bg-forest text-white text-xs font-mono font-semibold flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="text-sm font-semibold text-ink">They place an order</h4>
            <p className="text-xs text-muted leading-relaxed">
              They receive ₹{pricingConfig.referredRewardAmount} off their inaugural farm harvest basket.
            </p>
          </div>
          <div className="space-y-1">
            <div className="w-7 h-7 rounded-full bg-forest text-white text-xs font-mono font-semibold flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="text-sm font-semibold text-ink">You receive credit</h4>
            <p className="text-xs text-muted leading-relaxed">
              ₹{pricingConfig.referralRewardAmount} is credited instantly to your Annapurna wallet upon delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Card (Discreet testing tool) */}
      <div className="bg-cream/40 rounded-card border border-line p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-forest">
            Demo Simulator
          </h4>
          <p className="text-xs text-muted mt-0.5">
            Simulate a friend joining with your code to test wallet credits and admin updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={friendNameInput}
            onChange={(e) => setFriendNameInput(e.target.value)}
            placeholder="Friend name (optional)"
            className="w-44 bg-white border border-line rounded-[10px] px-3 py-2 text-xs text-ink focus:outline-none focus:border-forest"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateFriend}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Simulate Join
          </Button>
        </div>
      </div>

      {/* Referral Activity Table */}
      <div className="bg-white rounded-card border border-line p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-normal text-ink">
            Referral Activity
          </h3>
          <span className="text-xs font-mono text-muted">
            {customerReferrals.length} {customerReferrals.length === 1 ? 'invite' : 'invites'}
          </span>
        </div>

        {customerReferrals.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <p className="text-sm">No referrals yet.</p>
            <p className="text-xs text-muted/80 mt-1">
              Share your code above or use the simulator to test rewards.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {customerReferrals.map((ref) => (
              <div key={ref.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-ink text-sm">
                    {ref.referredCustomerName || 'New Neighbor'}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Invited {formatDate(ref.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-forest font-mono text-sm">
                    +{formatCurrency(ref.rewardAmount)}
                  </span>
                  <StatusBadge
                    status={ref.status === 'Completed' ? 'Delivered' : 'Pending'}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
