import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppStoreContext';
import { Product, LOW_STOCK_THRESHOLD, getStockStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { getProductImageUrl } from '../../lib/images';
import {
  Search,
  Edit2,
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { products, categories, adjustStock } = useAppStore();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Adjustment Modal state
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [adjustMode, setAdjustMode] = useState<'set' | 'delta'>('delta');
  const [adjustValue, setAdjustValue] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Morning harvest received');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
          return false;
        }
      }

      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) {
        return false;
      }

      const status = getStockStatus(p.stockQuantity);
      if (stockStatusFilter === 'in-stock' && status !== 'In Stock') return false;
      if (stockStatusFilter === 'low-stock' && status !== 'Low Stock') return false;
      if (stockStatusFilter === 'out-of-stock' && status !== 'Out of Stock') return false;

      return true;
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter]);

  const handleOpenAdjust = (p: Product) => {
    setTargetProduct(p);
    setAdjustMode('delta');
    setAdjustValue(10);
    setAdjustReason('Morning harvest arrival');
  };

  const handleSaveAdjustment = () => {
    if (!targetProduct) return;

    let newStock = targetProduct.stockQuantity;
    if (adjustMode === 'set') {
      newStock = Math.max(0, adjustValue);
    } else {
      newStock = Math.max(0, targetProduct.stockQuantity + adjustValue);
    }

    adjustStock(targetProduct.id, newStock, adjustReason);
    toast.success(
      `Inventory Updated`,
      `${targetProduct.name} stock changed to ${newStock} units.`
    );
    setTargetProduct(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header with LOW_STOCK threshold indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Inventory &amp; Stock Levels
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            Real-time harvest stock • Items with 0 stock block customer checkouts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted bg-white px-3 py-1.5 rounded-[8px] border border-line">
          <span>Safety Threshold:</span>
          <span className="font-bold text-ink">
            ≤ {LOW_STOCK_THRESHOLD} units
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-card border border-line p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce or SKU..."
            className="w-full bg-cream/50 border border-line rounded-[10px] pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-cream/50 border border-line rounded-[10px] px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value as any)}
            className="bg-cream/50 border border-line rounded-[10px] px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in-stock">In Stock (&gt; 10)</option>
            <option value="low-stock">Low Stock (≤ 10)</option>
            <option value="out-of-stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF8] border-b border-line text-muted font-mono uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 font-normal">Produce</th>
                <th className="p-3.5 font-normal">SKU</th>
                <th className="p-3.5 font-normal">Pack</th>
                <th className="p-3.5 font-normal">Current Stock</th>
                <th className="p-3.5 font-normal">Status</th>
                <th className="p-3.5 font-normal">Capacity</th>
                <th className="p-3.5 text-right font-normal">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {filteredProducts.map((p) => {
                const stockStatus = getStockStatus(p.stockQuantity);
                const img = getProductImageUrl(p.id, p.image);

                return (
                  <tr key={p.id} className="hover:bg-[#FBFBF9] transition-colors h-[52px]">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={p.name}
                          className="w-8 h-8 rounded-[6px] object-cover bg-cream border border-line shrink-0"
                        />
                        <div>
                          <span className="font-medium text-ink block truncate max-w-[180px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-muted font-mono">₹{p.price}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-muted text-[11px]">{p.id}</td>
                    <td className="p-3.5 text-muted font-mono text-[11px]">{p.unitLabel}</td>

                    <td className="p-3.5">
                      <span className="font-mono font-medium text-ink tabular-nums">
                        {p.stockQuantity} units
                      </span>
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={stockStatus} size="sm" />
                    </td>

                    <td className="p-3.5">
                      <div className="w-24 space-y-1">
                        <div className="h-1.5 bg-cream rounded-full overflow-hidden border border-line">
                          <div
                            className={`h-full ${
                              p.stockQuantity === 0
                                ? 'bg-red'
                                : p.stockQuantity <= 10
                                ? 'bg-marigold'
                                : 'bg-forest'
                            }`}
                            style={{
                              width: `${Math.min(100, (p.stockQuantity / 40) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenAdjust(p)}
                        className="text-forest hover:underline text-xs font-mono inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={Boolean(targetProduct)}
        onClose={() => setTargetProduct(null)}
        title={targetProduct ? `Adjust Stock: ${targetProduct.name}` : 'Adjust Stock'}
        maxWidth="md"
      >
        {targetProduct && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-cream/40 rounded-[10px] border border-line flex justify-between font-mono">
              <div>
                <span className="text-muted block text-[11px]">Current Stock:</span>
                <span className="font-bold text-sm text-ink">
                  {targetProduct.stockQuantity} units
                </span>
              </div>
              <div className="text-right">
                <span className="text-muted block text-[11px]">Unit:</span>
                <span className="text-ink">{targetProduct.unitLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-ink block mb-1">Mode</label>
                <select
                  value={adjustMode}
                  onChange={(e) => setAdjustMode(e.target.value as any)}
                  className="w-full bg-cream/40 border border-line rounded-[10px] p-2 text-ink focus:outline-none focus:border-forest"
                >
                  <option value="delta">Add or Deduct (+/-)</option>
                  <option value="set">Set Exact Count</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-ink block mb-1">
                  {adjustMode === 'set' ? 'New Quantity' : 'Delta (+/-)'}
                </label>
                <input
                  type="number"
                  value={adjustValue}
                  onChange={(e) => setAdjustValue(Number(e.target.value))}
                  className="w-full bg-cream/40 border border-line rounded-[10px] px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-ink block mb-1">Adjustment Reason</label>
              <input
                type="text"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Morning orchard harvest, damaged crates..."
                className="w-full bg-cream/40 border border-line rounded-[10px] px-3 py-2 text-xs text-ink focus:outline-none focus:border-forest"
              />
            </div>

            <div className="p-3 bg-mint/20 rounded-[10px] border border-line text-ink text-xs font-mono">
              Result: {targetProduct.stockQuantity} →{' '}
              <strong>
                {adjustMode === 'set'
                  ? Math.max(0, adjustValue)
                  : Math.max(0, targetProduct.stockQuantity + adjustValue)}{' '}
                units
              </strong>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setTargetProduct(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveAdjustment}>
                Save Stock
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
