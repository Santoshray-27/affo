import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  RotateCcw,
  Store,
  CheckCircle2,
  PackageCheck,
  Truck,
  CreditCard,
  Layers,
} from 'lucide-react';
import { useAppStore } from '../../store/AppStoreContext';
import { useToast } from '../ui/Toast';

export const DemoGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { resetDemoData } = useAppStore();
  const toast = useToast();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('annapurna:open-demo-guide', handleOpen);
    return () => window.removeEventListener('annapurna:open-demo-guide', handleOpen);
  }, []);

  const demoSteps = [
    {
      step: 1,
      title: 'Owner Lists New Product',
      desc: 'Create or edit farm items with custom prices, units, and images.',
      link: '/admin/products/new',
      linkText: 'Go to Admin > Add Product',
      icon: PackageCheck,
      badge: 'Admin',
    },
    {
      step: 2,
      title: 'Instant Customer Visibility',
      desc: 'Verify that the new product immediately shows in the customer catalog.',
      link: '/shop',
      linkText: 'Go to Customer Shop',
      icon: Store,
      badge: 'Storefront',
    },
    {
      step: 3,
      title: 'Customer Add to Cart & Checkout',
      desc: 'Select slot, simulated payment, and place order.',
      link: '/cart',
      linkText: 'Go to Cart & Checkout',
      icon: CreditCard,
      badge: 'Storefront',
    },
    {
      step: 4,
      title: 'Real-Time Order Reception',
      desc: 'The placed order instantly appears in the owner order queue.',
      link: '/admin/orders',
      linkText: 'Go to Admin > Orders',
      icon: Layers,
      badge: 'Admin',
    },
    {
      step: 5,
      title: 'Owner Updates Fulfillment Status',
      desc: 'Advance status: Confirmed -> Processing -> Out for Delivery -> Delivered.',
      link: '/admin/orders',
      linkText: 'Manage Orders',
      icon: Truck,
      badge: 'Admin',
    },
    {
      step: 6,
      title: 'Live Customer Tracking',
      desc: 'Customer opens their order and sees the synchronized timeline update.',
      link: '/orders',
      linkText: 'View Customer Orders',
      icon: CheckCircle2,
      badge: 'Storefront',
    },
  ];

  const handleReset = () => {
    resetDemoData();
    toast.success('Demo Data Reset', 'Initial catalog, seed orders and wallet transactions restored.');
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Demo Walkthrough Guide"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <p className="text-muted leading-relaxed">
          This clickable prototype runs an in-browser shared store between the Customer Storefront and Owner Admin Dashboard.
        </p>

        {/* 6 Core Walkthrough Steps */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {demoSteps.map((s) => {
            return (
              <div
                key={s.step}
                className="p-3 bg-cream rounded-[10px] border border-line flex items-start gap-3 text-xs"
              >
                <div className="w-6 h-6 rounded-[6px] bg-white text-forest font-semibold flex items-center justify-center shrink-0 mt-0.5 border border-line text-[11px]">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{s.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-[4px] font-medium ${
                        s.badge === 'Admin'
                          ? 'bg-forest text-white'
                          : 'bg-white border border-line text-ink'
                      }`}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-muted mt-0.5">{s.desc}</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate(s.link);
                    }}
                    className="mt-1 text-forest font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{s.linkText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Footer */}
        <div className="pt-3 border-t border-line flex items-center justify-between gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Demo Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
