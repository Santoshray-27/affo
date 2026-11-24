import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
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
  ArrowLeft,
  Sun,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { getCategoryImageUrl } from '../../lib/images';

const LAYOUT_PREF_KEY = 'ANNAPURNA_SHOP_LAYOUT';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, activeProducts, getCategoryBySlug } = useAppStore();

  const category = getCategoryBySlug(slug || '');

  const queryParam = searchParams.get('q') || '';
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

  const handleLayoutChange = (newLayout: 'grid' | 'list' | 'compact') => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_PREF_KEY, newLayout);
  };

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return activeProducts
      .filter((p) => p.categoryId === category.id)
      .filter((p) => {
        if (queryParam) {
          const matchTitle = p.name.toLowerCase().includes(queryParam.toLowerCase());
          const matchDesc = p.description.toLowerCase().includes(queryParam.toLowerCase());
          if (!matchTitle && !matchDesc) return false;
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
    category,
    activeProducts,
    queryParam,
    inStockOnlyParam,
    onOfferOnlyParam,
    maxPriceParam,
    sortParam,
  ]);

  const activeFilterCount =
    (queryParam ? 1 : 0) +
    (inStockOnlyParam ? 1 : 0) +
    (onOfferOnlyParam ? 1 : 0) +
    (maxPriceParam < 1000 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  if (!category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Category not found"
          description="The harvest category you requested does not exist or has been updated."
          actionLabel="Browse All Produce"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  const catBanner = getCategoryImageUrl(category.slug, category.image);

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 space-y-6 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted">
        <Link to="/" className="hover:text-forest transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
        <Link to="/shop" className="hover:text-forest transition-colors">
          Farm Market
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
        <span className="font-semibold text-ink">{category.name}</span>
      </nav>

      {/* Editorial Category Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-forest-deep text-white min-h-[160px] sm:min-h-[200px] flex items-center border border-line shadow-card">
        <img
          src={catBanner}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-2 text-left">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-lime hover:underline font-semibold font-mono uppercase tracking-wider mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All produce categories</span>
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            {category.description || 'Harvested directly from certified partner orchards and growers.'}
          </p>
        </div>
      </div>

      {/* Browse Toolbar for Category */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-line/80 shadow-2xs p-3.5 sm:p-4 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search within Category */}
          <div className="relative w-full lg:max-w-sm shrink-0">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={queryParam}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder={`Search in ${category.name}...`}
              className="w-full bg-[#FAFBF7] border border-line/80 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 transition-all"
            />
            {queryParam && (
              <button
                type="button"
                onClick={() => updateParam('q', null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sibling Category Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <Link
              to="/shop"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white text-ink border border-line hover:border-forest/50 hover:bg-cream shrink-0 transition-colors"
            >
              All Produce
            </Link>
            {categories.map((c) => {
              const isCurrent = c.id === category.id;
              return (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 select-none ${
                    isCurrent
                      ? 'bg-forest text-white shadow-xs font-semibold'
                      : 'bg-white text-ink border border-line hover:border-forest/50 hover:bg-cream'
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Lower Level: Filters & Layout */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-line/60">
          <div className="flex items-center gap-2.5">
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
              <span>Offers only</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none bg-white border border-line text-xs font-medium rounded-xl pl-3 pr-8 py-2 text-ink focus:outline-none focus:border-forest cursor-pointer shadow-2xs hover:border-forest/40"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="offers">Biggest Discount</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-white border border-line/80 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => handleLayoutChange('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'grid'
                    ? 'bg-mint text-forest font-bold shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="Grid view"
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
      </div>

      {/* Product Grid / List */}
      {categoryProducts.length === 0 ? (
        <div className="py-12 bg-white/70 rounded-2xl border border-line/70">
          <EmptyState
            title="No produce currently matches these filters"
            description="Check back tomorrow for fresh morning harvest updates or clear active filters."
            actionLabel="Clear filters"
            onAction={clearAllFilters}
          />
        </div>
      ) : layout === 'list' ? (
        <div className="space-y-4">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="list" />
          ))}
        </div>
      ) : layout === 'compact' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="compact" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="grid" />
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      <Drawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title={`Filter ${category.name}`}
      >
        <div className="space-y-6 text-xs text-ink text-left">
          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-muted text-[11px] font-mono">
              Availability
            </h4>
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
              <span className="font-medium">Special offers only</span>
            </label>
          </div>

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
              Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply ({categoryProducts.length})
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CategoryPage;
