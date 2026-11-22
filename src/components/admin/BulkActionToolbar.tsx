import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Category, Product } from '../../types';
import {
  Tag,
  Boxes,
  FolderSync,
  Trash2,
  X,
  CheckCircle,
  EyeOff,
} from 'lucide-react';

export interface BulkActionToolbarProps {
  selectedIds: string[];
  allProducts: Product[];
  categories: Category[];
  onClearSelection: () => void;
  onBulkUpdate: (updates: {
    priceAdjustment?: { type: 'fixed' | 'percent'; value: number };
    stockAdjustment?: { type: 'set' | 'add'; value: number };
    categoryId?: string;
    isActive?: boolean;
  }) => void;
  onBulkDelete: () => void;
}

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedIds,
  allProducts,
  categories,
  onClearSelection,
  onBulkUpdate,
  onBulkDelete,
}) => {
  const [activeModal, setActiveModal] = useState<
    'price' | 'stock' | 'category' | 'delete' | null
  >(null);

  // Price modal state
  const [priceType, setPriceType] = useState<'fixed' | 'percent'>('percent');
  const [priceDirection, setPriceDirection] = useState<'inc' | 'dec'>('inc');
  const [priceVal, setPriceVal] = useState<number>(10);

  // Stock modal state
  const [stockType, setStockType] = useState<'set' | 'add'>('add');
  const [stockVal, setStockVal] = useState<number>(20);

  // Category modal state
  const [targetCategory, setTargetCategory] = useState<string>(categories[0]?.id || '');

  if (selectedIds.length === 0) return null;

  const sampleProduct = allProducts.find((p) => p.id === selectedIds[0]);

  // Compute preview calculation for price
  let sampleNewPrice = sampleProduct?.price || 100;
  if (sampleProduct) {
    const delta = priceDirection === 'inc' ? priceVal : -priceVal;
    if (priceType === 'fixed') {
      sampleNewPrice = Math.max(1, sampleProduct.price + delta);
    } else {
      sampleNewPrice = Math.max(1, Math.round(sampleProduct.price * (1 + delta / 100)));
    }
  }

  const handleApplyPrice = () => {
    const delta = priceDirection === 'inc' ? priceVal : -priceVal;
    onBulkUpdate({
      priceAdjustment: {
        type: priceType,
        value: delta,
      },
    });
    setActiveModal(null);
  };

  const handleApplyStock = () => {
    onBulkUpdate({
      stockAdjustment: {
        type: stockType,
        value: stockVal,
      },
    });
    setActiveModal(null);
  };

  const handleApplyCategory = () => {
    onBulkUpdate({ categoryId: targetCategory });
    setActiveModal(null);
  };

  const handleSetActive = (isActive: boolean) => {
    onBulkUpdate({ isActive });
  };

  return (
    <>
      {/* Sticky Bottom Bulk Bar with 10px radius */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-full px-4">
        <div className="bg-forest-deep text-white rounded-[10px] px-4 py-3 shadow-dropdown border border-[#144723] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lime font-medium">
              {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
            </span>
            <span className="text-white/30">|</span>
            <button
              onClick={onClearSelection}
              className="text-[#C9D8C6] hover:text-white transition-colors"
            >
              Deselect
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSetActive(true)}
              className="px-2.5 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Set Active
            </button>

            <button
              onClick={() => handleSetActive(false)}
              className="px-2.5 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Set Inactive
            </button>

            <button
              onClick={() => setActiveModal('price')}
              className="px-2.5 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Price
            </button>

            <button
              onClick={() => setActiveModal('stock')}
              className="px-2.5 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Stock
            </button>

            <button
              onClick={() => setActiveModal('category')}
              className="hidden sm:inline-block px-2.5 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Category
            </button>

            <button
              onClick={() => setActiveModal('delete')}
              className="px-2.5 py-1.5 rounded-[8px] bg-red/80 hover:bg-red text-white transition-colors"
              title="Bulk Delete"
            >
              Delete
            </button>

            <button
              onClick={onClearSelection}
              className="p-1 rounded text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Price Modal */}
      <Modal
        isOpen={activeModal === 'price'}
        onClose={() => setActiveModal(null)}
        title={`Adjust Price (${selectedIds.length} Products)`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-ink block mb-1">Adjustment Type</label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as any)}
                className="w-full bg-cream border border-line rounded-[10px] p-2 text-ink focus:outline-none focus:border-forest"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-ink block mb-1">Direction</label>
              <select
                value={priceDirection}
                onChange={(e) => setPriceDirection(e.target.value as any)}
                className="w-full bg-cream border border-line rounded-[10px] p-2 text-ink focus:outline-none focus:border-forest"
              >
                <option value="inc">Increase (+)</option>
                <option value="dec">Decrease (-)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium text-ink block mb-1">Value</label>
            <input
              type="number"
              min="1"
              value={priceVal}
              onChange={(e) => setPriceVal(Number(e.target.value))}
              className="w-full bg-cream border border-line rounded-[10px] px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:border-forest"
            />
          </div>

          {/* Live Preview Box */}
          {sampleProduct && (
            <div className="p-3 bg-mint/20 rounded-[10px] border border-line text-ink">
              <p className="font-medium">
                Updating {selectedIds.length} items by {priceDirection === 'inc' ? '+' : '-'}{priceVal}{priceType === 'percent' ? '%' : '₹'}.
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted">
                Sample ({sampleProduct.name}): ₹{sampleProduct.price} → ₹{sampleNewPrice}
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyPrice}>
              Update Prices
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Stock Modal */}
      <Modal
        isOpen={activeModal === 'stock'}
        onClose={() => setActiveModal(null)}
        title={`Adjust Inventory (${selectedIds.length} Products)`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-ink block mb-1">Mode</label>
              <select
                value={stockType}
                onChange={(e) => setStockType(e.target.value as any)}
                className="w-full bg-cream border border-line rounded-[10px] p-2 text-ink focus:outline-none focus:border-forest"
              >
                <option value="add">Add to current stock (+)</option>
                <option value="set">Set exact inventory count</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-ink block mb-1">Units Quantity</label>
              <input
                type="number"
                min="0"
                value={stockVal}
                onChange={(e) => setStockVal(Number(e.target.value))}
                className="w-full bg-cream border border-line rounded-[10px] px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div className="p-3 bg-mint/20 rounded-[10px] border border-line text-ink text-xs">
            {stockType === 'add'
              ? `Adding ${stockVal} units to all ${selectedIds.length} selected items.`
              : `Setting inventory to ${stockVal} units across all ${selectedIds.length} selected items.`}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyStock}>
              Update Inventory
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Category Modal */}
      <Modal
        isOpen={activeModal === 'category'}
        onClose={() => setActiveModal(null)}
        title={`Move Category (${selectedIds.length} Products)`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-ink block mb-1">Target Category</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full bg-cream border border-line rounded-[10px] p-2 text-ink focus:outline-none focus:border-forest"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyCategory}>
              Reassign Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          onBulkDelete();
          setActiveModal(null);
        }}
        title={`Delete ${selectedIds.length} Products?`}
        description="Are you sure you want to delete these products from the catalog? They will be removed from customer view immediately."
        confirmText="Yes, Delete Products"
        isDestructive={true}
      />
    </>
  );
};
