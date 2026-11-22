import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { HelpCircle, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { businessInfo } from '../../config/business';
import { useToast } from '../ui/Toast';

export const HelpDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const handleSimulateChat = () => {
    toast.info('Support Assistant', 'Support helpline is active between 6:00 AM and 8:00 PM.');
  };

  return (
    <>
      {/* Discreet floating support trigger (Section 9: single clean button) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-6 z-30 w-11 h-11 rounded-[10px] bg-white border border-line text-forest shadow-soft flex items-center justify-center hover:bg-cream transition-colors"
        title="Customer Support"
        aria-label="Open support drawer"
      >
        <HelpCircle className="w-5 h-5 stroke-[1.5]" />
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Customer Support"
        subtitle="Assistance with produce, morning orders &amp; delivery"
      >
        <div className="space-y-6 text-xs text-ink">
          {/* Quick Contact Card */}
          <div className="bg-cream rounded-[10px] p-4 border border-line space-y-3">
            <h4 className="font-heading font-medium text-sm text-forest-deep">Customer Care Line</h4>
            <div className="space-y-2">
              <a
                href={`tel:${businessInfo.supportPhone}`}
                className="flex items-center gap-2.5 p-2.5 rounded-[8px] bg-white border border-line hover:border-forest text-ink font-medium transition-colors"
              >
                <Phone className="w-4 h-4 stroke-[1.5] text-forest" />
                <span>{businessInfo.supportPhone}</span>
              </a>
              <a
                href={`mailto:${businessInfo.supportEmail}`}
                className="flex items-center gap-2.5 p-2.5 rounded-[8px] bg-white border border-line hover:border-forest text-ink font-medium transition-colors"
              >
                <Mail className="w-4 h-4 stroke-[1.5] text-forest" />
                <span>{businessInfo.supportEmail}</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted text-[11px] pt-1">
              <Clock className="w-3.5 h-3.5 text-forest shrink-0" />
              <span>{businessInfo.operatingHours}</span>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3">
            <h4 className="font-heading font-medium text-sm text-ink">Frequently Asked Questions</h4>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-[10px] border border-line">
                <p className="font-semibold text-ink">When is my order delivered?</p>
                <p className="text-muted mt-1 leading-relaxed">
                  Morning delivery slots run from 6:00 AM to 9:00 AM across Delhi NCR.
                </p>
              </div>

              <div className="p-3 bg-white rounded-[10px] border border-line">
                <p className="font-semibold text-ink">Can I return items if unsatisfied?</p>
                <p className="text-muted mt-1 leading-relaxed">
                  Yes, reach out via the helpline or your order history within 24 hours of delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Live Chat Action */}
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={handleSimulateChat}
            icon={<MessageSquare className="w-4 h-4" />}
          >
            Message Support
          </Button>
        </div>
      </Drawer>
    </>
  );
};
