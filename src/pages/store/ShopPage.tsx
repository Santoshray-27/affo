import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/AppStoreContext';
import { pricingConfig } from '../../config/pricing';
import { ProductCard } from '../../components/storefront/ProductCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Grid3X3,
  X,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Check,
  Sun,
  ArrowUpDown,
} from 'lucide-react';

const LAYOUT_PREF_KEY = 'ANNAPURNA_SHOP_LAYOUT';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeProducts, categories } = useAppStore();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const inStockOnlyParam = searchParams.get('inStock') === 'true';
  const onOfferOnlyParam = searchParams.get('onOffer') === 'true';
  const maxPriceParam = Number(searchParams.get('maxPrice')) || 1000;

  const [layout, setLayout] = useState<'grid' | 'list' | 'compact'>(() => {
    const saved = localStorage.getItem(LAYOUT_PREF_KEY);
    if (saved === 'list' || saved === 'compact' || saved === 'grid') return saved;
    return 'grid';
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Collapsible filter groups inside drawer
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const handleLayoutChange = (newLayout: 'grid' | 'list' | 'compact') => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_PREF_KEY, newLayout);
  };

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || (key === 'category' && value === 'all')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        if (queryParam) {
          const matchTitle = p.name.toLowerCase().includes(queryParam.toLowerCase());
          const matchDesc = p.description.toLowerCase().includes(queryParam.toLowerCase());
          if (!matchTitle && !matchDesc) return false;
        }

        if (categoryParam !== 'all' && p.categoryId !== categoryParam) {
          return false;
        }

        if (inStockOnlyParam && p.stockQuantity <= 0) {
          return false;
        }

        if (onOfferOnlyParam) {
          const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
          if (!hasDiscount) return false;
        }

        if (p.price > maxPriceParam) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortParam === 'price-asc') return a.price - b.price;
        if (sortParam === 'price-desc') return b.price - a.price;
        if (sortParam === 'offers') {
          const discA = a.compareAtPrice ? a.compareAtPrice - a.price : 0;
          const discB = b.compareAtPrice ? b.compareAtPrice - b.price : 0;
          return discB - discA;
        }
        return 0;
      });
  }, [
    activeProducts,
    queryParam,
    categoryParam,
    inStockOnlyParam,
    onOfferOnlyParam,
    maxPriceParam,
    sortParam,
  ]);

  const activeFilterCount =
    (queryParam ? 1 : 0) +
    (categoryParam !== 'all' ? 1 : 0) +
    (inStockOnlyParam ? 1 : 0) +
    (onOfferOnlyParam ? 1 : 0) +
    (maxPriceParam < 1000 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;
  const activeCategoryObj = categories.find((c) => c.id === categoryParam);

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 space-y-6 pb-24">
      {/* ============================================================ */}
      {/* 1. QUIET BREADCRUMBS & SECTION TITLE                         */}
      {/* ============================================================ */}
      <div className="space-y-1.5">
        <nav className="flex items-center gap-1.5 text-xs text-muted">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <span className="text-ink font-medium">Farm Market</span>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
              <span className="text-forest font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              <span className="text-[11.5px] font-mono uppercase tracking-wider text-forest font-semibold">
                Direct Daily Harvest
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-medium text-ink mt-1 tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name : 'Farm fresh produce'}
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl leading-relaxed">
              {activeCategoryObj?.description ||
                'Plucked ripe at dawn across partner farms, ozone bubble rinsed, and dispatched sunrise fresh.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs font-mono text-muted bg-white/80 border border-line/80 px-3 py-1.5 rounded-full shadow-2xs">
              <strong className="text-forest font-semibold">{filteredProducts.length}</strong>{' '}
              {filteredProducts.length === 1 ? 'item' : 'items'} available
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. COMPOSED BROWSE TOOLBAR                                   */}
      {/* Unified search, category chips, filter drawer, & sort        */}
      {/* ============================================================ */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-line/80 shadow-2xs p-3.5 sm:p-4 space-y-3.5">
        {/* Upper Level: Search & Primary Category Navigation */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-sm shrink-0">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={queryParam}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search fruits, greens, herbs, honey..."
              className="w-full bg-[#FAFBF7] border border-line/80 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 transition-all"
            />
            {queryParam && (
              <button
                type="button"
                onClick={() => updateParam('q', null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips Bar: Scrollable with Subtle Indication */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => updateParam('category', 'all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer select-none ${
                categoryParam === 'all'
                  ? 'bg-forest text-white shadow-xs font-semibold'
                  : 'bg-white text-ink border border-line hover:border-forest/50 hover:bg-cream'
              }`}
            >
              All Produce ({activeProducts.length})
            </button>
            {categories.map((cat) => {
              const count = activeProducts.filter((p) => p.categoryId === cat.id).length;
              const isSelected = categoryParam === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateParam('category', cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-forest text-white shadow-xs font-semibold'
                      : 'bg-white text-ink border border-line hover:border-forest/50 hover:bg-cream'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Lower Level: Filter Actions, Sort, & Layout Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-line/60">
          <div className="flex items-center gap-2.5">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                hasActiveFilters
                  ? 'bg-mint text-forest border-forest/40 shadow-xs'
                  : 'bg-white text-ink border-line hover:border-forest/50 hover:bg-cream'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick In-Stock Switch */}
            <button
              type="button"
              onClick={() => updateParam('inStock', inStockOnlyParam ? null : 'true')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                inStockOnlyParam
                  ? 'bg-forest/10 border-forest text-forest font-semibold'
                  : 'bg-white border-line text-muted hover:text-ink'
              }`}
            >
              {inStockOnlyParam && <Check className="w-3 h-3 text-forest" />}
              <span>In-stock only</span>
            </button>

            {/* Quick Offers Switch */}
            <button
              type="button"
              onClick={() => updateParam('onOffer', onOfferOnlyParam ? null : 'true')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                onOfferOnlyParam
                  ? 'bg-red/10 border-red text-red font-semibold'
                  : 'bg-white border-line text-muted hover:text-ink'
              }`}
            >
              {onOfferOnlyParam && <Check className="w-3 h-3 text-red" />}
              <span>Harvest Offers</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Control */}
            <div className="relative">
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none bg-white border border-line text-xs font-medium rounded-xl pl-3 pr-8 py-2 text-ink focus:outline-none focus:border-forest cursor-pointer shadow-2xs hover:border-forest/40"
              >
                <option value="featured">Sort: Featured Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="offers">Biggest Discount</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Layout Switcher (Grid, Dense, List) */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-line/80 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => handleLayoutChange('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'grid'
                    ? 'bg-mint text-forest font-bold shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="Comfortable grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.75]" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange('compact')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'compact'
                    ? 'bg-mint text-forest font-bold shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="Dense view"
                aria-label="Dense view"
              >
                <Grid3X3 className="w-4 h-4 stroke-[1.75]" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'list'
                    ? 'bg-mint text-forest font-bold shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Badges Strip (when filters are applied) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/50">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
              Active filters:
            </span>
            {queryParam && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream border border-line px-2.5 py-1 rounded-full text-ink">
                <span>Keyword: "{queryParam}"</span>
                <button
                  type="button"
                  onClick={() => updateParam('q', null)}
                  className="hover:text-red transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryParam !== 'all' && activeCategoryObj && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream border border-line px-2.5 py-1 rounded-full text-ink">
                <span>Category: {activeCategoryObj.name}</span>
                <button
                  type="button"
                  onClick={() => updateParam('category', 'all')}
                  className="hover:text-red transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnlyParam && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream border border-line px-2.5 py-1 rounded-full text-ink">
                <span>In-stock</span>
                <button
                  type="button"
                  onClick={() => updateParam('inStock', null)}
                  className="hover:text-red transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onOfferOnlyParam && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream border border-line px-2.5 py-1 rounded-full text-ink">
                <span>Special Offers</span>
                <button
                  type="button"
                  onClick={() => updateParam('onOffer', null)}
                  className="hover:text-red transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxPriceParam < 1000 && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream border border-line px-2.5 py-1 rounded-full text-ink">
                <span>Under ₹{maxPriceParam}</span>
                <button
                  type="button"
                  onClick={() => updateParam('maxPrice', null)}
                  className="hover:text-red transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-forest hover:underline font-semibold ml-1 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. PRODUCT COLLECTION                                        */}
      {/* 3-4 products per row desktop, 2-column mobile                */}
      {/* ============================================================ */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 bg-white/70 rounded-2xl border border-line/70">
          <EmptyState
            title="No produce found matching your filters"
            description="Try adjusting your keywords, price range, or clearing current filters."
            actionLabel="Clear all filters"
            onAction={clearAllFilters}
          />
        </div>
      ) : layout === 'list' ? (
        <div className="space-y-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="list" />
          ))}
        </div>
      ) : layout === 'compact' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="compact" />
          ))}
        </div>
      ) : (
        /* Standard 3-4 columns on desktop, 2-column on mobile */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {filteredProducts.map((p, index) => {
            // Subtle promo card after every 8 products
            const showPromo = index > 0 && index % 8 === 0;

            return (
              <React.Fragment key={p.id}>
                {showPromo && (
                  <div className="col-span-2 sm:col-span-2 md:col-span-3 xl:col-span-4 rounded-2xl bg-gradient-to-r from-mint/70 via-cream to-mint/40 border border-line p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-2">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-semibold">
                          Sunrise Farm Dispatch
                        </span>
                      </div>
                      <h3 className="font-heading text-lg sm:text-xl font-medium text-ink">
                        Orders placed by 9 PM arrive at your doorstep by 7 AM tomorrow.
                      </h3>
                      <p className="text-xs text-muted">
                        Zero warehouse holding. Free sunrise delivery automatically applied on orders over ₹
                        {pricingConfig.freeDeliveryThreshold}.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="shrink-0"
                    >
                      Browse top of catalog
                    </Button>
                  </div>
                )}
                <ProductCard product={p} layout="grid" />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. FILTER SLIDE-OVER DRAWER (Desktop & Mobile)               */}
      {/* ============================================================ */}
      <Drawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Harvest"
      >
        <div className="space-y-6 text-xs text-ink text-left">
          {/* Group 1: Category Filter */}
          <div className="space-y-2.5">
            <h4 className="font-semibold uppercase tracking-wider text-muted text-[11px] font-mono">
              Harvest Category
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-cream cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="drawerCategory"
                    checked={categoryParam === 'all'}
                    onChange={() => updateParam('category', 'all')}
                    className="accent-forest"
                  />
                  <span>All Categories</span>
                </span>
                <span className="text-muted font-mono text-[11px]">{activeProducts.length}</span>
              </label>
              {categories.map((c) => {
                const count = activeProducts.filter((p) => p.categoryId === c.id).length;
                return (
                  <label
                    key={c.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-cream cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="drawerCategory"
                        checked={categoryParam === c.id}
                        onChange={() => updateParam('category', c.id)}
                        className="accent-forest"
                      />
                      <span>{c.name}</span>
                    </span>
                    <span className="text-muted font-mono text-[11px]">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Group 2: Availability */}
          <div className="space-y-2.5 pt-4 border-t border-line/60">
            <h4 className="font-semibold uppercase tracking-wider text-muted text-[11px] font-mono">
              Availability &amp; Offers
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={inStockOnlyParam}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 rounded text-forest accent-forest"
                />
                <span className="font-medium">In-stock produce only</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={onOfferOnlyParam}
                  onChange={(e) => updateParam('onOffer', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 rounded text-forest accent-forest"
                />
                <span className="font-medium">Harvest specials &amp; discounts only</span>
              </label>
            </div>
          </div>

          {/* Group 3: Price Range */}
          <div className="space-y-3 pt-4 border-t border-line/60">
            <div className="flex items-center justify-between font-semibold">
              <span className="uppercase tracking-wider text-muted text-[11px] font-mono">
                Maximum Price
              </span>
              <span className="font-mono text-forest font-bold text-sm">₹{maxPriceParam}</span>
            </div>
            <input
              type="range"
              min="30"
              max="1000"
              step="20"
              value={maxPriceParam}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="w-full accent-forest cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted font-mono">
              <span>₹30</span>
              <span>₹1,000</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-line/80 flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                clearAllFilters();
                setFilterDrawerOpen(false);
              }}
            >
              Reset All
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply Filters ({filteredProducts.length})
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ShopPage;
