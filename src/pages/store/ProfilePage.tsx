import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../store/AppStoreContext';
import { Address } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import {
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  MapPin,
  Check,
} from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  email: z.string().email('Valid email address required').optional().or(z.literal('')),
});

const addressModalSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile required'),
  line: z.string().min(5, 'Flat / House / Building details required'),
  locality: z.string().min(3, 'Locality required'),
  city: z.string().min(2, 'City required'),
  pinCode: z.string().regex(/^\d{6}$/, 'Valid 6-digit PIN code required'),
  deliveryNote: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressModalFormData = z.infer<typeof addressModalSchema>;

export const ProfilePage: React.FC = () => {
  const { currentCustomer, dispatch } = useAppStore();
  const toast = useToast();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentCustomer.name,
      mobile: currentCustomer.mobile,
      email: currentCustomer.email || '',
    },
  });

  // Address Modal Form
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm<AddressModalFormData>({
    resolver: zodResolver(addressModalSchema),
  });

  const onSaveProfile = (data: ProfileFormData) => {
    dispatch({
      type: 'UPDATE_CUSTOMER_PROFILE',
      payload: {
        name: data.name,
        mobile: data.mobile,
        email: data.email || undefined,
      },
    });
    toast.success('Profile Saved', 'Customer information updated successfully.');
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    resetAddressForm({
      name: currentCustomer.name,
      mobile: currentCustomer.mobile,
      city: 'Gurugram',
      pinCode: '122002',
      line: '',
      locality: '',
      deliveryNote: '',
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    resetAddressForm({
      name: addr.name,
      mobile: addr.mobile,
      line: addr.line,
      locality: addr.locality,
      city: addr.city,
      pinCode: addr.pinCode,
      deliveryNote: addr.deliveryNote || '',
    });
    setIsAddressModalOpen(true);
  };

  const onSaveAddress = (data: AddressModalFormData) => {
    if (editingAddress) {
      dispatch({
        type: 'UPDATE_CUSTOMER_ADDRESS',
        payload: {
          ...editingAddress,
          ...data,
        },
      });
      toast.success('Address Updated');
    } else {
      dispatch({
        type: 'ADD_CUSTOMER_ADDRESS',
        payload: {
          ...data,
          isDefault: currentCustomer.addresses.length === 0,
        },
      });
      toast.success('Address Added');
    }
    setIsAddressModalOpen(false);
  };

  const handleSetDefault = (id: string) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id });
    toast.success('Default Address Updated');
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      dispatch({ type: 'DELETE_CUSTOMER_ADDRESS', payload: deleteTargetId });
      setDeleteTargetId(null);
      toast.info('Address Deleted');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
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
          <span className="font-semibold text-ink">Profile &amp; Addresses</span>
        </nav>
        <h1 className="font-heading text-3xl sm:text-4xl font-normal text-ink">
          Profile &amp; Delivery Addresses
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage personal contact details and saved doorstep addresses.
        </p>
      </div>

      {/* 1. Profile Details Card */}
      <section className="bg-white rounded-card border border-line p-6 space-y-6">
        <div>
          <h3 className="font-heading text-lg font-normal text-ink">
            Personal Details
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Used for delivery updates, receipts, and order coordination.
          </p>
        </div>

        <form onSubmit={handleSubmitProfile(onSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...registerProfile('name')}
              error={profileErrors.name?.message}
              required
            />
            <Input
              label="Mobile Number"
              {...registerProfile('mobile')}
              error={profileErrors.mobile?.message}
              required
            />
          </div>

          <Input
            label="Email Address (Optional)"
            placeholder="For invoice and order receipts"
            {...registerProfile('email')}
            error={profileErrors.email?.message}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!isProfileDirty}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </section>

      {/* 2. Saved Addresses Card */}
      <section className="bg-white rounded-card border border-line p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">
              Saved Addresses
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Select or edit delivery locations for morning dispatches.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAddAddress}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Address
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentCustomer.addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-card border text-xs flex flex-col justify-between space-y-3 transition-colors ${
                addr.isDefault
                  ? 'border-forest bg-mint/15'
                  : 'border-line bg-white'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink text-sm">{addr.name}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-forest text-white px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-muted leading-relaxed">
                  {addr.line}, {addr.locality}, {addr.city} – {addr.pinCode}
                </p>
                <p className="text-ink font-mono text-[11px] pt-1">
                  Ph: {addr.mobile}
                </p>
                {addr.deliveryNote && (
                  <p className="text-[11px] text-muted italic">
                    Note: {addr.deliveryNote}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-line/60">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-forest text-xs font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-forest text-[11px] font-semibold">
                    <Check className="w-3 h-3" /> Default destination
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditAddress(addr)}
                    className="p-1.5 rounded-[8px] text-muted hover:text-forest hover:bg-cream transition-colors"
                    title="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(addr.id)}
                    className="p-1.5 rounded-[8px] text-muted hover:text-red hover:bg-red/10 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
      >
        <form onSubmit={handleSubmitAddress(onSaveAddress)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Name"
              {...registerAddress('name')}
              error={addressErrors.name?.message}
              required
            />
            <Input
              label="Contact Mobile"
              {...registerAddress('mobile')}
              error={addressErrors.mobile?.message}
              required
            />
          </div>

          <Input
            label="Flat / House / Street Address"
            {...registerAddress('line')}
            error={addressErrors.line?.message}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Locality"
              {...registerAddress('locality')}
              error={addressErrors.locality?.message}
              required
            />
            <Input
              label="City"
              {...registerAddress('city')}
              error={addressErrors.city?.message}
              required
            />
            <Input
              label="PIN Code"
              {...registerAddress('pinCode')}
              error={addressErrors.pinCode?.message}
              required
            />
          </div>

          <Input
            label="Delivery Instructions (Optional)"
            placeholder="e.g. Leave with security guard, ring bell once"
            {...registerAddress('deliveryNote')}
          />

          <div className="flex gap-2 justify-end pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Address Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Address?"
        description="Are you sure you want to remove this delivery destination from your account?"
        isDestructive={true}
      />
    </div>
  );
};
