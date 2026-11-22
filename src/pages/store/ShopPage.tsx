import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  Tag,
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

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Collapsible sidebar groups
  const [categoryOpen, setCategoryOpen] = useState(true);
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Breadcrumb & Title */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-2">
          <Link to="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-medium">Shop</span>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-forest font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-ink">
              {activeCategoryObj ? activeCategoryObj.name : 'Farm fresh produce'}
            </h1>
            <p className="text-xs text-muted mt-1">
              {filteredProducts.length} items available for morning delivery
            </p>
          </div>

          {/* Search bar inside page */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={queryParam}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search produce..."
              className="w-full bg-white border border-line rounded-[10px] pl-10 pr-8 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-forest"
            />
            {queryParam && (
              <button
                onClick={() => updateParam('q', null)}
                className="absolute right-3 top-2.5 text-muted hover:text-ink"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Chips Row (pills allowed for filter chips per rule) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => updateParam('category', 'all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
            categoryParam === 'all'
              ? 'bg-forest text-white'
              : 'bg-white text-ink border border-line hover:border-forest'
          }`}
        >
          All ({activeProducts.length})
        </button>
        {categories.map((cat) => {
          const count = activeProducts.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                categoryParam === cat.id
                  ? 'bg-forest text-white'
                  : 'bg-white text-ink border border-line hover:border-forest'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Layout: Left Sticky Filters (260px) + Right Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Filter Column (260px on desktop) */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3 sticky top-24 space-y-4">
          <div className="bg-white rounded-card border border-line p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="font-heading font-medium text-sm text-ink">
                Filter Harvest
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-forest hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {/* Group 1: Availability */}
            <div className="space-y-3 pb-3 border-b border-line">
              <button
                onClick={() => setAvailabilityOpen(!availabilityOpen)}
                className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted text-left"
              >
                <span>Availability</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    availabilityOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {availabilityOpen && (
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-ink select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnlyParam}
                      onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                      className="w-4 h-4 rounded-[4px] text-forest focus:ring-forest accent-forest"
                    />
                    <span>In-stock only</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-ink select-none">
                    <input
                      type="checkbox"
                      checked={onOfferOnlyParam}
                      onChange={(e) => updateParam('onOffer', e.target.checked ? 'true' : null)}
                      className="w-4 h-4 rounded-[4px] text-forest focus:ring-forest accent-forest"
                    />
                    <span>Special offers only</span>
                  </label>
                </div>
              )}
            </div>

            {/* Group 2: Price Range */}
            <div className="space-y-3">
              <button
                onClick={() => setPriceOpen(!priceOpen)}
                className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted text-left"
              >
                <span>Price range</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    priceOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {priceOpen && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink">
                    <span>Up to:</span>
                    <span className="font-mono text-forest">₹{maxPriceParam}</span>
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
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: Toolbar + Product Grid */}
        <div className="md:col-span-9 lg:col-span-9 space-y-6">
          {/* Toolbar: Sort + View Switcher (Grid 3, Grid 4, List) */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFilterOpen(true)}
                icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                className="md:hidden"
              >
                Filters {hasActiveFilters ? `(${activeFilterCount})` : ''}
              </Button>

              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-white border border-line text-xs rounded-[10px] px-3 py-2 font-medium text-ink focus:outline-none focus:border-forest cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* View switcher icon buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-line rounded-[10px] p-1">
              <button
                onClick={() => handleLayoutChange('grid')}
                className={`p-1.5 rounded-[6px] transition-colors ${
                  layout === 'grid'
                    ? 'bg-cream text-forest font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => handleLayoutChange('compact')}
                className={`p-1.5 rounded-[6px] transition-colors ${
                  layout === 'compact'
                    ? 'bg-cream text-forest font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
                title="Dense view"
                aria-label="Dense view"
              >
                <Grid3X3 className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => handleLayoutChange('list')}
                className={`p-1.5 rounded-[6px] transition-colors ${
                  layout === 'list'
                    ? 'bg-cream text-forest font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Product Grid / List with inline promo card after 8 products */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No produce found matching your filters"
              description="Try adjusting your keywords, price range, or clearing current filters."
              actionLabel="Clear all filters"
              onAction={clearAllFilters}
            />
          ) : layout === 'list' ? (
            <div className="space-y-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} layout="list" />
              ))}
            </div>
          ) : layout === 'compact' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} layout="compact" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p, index) => {
                // Section 5: Insert one inline promo card after every 8 products
                const showPromo = index > 0 && index % 8 === 0;
                return (
                  <React.Fragment key={p.id}>
                    {showPromo && (
                      <div className="col-span-full sm:col-span-2 lg:col-span-3 bg-mint rounded-card border border-line p-6 flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                            Sunrise Delivery
                          </span>
                          <h3 className="font-heading text-lg font-medium text-ink">
                            Orders placed by 9 PM arrive by 7 AM tomorrow.
                          </h3>
                          <p className="text-xs text-muted">
                            Free delivery automatically applied on carts over ₹{pricingConfig.freeDeliveryThreshold}.
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="shrink-0"
                        >
                          Back to top
                        </Button>
                      </div>
                    )}
                    <ProductCard product={p} layout="grid" />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Produce"
      >
        <div className="space-y-6 text-xs text-ink">
          {/* Availability */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-muted text-[11px]">
              Availability
            </h4>
            <label className="flex items-center gap-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={inStockOnlyParam}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                className="w-4 h-4 rounded text-forest accent-forest"
              />
              <span>In-stock produce only</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={onOfferOnlyParam}
                onChange={(e) => updateParam('onOffer', e.target.checked ? 'true' : null)}
                className="w-4 h-4 rounded text-forest accent-forest"
              />
              <span>Special offers only</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-line">
            <div className="flex items-center justify-between font-semibold">
              <span>Maximum Price</span>
              <span className="font-mono text-forest">₹{maxPriceParam}</span>
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
          </div>

          <div className="pt-4 border-t border-line flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default ShopPage;
