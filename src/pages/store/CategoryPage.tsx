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
  ChevronDown,
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

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted">
        <Link to="/" className="hover:text-forest transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-forest transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-ink">{category.name}</span>
      </nav>

      {/* Editorial Category Header Banner */}
      <div className="relative rounded-card overflow-hidden bg-forest-deep text-white min-h-[160px] sm:min-h-[200px] flex items-center border border-line">
        <img
          src={catBanner}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs text-lime hover:underline font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All categories</span>
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {category.description || 'Harvested directly from certified partner orchards and growers.'}
          </p>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <Link
          to="/shop"
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-ink border border-line hover:border-forest shrink-0 transition-colors"
        >
          All Produce
        </Link>
        {categories.map((c) => {
          const isCurrent = c.id === category.id;
          return (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                isCurrent
                  ? 'bg-forest text-white'
                  : 'bg-white text-ink border border-line hover:border-forest'
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      {/* Toolbar: Sort & Layout */}
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

          <span className="text-xs text-muted hidden sm:inline">
            {categoryProducts.length} items
          </span>
        </div>

        {/* View Switcher */}
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

      {/* Product Grid / List */}
      {categoryProducts.length === 0 ? (
        <EmptyState
          title="No produce currently in stock for this category"
          description="Check back tomorrow for fresh morning harvest updates or browse other categories."
          actionLabel="View All Produce"
          onAction={() => navigate('/shop')}
        />
      ) : layout === 'list' ? (
        <div className="space-y-4">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="list" />
          ))}
        </div>
      ) : layout === 'compact' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="compact" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="grid" />
          ))}
        </div>
      )}

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Category"
      >
        <div className="space-y-6 text-xs text-ink">
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
              Apply
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default CategoryPage;
