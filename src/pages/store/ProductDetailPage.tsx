import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency } from '../../lib/utils';
import { getProductImageUrl } from '../../lib/images';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Share2,
  ZoomIn,
  Plus,
  ChevronDown,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { getProductById, getCategoryById, activeProducts, addToCart } = useAppStore();
  const toast = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'details' | 'reviews'>('desc');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const product = getProductById(productId || '');

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Produce not found"
          description={`We could not locate product ID "${productId}". It may have been unlisted.`}
          actionLabel="Browse Current Harvest"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  const category = getCategoryById(product.categoryId);
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= 10;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const baseImageUrl = getProductImageUrl(product.id, product.image);

  const galleryImages = [
    { label: 'Harvest photo', src: baseImageUrl },
    { label: 'Detail texture', src: baseImageUrl },
    { label: 'Pack view', src: baseImageUrl },
  ];

  const currentImage = galleryImages[activeImageIdx]?.src || baseImageUrl;

  const relatedProducts = activeProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    toast.success('Added to basket', `${quantity}x ${product.name} (${product.unitLabel})`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    navigate('/cart');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Fresh ${product.name} from Annapurna Farm Fresh & Organics`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied', 'Product link copied to clipboard.');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-16 pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-forest transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/shop" className="hover:text-forest transition-colors shrink-0">
          Shop
        </Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              to={`/category/${category.slug}`}
              className="hover:text-forest transition-colors shrink-0"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-ink truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery (4:5 image + thumbnails) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-card overflow-hidden bg-cream border border-line group">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 cursor-zoom-in"
              onClick={() => setIsZoomModalOpen(true)}
            />

            {discountPercent && (
              <span className="absolute top-4 left-4 bg-red text-white text-xs font-semibold px-2.5 py-1 rounded-[4px]">
                {discountPercent}% OFF
              </span>
            )}

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="p-2.5 rounded-[8px] bg-white text-ink border border-line shadow-xs hover:bg-cream transition-colors"
                title="Enlarge photo"
                aria-label="Enlarge"
              >
                <ZoomIn className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-[8px] bg-white text-ink border border-line shadow-xs hover:bg-cream transition-colors"
                title="Share link"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 aspect-[4/5] rounded-[8px] overflow-hidden bg-cream transition-all border ${
                  activeImageIdx === idx
                    ? 'border-forest ring-1 ring-forest'
                    : 'border-line opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img.src}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Buy Box */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                to={category ? `/category/${category.slug}` : '/shop'}
                className="text-[12px] font-semibold text-forest uppercase tracking-eyebrow hover:underline"
              >
                {category?.name || 'Produce'}
              </Link>
              <span className="text-muted">•</span>
              <span className="text-xs text-muted">{product.unitLabel}</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-ink tracking-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-semibold text-ink tabular-nums">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-muted line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Availability Status */}
          <div>
            {isOutOfStock ? (
              <span className="text-xs font-semibold text-red bg-red/10 px-2.5 py-1 rounded-[6px]">
                Sold out in today&apos;s batch
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-semibold text-marigold-dark bg-marigold-light px-2.5 py-1 rounded-[6px]">
                Low stock: {product.stockQuantity} units left
              </span>
            ) : (
              <span className="text-xs font-semibold text-forest bg-mint px-2.5 py-1 rounded-[6px]">
                In stock for morning dispatch
              </span>
            )}
          </div>

          <p className="text-sm text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Stepper + Add / Buy Now */}
          {!isOutOfStock ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Quantity
                </span>
                <QuantityStepper
                  quantity={quantity}
                  max={product.stockQuantity}
                  min={1}
                  onChange={(qty) => setQuantity(qty)}
                  size="md"
                />
                <span className="text-xs text-muted tabular-nums">
                  Subtotal: <strong className="text-ink font-semibold">{formatCurrency(product.price * quantity)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  icon={<Plus className="w-4 h-4" />}
                  className="flex-1"
                >
                  Add to basket
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleBuyNow}
                  className="flex-1"
                >
                  Buy now
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-cream rounded-[10px] border border-line text-xs text-muted">
              <p className="font-semibold text-ink">Produce currently unavailable</p>
              <p className="mt-1">
                Harvest orders for this item are closed for today. Fresh inventory refreshes daily.
              </p>
            </div>
          )}

          {/* Compact Info List (Delivery, Freshness, Returns) */}
          <div className="space-y-3 pt-4 border-t border-line text-xs">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 stroke-[1.5] text-forest shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink">6:00 AM – 9:00 AM Sunrise Delivery</span>
                <p className="text-muted text-[11px]">Free delivery on orders over ₹499 across Delhi NCR.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 stroke-[1.5] text-forest shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink">Cold-Chain Handled</span>
                <p className="text-muted text-[11px]">Rinsed in cold water and packed in breathable eco-crates.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 stroke-[1.5] text-forest shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink">Quality Promise</span>
                <p className="text-muted text-[11px]">If produce does not meet expectations, notify us within 24 hours.</p>
              </div>
            </div>
          </div>

          {/* Accordions: Description, Details, Reviews */}
          <div className="pt-4 border-t border-line space-y-2">
            {/* Description Tab */}
            <div className="border border-line rounded-[10px] overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === 'desc' ? ('' as any) : 'desc')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-ink hover:bg-cream transition-colors"
              >
                <span>Description &amp; Origin</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'desc' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'desc' && (
                <div className="p-4 pt-0 text-xs text-muted leading-relaxed space-y-2 border-t border-line/60">
                  <p>{product.description}</p>
                  <p className="text-[11px] text-forest">
                    Cultivated using natural composting and well-water irrigation. Hand-sorted at regional partner orchards.
                  </p>
                </div>
              )}
            </div>

            {/* Specifications Tab */}
            <div className="border border-line rounded-[10px] overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === 'details' ? ('' as any) : 'details')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-ink hover:bg-cream transition-colors"
              >
                <span>Product Specifications</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'details' && (
                <div className="p-4 pt-0 text-xs text-muted space-y-2 border-t border-line/60">
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span>Pack Unit</span>
                    <span className="font-semibold text-ink">{product.unitLabel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span>Category</span>
                    <span className="font-semibold text-ink">{category?.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Storage</span>
                    <span className="font-semibold text-ink">Store in refrigerator (4–8°C)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Tab */}
            <div className="border border-line rounded-[10px] overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? ('' as any) : 'reviews')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-ink hover:bg-cream transition-colors"
              >
                <span>Customer Notes</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'reviews' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'reviews' && (
                <div className="p-4 pt-0 text-xs text-muted space-y-3 border-t border-line/60">
                  <div className="space-y-1">
                    <div className="flex text-forest">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-ink font-medium leading-relaxed">
                      &ldquo;Crisp, clean taste with noticeable farm freshness. Arrived in the 7 AM morning slot.&rdquo;
                    </p>
                    <span className="text-[11px] text-muted block">Verified household review</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "You May Also Like" 4-Column Grid (No carousel) */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-line space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl sm:text-2xl font-medium text-ink">
              You may also like
            </h3>
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-xs font-semibold text-forest hover:underline"
              >
                More in {category.name}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} layout="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Full-Screen Image Zoom Modal */}
      <Modal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-[10px] overflow-hidden bg-cream flex items-center justify-center">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold text-ink">
              {product.name}
            </span>
            <span>Press Escape to close</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ProductDetailPage;
