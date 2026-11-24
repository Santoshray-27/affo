import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/AppStoreContext';
import { Address, PaymentMethod } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency } from '../../lib/utils';
import { pricingConfig } from '../../config/pricing';
import {
  MapPin,
  Plus,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  ChevronRight,
  Check,
  Sun,
  Moon,
  ShieldCheck,
  Lock,
  ArrowRight,
  Edit2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit mobile number'),
  line: z.string().min(5, 'Flat / House / Building details required'),
  locality: z.string().min(3, 'Locality / Area required'),
  city: z.string().min(2, 'City required'),
  pinCode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit PIN code'),
  deliveryNote: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    detailedCart,
    currentCustomer,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    selectedDeliverySlot,
    setDeliverySlot,
    placeOrder,
    dispatch,
  } = useAppStore();
  const toast = useToast();

  // Active step flow: 1 = Address, 2 = Slot, 3 = Payment
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentCustomer.addresses[0]?.id || 'new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(
    currentCustomer.addresses.length === 0
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('user@upi');
  const [cardNumberInput, setCardNumberInput] = useState('4532 •••• •••• 8821');
  const [cardExpiryInput, setCardExpiryInput] = useState('08/28');
  const [cardCvvInput, setCardCvvInput] = useState('•••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: currentCustomer.name,
      mobile: currentCustomer.mobile,
      city: 'Gurugram',
      pinCode: '122002',
    },
  });

  const maxWalletDeduction = useWalletBalance
    ? Math.min(currentCustomer.walletBalance, cartTotal)
    : 0;
  const finalPayable = Math.max(0, cartTotal - maxWalletDeduction);

  const hasOutOfStockItems = detailedCart.some(
    (item) => item.product.stockQuantity < item.quantity
  );

  const deliverySlots = [
    {
      id: 'Morning (6 AM - 9 AM)',
      title: 'Sunrise Morning Slot',
      time: '6:00 AM – 9:00 AM',
      description: 'Plucked at dawn and dispatched in temperature-controlled crates. Placed at doorstep or handed in person.',
      icon: Sun,
      tag: 'Recommended for peak freshness',
    },
    {
      id: 'Evening (5 PM - 8 PM)',
      title: 'Evening Dinner Slot',
      time: '5:00 PM – 8:00 PM',
      description: 'Dispatched for evening dinner preparation and family meal planning.',
      icon: Moon,
      tag: 'Arrives before dinner',
    },
  ];

  const selectedAddress = currentCustomer.addresses.find((a) => a.id === selectedAddressId) || currentCustomer.addresses[0];
  const selectedSlotObj = deliverySlots.find((s) => s.id === selectedDeliverySlot) || deliverySlots[0];

  const onSubmitAddress = (data: AddressFormData) => {
    dispatch({
      type: 'ADD_CUSTOMER_ADDRESS',
      payload: {
        ...data,
        isDefault: false,
      },
    });
    setIsAddingNewAddress(false);
    toast.success('Address added');
  };

  const handlePlaceOrder = () => {
    if (detailedCart.length === 0) {
      toast.error('Basket is empty');
      navigate('/shop');
      return;
    }

    if (hasOutOfStockItems) {
      toast.error('Some items exceeded available stock. Please review basket.');
      navigate('/cart');
      return;
    }

    let deliveryAddress: Address | undefined;
    if (selectedAddressId !== 'new') {
      deliveryAddress = currentCustomer.addresses.find((a) => a.id === selectedAddressId);
    }
    if (!deliveryAddress) {
      deliveryAddress = currentCustomer.addresses[0];
    }
    if (!deliveryAddress) {
      toast.error('Delivery address required');
      setIsAddingNewAddress(true);
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const orderId = placeOrder(
          deliveryAddress!,
          paymentMethod,
          deliveryAddress?.deliveryNote,
          useWalletBalance
        );
        navigate(`/order-success/${orderId}`);
      } catch (err: any) {
        toast.error('Order error', err?.message || 'Unable to complete order.');
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  if (detailedCart.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-mint text-forest mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink">
          Your basket is empty
        </h2>
        <p className="text-sm text-muted max-w-md mx-auto">
          Explore our fresh morning harvest to add organic fruits, crisp farm vegetables, and cold-pressed juices.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-white hover:bg-forest-deep text-sm font-semibold transition-all shadow-soft"
          >
            <span>Browse fresh produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 space-y-7 pb-28">
      {/* ============================================================ */}
      {/* 1. QUIET BREADCRUMBS & HEADING                               */}
      {/* ============================================================ */}
      <div className="space-y-1">
        <nav className="flex items-center gap-1.5 text-xs text-muted">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <Link to="/cart" className="hover:text-forest transition-colors">
            Basket
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <span className="font-semibold text-ink">Checkout &amp; delivery</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              <span className="text-[11.5px] font-mono uppercase tracking-wider text-forest font-semibold">
                Verified Morning Dispatch
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-ink mt-1 tracking-tight">
              Checkout &amp; delivery
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted font-mono bg-white/70 border border-line/70 px-3 py-1.5 rounded-full shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-forest" />
            <span>Encrypted checkout • Direct farm fulfillment</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TWO-COLUMN LAYOUT: GUIDED 3 STEPS + STICKY SUMMARY         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Guided Three Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* ============================================================ */}
          {/* STEP 1: DELIVERY ADDRESS                                     */}
          {/* ============================================================ */}
          <section
            className={`rounded-2xl bg-white/90 border transition-all duration-300 p-5 sm:p-7 shadow-xs ${activeStep === 1
              ? 'border-forest/50 ring-2 ring-forest/10 shadow-soft'
              : 'border-line/80'
              }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line/70">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${activeStep > 1 && selectedAddress
                    ? 'bg-forest text-white'
                    : activeStep === 1
                      ? 'bg-forest text-white'
                      : 'bg-cream text-muted border border-line'
                    }`}
                >
                  {activeStep > 1 && selectedAddress ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    '1'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg sm:text-xl font-medium text-ink">
                      Delivery address
                    </h2>
                    <span className="text-[11px] font-mono text-muted uppercase">Step 1 of 3</span>
                  </div>
                  {activeStep !== 1 && selectedAddress && (
                    <p className="text-xs text-muted mt-0.5 font-sans">
                      {selectedAddress.name} • {selectedAddress.line}, {selectedAddress.locality},{' '}
                      {selectedAddress.city} ({selectedAddress.mobile})
                    </p>
                  )}
                </div>
              </div>

              {/* Action: Change or Add */}
              {activeStep !== 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-semibold text-forest hover:text-forest-deep flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-mint/60 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              ) : (
                !isAddingNewAddress &&
                currentCustomer.addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs font-semibold text-forest hover:underline flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add new address</span>
                  </button>
                )
              )}
            </div>

            {/* Step Content: Expanded when activeStep === 1 */}
            <AnimatePresence>
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pt-5 space-y-4"
                >
                  {/* Saved Address Cards */}
                  {!isAddingNewAddress && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {currentCustomer.addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none ${isSelected
                              ? 'border-forest bg-mint/35 ring-2 ring-forest/20 shadow-xs'
                              : 'border-line/80 hover:border-forest/40 hover:bg-cream/40'
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-ink text-sm">
                                  {addr.name}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-mono uppercase bg-white border border-line px-1.5 py-0.2 rounded text-muted">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected
                                  ? 'border-forest bg-forest text-white'
                                  : 'border-line bg-white'
                                  }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                              </div>
                            </div>
                            <p className="text-muted mt-2 leading-relaxed">
                              {addr.line}, {addr.locality}
                            </p>
                            <p className="text-muted font-medium">
                              {addr.city} – {addr.pinCode}
                            </p>
                            <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-muted font-mono">
                              <span>Mobile: {addr.mobile}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add New Address Form */}
                  {isAddingNewAddress && (
                    <form
                      onSubmit={handleSubmit(onSubmitAddress)}
                      className="space-y-4 p-4 rounded-xl bg-cream/40 border border-line/80"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-line/60">
                        <span className="text-xs font-semibold text-ink font-mono uppercase">
                          New Delivery Address Details
                        </span>
                        {currentCustomer.addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsAddingNewAddress(false)}
                            className="text-xs text-muted hover:text-ink underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Recipient Full Name"
                          placeholder="e.g. Shalini Mehra"
                          error={errors.name?.message}
                          {...register('name')}
                        />
                        <Input
                          label="10-Digit Mobile Number"
                          placeholder="e.g. 9811023456"
                          error={errors.mobile?.message}
                          {...register('mobile')}
                        />
                      </div>

                      <Input
                        label="Flat, Floor, Building / Villa"
                        placeholder="e.g. Flat 402, Tower B, Silver Oaks"
                        error={errors.line?.message}
                        {...register('line')}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                          label="Area / Locality"
                          placeholder="e.g. DLF Phase 5"
                          error={errors.locality?.message}
                          {...register('locality')}
                        />
                        <Input
                          label="City"
                          placeholder="e.g. Gurugram"
                          error={errors.city?.message}
                          {...register('city')}
                        />
                        <Input
                          label="PIN Code"
                          placeholder="e.g. 122002"
                          error={errors.pinCode?.message}
                          {...register('pinCode')}
                        />
                      </div>

                      <Input
                        label="Delivery Note for Morning Dispatch (Optional)"
                        placeholder="e.g. Please ring bell or place near wooden shoe cabinet"
                        {...register('deliveryNote')}
                      />

                      <div className="flex gap-3 pt-2">
                        <Button type="submit" variant="primary" size="sm">
                          Save &amp; Select Address
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Continue Button to Step 2 */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white hover:bg-forest-deep text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Continue to Delivery Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ============================================================ */}
          {/* STEP 2: DELIVERY SLOT                                        */}
          {/* ============================================================ */}
          <section
            className={`rounded-2xl bg-white/90 border transition-all duration-300 p-5 sm:p-7 shadow-xs ${activeStep === 2
              ? 'border-forest/50 ring-2 ring-forest/10 shadow-soft'
              : 'border-line/80'
              }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line/70">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${activeStep > 2
                    ? 'bg-forest text-white'
                    : activeStep === 2
                      ? 'bg-forest text-white'
                      : 'bg-cream text-muted border border-line'
                    }`}
                >
                  {activeStep > 2 ? <Check className="w-4 h-4 stroke-[2.5]" /> : '2'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg sm:text-xl font-medium text-ink">
                      Delivery slot
                    </h2>
                    <span className="text-[11px] font-mono text-muted uppercase">Step 2 of 3</span>
                  </div>
                  {activeStep !== 2 && (
                    <p className="text-xs text-muted mt-0.5 font-sans">
                      {selectedSlotObj.title} ({selectedSlotObj.time})
                    </p>
                  )}
                </div>
              </div>

              {activeStep !== 2 && activeStep > 2 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-semibold text-forest hover:text-forest-deep flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-mint/60 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              )}
            </div>

            {/* Step Content: Expanded when activeStep === 2 */}
            <AnimatePresence>
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pt-5 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {deliverySlots.map((slot) => {
                      const isSelected = selectedDeliverySlot === slot.id;
                      const SlotIcon = slot.icon;

                      return (
                        <div
                          key={slot.id}
                          onClick={() => setDeliverySlot(slot.id)}
                          className={`p-4 sm:p-5 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none flex flex-col justify-between ${isSelected
                            ? 'border-forest bg-mint/35 ring-2 ring-forest/20 shadow-xs'
                            : 'border-line/80 hover:border-forest/40 hover:bg-cream/40'
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold font-mono uppercase px-2.5 py-0.5 rounded-full ${isSelected
                                  ? 'bg-forest text-white'
                                  : 'bg-cream text-muted border border-line'
                                  }`}
                              >
                                <SlotIcon className="w-3 h-3" />
                                {slot.title}
                              </span>

                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected
                                  ? 'border-forest bg-forest text-white'
                                  : 'border-line bg-white'
                                  }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                              </div>
                            </div>

                            <div className="font-heading text-lg font-medium text-ink mt-2">
                              {slot.time}
                            </div>

                            <p className="text-muted mt-1 leading-relaxed">{slot.description}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-leaf font-medium">
                            <span>{slot.tag}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Continue Button to Step 3 */}
                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-xs text-muted hover:text-ink font-semibold"
                    >
                      ← Back to address
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white hover:bg-forest-deep text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ============================================================ */}
          {/* STEP 3: PAYMENT METHOD                                       */}
          {/* ============================================================ */}
          <section
            className={`rounded-2xl bg-white/90 border transition-all duration-300 p-5 sm:p-7 shadow-xs ${activeStep === 3
              ? 'border-forest/50 ring-2 ring-forest/10 shadow-soft'
              : 'border-line/80'
              }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line/70">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${activeStep === 3
                    ? 'bg-forest text-white'
                    : 'bg-cream text-muted border border-line'
                    }`}
                >
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg sm:text-xl font-medium text-ink">
                      Payment method
                    </h2>
                    <span className="text-[11px] font-mono text-muted uppercase">Step 3 of 3</span>
                  </div>
                  {activeStep !== 3 && (
                    <p className="text-xs text-muted mt-0.5 font-sans">
                      {paymentMethod === 'upi'
                        ? 'UPI (Google Pay, PhonePe, Paytm)'
                        : paymentMethod === 'card_netbanking'
                          ? 'Credit / Debit Card / NetBanking'
                          : 'Cash on Delivery'}
                    </p>
                  )}
                </div>
              </div>

              {activeStep !== 3 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="text-xs font-semibold text-forest hover:text-forest-deep flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-mint/60 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Choose</span>
                </button>
              )}
            </div>

            {/* Step Content: Expanded when activeStep === 3 */}
            <AnimatePresence>
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pt-5 space-y-4"
                >
                  {/* Optional Annapurna Wallet Deduction Toggle */}
                  {currentCustomer.walletBalance > 0 && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cream via-sand/30 to-cream border border-line flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-mint text-forest flex items-center justify-center shrink-0">
                          <Wallet className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <div>
                          <span className="font-semibold text-ink text-sm block">
                            Apply Farm Wallet Balance ({formatCurrency(currentCustomer.walletBalance)})
                          </span>
                          <p className="text-muted text-[11.5px]">
                            {useWalletBalance
                              ? `Deducting ${formatCurrency(maxWalletDeduction)} from your wallet credits`
                              : 'Tap checkbox to apply available cashback & wallet credits'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={useWalletBalance}
                        onChange={(e) => setUseWalletBalance(e.target.checked)}
                        className="w-5 h-5 rounded text-forest accent-forest cursor-pointer"
                        aria-label="Use wallet balance"
                      />
                    </div>
                  )}

                  {/* Payment Choices Rows */}
                  <div className="space-y-3">
                    {/* 1. UPI */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${paymentMethod === 'upi'
                        ? 'border-forest bg-mint/35 ring-2 ring-forest/20 shadow-xs'
                        : 'border-line/80 hover:border-forest/40 hover:bg-cream/40'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-line/70 flex items-center justify-center text-forest">
                            <Smartphone className="w-5 h-5 stroke-[1.75]" />
                          </div>
                          <div>
                            <span className="font-semibold text-ink text-sm block">
                              UPI Instant Transfer
                            </span>
                            <span className="text-[11.5px] text-muted">
                              Google Pay, PhonePe, Paytm, BHIM, Cred
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi'
                            ? 'border-forest bg-forest text-white'
                            : 'border-line bg-white'
                            }`}
                        >
                          {paymentMethod === 'upi' && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                      </div>

                      {/* Smooth Expanded UPI input */}
                      {paymentMethod === 'upi' && (
                        <div className="mt-4 pt-3 border-t border-line/60 space-y-2">
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
                            Enter UPI ID / VPA
                          </label>
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="e.g. mobile@upi or username@okhdfcbank"
                            className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs font-mono text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                          />
                          <p className="text-[11px] text-muted">
                            A collect request will be sent to your UPI app for authorization.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 2. Card / NetBanking */}
                    <div
                      onClick={() => setPaymentMethod('card_netbanking')}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${paymentMethod === 'card_netbanking'
                        ? 'border-forest bg-mint/35 ring-2 ring-forest/20 shadow-xs'
                        : 'border-line/80 hover:border-forest/40 hover:bg-cream/40'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-line/70 flex items-center justify-center text-forest">
                            <CreditCard className="w-5 h-5 stroke-[1.75]" />
                          </div>
                          <div>
                            <span className="font-semibold text-ink text-sm block">
                              Credit / Debit Card &amp; NetBanking
                            </span>
                            <span className="text-[11.5px] text-muted">
                              Visa, MasterCard, RuPay, Amex &amp; all major Indian banks
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card_netbanking'
                            ? 'border-forest bg-forest text-white'
                            : 'border-line bg-white'
                            }`}
                        >
                          {paymentMethod === 'card_netbanking' && (
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          )}
                        </div>
                      </div>

                      {/* Smooth Expanded Card Form */}
                      {paymentMethod === 'card_netbanking' && (
                        <div className="mt-4 pt-3 border-t border-line/60 space-y-3">
                          <div>
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-semibold mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumberInput}
                              onChange={(e) => setCardNumberInput(e.target.value)}
                              placeholder="16-digit card number"
                              className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs font-mono text-ink focus:outline-none focus:border-forest"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-semibold mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={cardExpiryInput}
                                onChange={(e) => setCardExpiryInput(e.target.value)}
                                placeholder="MM/YY"
                                className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs font-mono text-ink focus:outline-none focus:border-forest"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-semibold mb-1">
                                CVV
                              </label>
                              <input
                                type="password"
                                value={cardCvvInput}
                                onChange={(e) => setCardCvvInput(e.target.value)}
                                placeholder="•••"
                                maxLength={4}
                                className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs font-mono text-ink focus:outline-none focus:border-forest"
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-muted">
                            Demo sandbox: no actual card charge is processed.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 3. Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${paymentMethod === 'cod'
                        ? 'border-forest bg-mint/35 ring-2 ring-forest/20 shadow-xs'
                        : 'border-line/80 hover:border-forest/40 hover:bg-cream/40'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-line/70 flex items-center justify-center text-forest">
                            <Banknote className="w-5 h-5 stroke-[1.75]" />
                          </div>
                          <div>
                            <span className="font-semibold text-ink text-sm block">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[11.5px] text-muted">
                              Pay in cash or scan delivery partner's QR code upon arrival
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod'
                            ? 'border-forest bg-forest text-white'
                            : 'border-line bg-white'
                            }`}
                        >
                          {paymentMethod === 'cod' && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="text-xs text-muted hover:text-ink font-semibold"
                    >
                      ← Back to delivery slot
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Right Column: Sticky Order Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="rounded-2xl bg-white/95 border border-line/80 shadow-soft p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line/70">
              <h3 className="font-heading text-lg font-medium text-ink">
                Harvest basket
              </h3>
              <span className="text-xs font-mono text-muted">
                {detailedCart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            {/* Item Mini List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-line/60">
              {detailedCart.map((item) => (
                <div
                  key={item.productId}
                  className="pt-2.5 first:pt-0 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-medium text-ink truncate text-[13px]">{item.product.name}</p>
                    <p className="text-[11px] text-muted font-mono">
                      {item.quantity} × {formatCurrency(item.product.price)} / {item.product.unitLabel}
                    </p>
                  </div>
                  <span className="font-semibold text-ink tabular-nums shrink-0 text-sm">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-3.5 border-t border-line/70">
              <div className="flex justify-between text-muted">
                <span>Items subtotal</span>
                <span className="font-semibold text-ink tabular-nums">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-muted">
                <span className="flex items-center gap-1.5">
                  <span>Sunrise delivery</span>
                  {cartSubtotal >= pricingConfig.freeDeliveryThreshold && (
                    <span className="text-[10px] font-mono text-leaf bg-mint px-1.5 py-0.2 rounded font-semibold">
                      Threshold reached
                    </span>
                  )}
                </span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <span className="text-forest font-bold tracking-wider">FREE</span>
                  ) : (
                    formatCurrency(cartDeliveryFee)
                  )}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Coupon &amp; promo discount</span>
                  <span>-{formatCurrency(cartDiscount)}</span>
                </div>
              )}

              {maxWalletDeduction > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Farm wallet credits applied</span>
                  <span>-{formatCurrency(maxWalletDeduction)}</span>
                </div>
              )}

              <div className="pt-3.5 border-t border-line/80 flex justify-between items-baseline">
                <div>
                  <span className="font-heading text-base font-medium text-ink block">
                    Total payable
                  </span>
                  <span className="text-[11px] text-muted font-mono">
                    Includes all harvest &amp; packing taxes
                  </span>
                </div>
                <span className="font-heading text-2xl font-semibold text-ink tabular-nums">
                  {formatCurrency(finalPayable)}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-2 space-y-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePlaceOrder}
                isLoading={isSubmitting}
                className="py-3.5 text-sm font-bold shadow-soft"
              >
                Place Order • {formatCurrency(finalPayable)}
              </Button>

              <p className="text-[11px] text-muted text-center leading-normal">
                Demo environment: no payment will be charged to your account.
              </p>
            </div>
          </div>

          {/* Guarantee / Trust Cue */}
          <div className="p-4 rounded-xl bg-cream/60 border border-line/70 flex items-center gap-3 text-xs text-muted">
            <ShieldCheck className="w-5 h-5 text-forest shrink-0" />
            <p className="leading-snug">
              Every morning batch is quality inspected. 100% replacement guarantee if produce is not garden-fresh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
