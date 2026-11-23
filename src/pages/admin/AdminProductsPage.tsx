import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { Product } from '../../types';
import { BulkActionToolbar } from '../../components/admin/BulkActionToolbar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatDate } from '../../lib/utils';
import { getProductImageUrl } from '../../lib/images';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, dispatch, getCategoryById } = useAppStore();
  const toast = useToast();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Single delete state
  const [deleteTargetProduct, setDeleteTargetProduct] = useState<Product | null>(null);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!p.name.toLowerCase().includes(q)) return false;
        }

        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        if (statusFilter === 'active' && !p.isActive) return false;
        if (statusFilter === 'inactive' && p.isActive) return false;
        if (statusFilter === 'low-stock' && (p.stockQuantity <= 0 || p.stockQuantity > 10)) return false;
        if (statusFilter === 'out-of-stock' && p.stockQuantity > 0) return false;

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') diff = a.name.localeCompare(b.name);
        if (sortBy === 'price') diff = a.price - b.price;
        if (sortBy === 'stock') diff = a.stockQuantity - b.stockQuantity;
        if (sortBy === 'updated') {
          diff = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [products, searchQuery, selectedCategory, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (col: 'name' | 'price' | 'stock' | 'updated') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  };

  // Bulk operations with Undo capability
  const handleBulkUpdate = (updates: any) => {
    const previousProductsSnapshot = [...products];
    dispatch({
      type: 'BULK_UPDATE_PRODUCTS',
      payload: {
        ids: selectedIds,
        updates,
      },
    });

    toast.success(`Updated ${selectedIds.length} Products`, 'Storefront reflects new values immediately.', {
      duration: 6000,
      undoAction: () => {
        dispatch({ type: 'RESTORE_PREVIOUS_PRODUCTS', payload: previousProductsSnapshot });
        toast.info('Changes Undone', 'Restored previous product values.');
      },
      undoLabel: 'Undo Bulk Edit',
    });

    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    const previousProductsSnapshot = [...products];
    const count = selectedIds.length;
    dispatch({
      type: 'BULK_DELETE_PRODUCTS',
      payload: selectedIds,
    });

    toast.info(`Deleted ${count} Products`, 'Items removed from catalog.', {
      duration: 6000,
      undoAction: () => {
        dispatch({ type: 'RESTORE_PREVIOUS_PRODUCTS', payload: previousProductsSnapshot });
        toast.success('Restored deleted products');
      },
      undoLabel: 'Undo Delete',
    });

    setSelectedIds([]);
  };

  const handleConfirmSingleDelete = () => {
    if (deleteTargetProduct) {
      const deleted = deleteTargetProduct;
      const previousProductsSnapshot = [...products];
      dispatch({ type: 'DELETE_PRODUCT', payload: deleted.id });
      setDeleteTargetProduct(null);

      toast.info(`Deleted ${deleted.name}`, undefined, {
        duration: 5000,
        undoAction: () => {
          dispatch({ type: 'RESTORE_PREVIOUS_PRODUCTS', payload: previousProductsSnapshot });
        },
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h2 className="font-heading text-2xl font-normal text-ink">
            Produce Catalog
          </h2>
          <p className="text-xs text-muted font-mono mt-0.5">
            {products.length} farm items listed • {products.filter((p) => p.isActive).length} visible to customers
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/admin/products/new')}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Produce
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-card border border-line p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            aria-label="Search produce name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search produce name..."
            className="w-full bg-cream/50 border border-line rounded-[10px] pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-forest"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
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
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-cream/50 border border-line rounded-[10px] px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="low-stock">Low Stock (≤ 10)</option>
            <option value="out-of-stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products DataTable */}
      <div className="bg-white rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF8] border-b border-line text-muted font-mono uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all produce items"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-forest accent-forest cursor-pointer"
                  />
                </th>
                <th className="p-3.5 cursor-pointer font-normal" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1 hover:text-ink">
                    <span>Produce &amp; ID</span>
                    <ArrowUpDown className="w-3 h-3 text-muted/60" />
                  </div>
                </th>
                <th className="p-3.5 font-normal">Category</th>
                <th className="p-3.5 font-normal">Unit</th>
                <th className="p-3.5 cursor-pointer font-normal" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1 hover:text-ink">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3 text-muted/60" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer font-normal" onClick={() => handleSort('stock')}>
                  <div className="flex items-center gap-1 hover:text-ink">
                    <span>Inventory</span>
                    <ArrowUpDown className="w-3 h-3 text-muted/60" />
                  </div>
                </th>
                <th className="p-3.5 font-normal">Visibility</th>
                <th className="p-3.5 cursor-pointer font-normal" onClick={() => handleSort('updated')}>
                  <div className="flex items-center gap-1 hover:text-ink">
                    <span>Updated</span>
                    <ArrowUpDown className="w-3 h-3 text-muted/60" />
                  </div>
                </th>
                <th className="p-3.5 text-right font-normal">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted">
                    No produce found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const cat = getCategoryById(p.categoryId);
                  const isSelected = selectedIds.includes(p.id);
                  const img = getProductImageUrl(p.id, p.image);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#FBFBF9] transition-colors h-[52px] ${
                        isSelected ? 'bg-mint/15' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <input
                          type="checkbox"
                          aria-label={`Select ${p.name}`}
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="w-4 h-4 rounded text-forest accent-forest cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-8 h-8 rounded-[6px] object-cover bg-cream border border-line shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-medium text-ink block truncate max-w-[180px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-muted font-mono">{p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-muted">{cat?.name || 'Produce'}</td>
                      <td className="p-3.5 font-mono text-muted text-[11px]">{p.unitLabel}</td>

                      <td className="p-3.5">
                        <span className="font-mono font-medium text-ink">
                          {formatCurrency(p.price)}
                        </span>
                        {p.compareAtPrice && (
                          <span className="text-[10px] text-muted line-through block font-mono">
                            {formatCurrency(p.compareAtPrice)}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono tabular-nums">
                        <span
                          className={
                            p.stockQuantity === 0
                              ? 'text-red font-bold'
                              : p.stockQuantity <= 10
                              ? 'text-marigold font-bold'
                              : 'text-ink'
                          }
                        >
                          {p.stockQuantity}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <StatusBadge status={p.isActive ? 'Active' : 'Inactive'} size="sm" />
                      </td>

                      <td className="p-3.5 text-muted text-[11px] font-mono whitespace-nowrap">
                        {formatDate(p.updatedAt)}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                            className="p-1.5 rounded-[6px] text-muted hover:text-forest hover:bg-cream transition-colors"
                            title="Edit Produce"
                            aria-label={`Edit ${p.name}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetProduct(p)}
                            className="p-1.5 rounded-[6px] text-muted hover:text-red hover:bg-red/10 transition-colors"
                            title="Delete Produce"
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="p-3.5 bg-[#FAFBF8] border-t border-line flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3 font-mono">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredProducts.length)} of{' '}
            {filteredProducts.length} items
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-ink px-2 text-xs">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedIds={selectedIds}
        allProducts={products}
        categories={categories}
        onClearSelection={() => setSelectedIds([])}
        onBulkUpdate={handleBulkUpdate}
        onBulkDelete={handleBulkDelete}
      />

      {/* Single Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetProduct)}
        onClose={() => setDeleteTargetProduct(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Produce Item?"
        description={`Are you sure you want to delete "${deleteTargetProduct?.name}"? It will be removed from the catalog.`}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};
