import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../store/AppStoreContext';
import { Address, PaymentMethod } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency } from '../../lib/utils';
import {
  Clock,
  MapPin,
  Plus,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  ChevronRight,
  Check,
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

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentCustomer.addresses[0]?.id || 'new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(
    currentCustomer.addresses.length === 0
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('user@upi');
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
      title: 'Morning Slot (6:00 AM – 9:00 AM)',
      subtitle: 'Sunrise harvest dispatch. Placed outside door or handed in person.',
    },
    {
      id: 'Evening (5 PM - 8 PM)',
      title: 'Evening Slot (5:00 PM – 8:00 PM)',
      subtitle: 'Delivered after work for dinner preparation.',
    },
  ];

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
    }, 500);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      {/* Breadcrumb */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-2">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/cart" className="hover:text-forest transition-colors">
            Basket
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-ink">Checkout</span>
        </nav>
        <h1 className="font-heading text-3xl font-medium text-ink">
          Checkout &amp; delivery
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Numbered Sections with Thin Vertical Step Line */}
        <div className="lg:col-span-8 space-y-8 relative">
          {/* STEP 1: Delivery Address */}
          <section className="bg-white rounded-card border border-line p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-[6px] bg-forest text-white flex items-center justify-center font-semibold text-xs">
                  1
                </div>
                <h2 className="font-heading text-base font-medium text-ink">
                  Delivery address
                </h2>
              </div>
              {!isAddingNewAddress && currentCustomer.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add new address
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {!isAddingNewAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentCustomer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-[10px] border text-xs cursor-pointer transition-colors relative ${
                      selectedAddressId === addr.id
                        ? 'border-forest bg-cream'
                        : 'border-line hover:border-forest/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-ink">{addr.name}</span>
                      {selectedAddressId === addr.id && (
                        <Check className="w-4 h-4 text-forest" />
                      )}
                    </div>
                    <p className="text-muted mt-1 leading-normal">
                      {addr.line}, {addr.locality}
                    </p>
                    <p className="text-muted">
                      {addr.city} – {addr.pinCode}
                    </p>
                    <p className="text-[11px] text-muted mt-1">Mobile: {addr.mobile}</p>
                  </div>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {isAddingNewAddress && (
              <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Shalini Mehra"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    error={errors.mobile?.message}
                    {...register('mobile')}
                  />
                </div>

                <Input
                  label="Flat / House / Floor / Building"
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
                    placeholder="6 digits"
                    error={errors.pinCode?.message}
                    {...register('pinCode')}
                  />
                </div>

                <Input
                  label="Delivery Note (Optional)"
                  placeholder="e.g. Leave with security guard"
                  {...register('deliveryNote')}
                />

                <div className="flex gap-2 pt-2">
                  <Button type="submit" variant="primary" size="sm">
                    Save and use address
                  </Button>
                  {currentCustomer.addresses.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingNewAddress(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* STEP 2: Delivery Slot */}
          <section className="bg-white rounded-card border border-line p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-6 h-6 rounded-[6px] bg-forest text-white flex items-center justify-center font-semibold text-xs">
                2
              </div>
              <h2 className="font-heading text-base font-medium text-ink">
                Delivery slot
              </h2>
            </div>

            <div className="space-y-3">
              {deliverySlots.map((slot) => (
                <label
                  key={slot.id}
                  className={`p-4 rounded-[10px] border text-xs cursor-pointer transition-colors flex items-start gap-3 ${
                    selectedDeliverySlot === slot.id
                      ? 'border-forest bg-cream'
                      : 'border-line hover:border-forest/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySlot"
                    aria-label={slot.title}
                    checked={selectedDeliverySlot === slot.id}
                    onChange={() => setDeliverySlot(slot.id)}
                    className="mt-0.5 accent-forest"
                  />
                  <div>
                    <span className="font-semibold text-ink block">{slot.title}</span>
                    <p className="text-muted mt-0.5">{slot.subtitle}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* STEP 3: Payment Method (Radio rows with logo/icon, forest border when selected) */}
          <section className="bg-white rounded-card border border-line p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-6 h-6 rounded-[6px] bg-forest text-white flex items-center justify-center font-semibold text-xs">
                3
              </div>
              <h2 className="font-heading text-base font-medium text-ink">
                Payment method
              </h2>
            </div>

            {/* Wallet Toggle Option */}
            {currentCustomer.walletBalance > 0 && (
              <label className="p-3.5 rounded-[10px] bg-cream border border-line flex items-center justify-between text-xs cursor-pointer">
                <div className="flex items-center gap-3">
                  <Wallet className="w-4 h-4 text-forest shrink-0" />
                  <div>
                    <span className="font-semibold text-ink">
                      Use Annapurna Wallet ({formatCurrency(currentCustomer.walletBalance)})
                    </span>
                    <p className="text-[11px] text-muted">
                      {useWalletBalance
                        ? `Deducting ${formatCurrency(maxWalletDeduction)} from your balance`
                        : 'Apply available wallet credits'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  aria-label="Use Annapurna Wallet balance"
                  checked={useWalletBalance}
                  onChange={(e) => setUseWalletBalance(e.target.checked)}
                  className="w-4 h-4 rounded text-forest accent-forest cursor-pointer"
                />
              </label>
            )}

            {/* Vertical List of Radio Rows per Section 6 */}
            <div className="space-y-2.5">
              {/* UPI */}
              <label
                className={`p-3.5 rounded-[10px] border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-forest bg-cream'
                    : 'border-line hover:border-forest/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    aria-label="UPI (Google Pay, PhonePe, Paytm)"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-forest"
                  />
                  <Smartphone className="w-4 h-4 stroke-[1.5] text-forest" />
                  <div>
                    <span className="font-semibold text-ink">UPI</span>
                    <span className="text-[11px] text-muted ml-2">Google Pay, PhonePe, Paytm</span>
                  </div>
                </div>
              </label>

              {/* Card / Netbanking */}
              <label
                className={`p-3.5 rounded-[10px] border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                  paymentMethod === 'card_netbanking'
                    ? 'border-forest bg-cream'
                    : 'border-line hover:border-forest/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    aria-label="Credit / Debit Card or NetBanking"
                    checked={paymentMethod === 'card_netbanking'}
                    onChange={() => setPaymentMethod('card_netbanking')}
                    className="accent-forest"
                  />
                  <CreditCard className="w-4 h-4 stroke-[1.5] text-forest" />
                  <div>
                    <span className="font-semibold text-ink">Credit / Debit Card or NetBanking</span>
                    <span className="text-[11px] text-muted ml-2">All major Indian banks</span>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`p-3.5 rounded-[10px] border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-forest bg-cream'
                    : 'border-line hover:border-forest/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    aria-label="Cash on Delivery"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-forest"
                  />
                  <Banknote className="w-4 h-4 stroke-[1.5] text-forest" />
                  <div>
                    <span className="font-semibold text-ink">Cash on Delivery</span>
                    <span className="text-[11px] text-muted ml-2">Pay upon morning arrival</span>
                  </div>
                </div>
              </label>
            </div>

            {/* UPI ID input if UPI selected */}
            {paymentMethod === 'upi' && (
              <div className="pt-2">
                <Input
                  label="Enter UPI ID"
                  placeholder="e.g. yourname@upi"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                />
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-card border border-line p-5 space-y-4">
            <h3 className="font-heading text-base font-medium text-ink pb-2 border-b border-line">
              Order summary
            </h3>

            {/* Item Mini List */}
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-line">
              {detailedCart.map((item) => (
                <div key={item.productId} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-ink truncate">{item.product.name}</p>
                    <p className="text-[11px] text-muted">
                      {item.quantity} x {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <span className="font-semibold text-ink tabular-nums shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-3 border-t border-line">
              <div className="flex justify-between text-muted">
                <span>Items subtotal</span>
                <span className="font-semibold text-ink tabular-nums">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery charge</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <span className="text-forest font-semibold">FREE</span>
                  ) : (
                    formatCurrency(cartDeliveryFee)
                  )}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Discount</span>
                  <span>-{formatCurrency(cartDiscount)}</span>
                </div>
              )}
              {maxWalletDeduction > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Wallet applied</span>
                  <span>-{formatCurrency(maxWalletDeduction)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-line flex justify-between items-baseline">
                <span className="font-heading text-sm font-medium text-ink">Total payable</span>
                <span className="font-heading text-xl font-semibold text-ink tabular-nums">
                  {formatCurrency(finalPayable)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handlePlaceOrder}
              isLoading={isSubmitting}
            >
              Place Order ({formatCurrency(finalPayable)})
            </Button>

            {/* ONLY ONE discreet line under Place Order per Section 6 & 9 */}
            <p className="text-[11px] text-muted text-center pt-1">
              Demo: no real payment is processed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
