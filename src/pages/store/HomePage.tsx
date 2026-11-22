import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Button } from '../../components/ui/Button';
import { Marquee } from '../../components/ui/Marquee';
import { pricingConfig } from '../../config/pricing';
import { getCategoryImageUrl, getProductImageUrl } from '../../lib/images';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Sprout,
  Gift,
  Wallet,
  Clock,
  Star,
  Check,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProducts, categories } = useAppStore();

  const [activeTab, setActiveTab] = useState<'best-sellers' | 'new-arrivals' | 'offers'>('best-sellers');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Tabbed products (8 products per grid per spec, no carousel)
  const tabProducts = React.useMemo(() => {
    if (activeTab === 'offers') {
      const discounted = activeProducts.filter(
        (p) => p.compareAtPrice && p.compareAtPrice > p.price
      );
      return discounted.length >= 4 ? discounted.slice(0, 8) : activeProducts.slice(0, 8);
    }
    if (activeTab === 'new-arrivals') {
      return [...activeProducts].reverse().slice(0, 8);
    }
    // best-sellers default
    return activeProducts.slice(0, 8);
  }, [activeProducts, activeTab]);

  // Sourcing & Partner farms list for marquee
  const partnerFarms = [
    'Kangra Valley Orchards',
    'Malwa Organic Growers',
    'Kullu Apple Collective',
    'Alwar Bio-Farms',
    'Yamuna Khadir Cooperative',
    'Kotgarh Highland Growers',
    'Doaba Natural Produce',
  ];

  // Testimonials data (concise, realistic quote cards)
  const testimonialsRow1 = [
    {
      name: 'Shalini M.',
      location: 'DLF Phase 5, Gurugram',
      text: 'The spinach and coriander arrived crisp with natural farm freshness. Exactly what morning grocery should be.',
      rating: 5,
    },
    {
      name: 'Raghav K.',
      location: 'Vasant Vihar',
      text: 'Their A2 Bilona Ghee and mustard oils have authentic aroma and purity. Outstanding quality control.',
      rating: 5,
    },
    {
      name: 'Dr. Vivek S.',
      location: 'Sector 62, Noida',
      text: 'The 6 to 9 AM morning dispatch is reliable. Fresh produce on the kitchen counter before breakfast.',
      rating: 5,
    },
    {
      name: 'Ananya P.',
      location: 'GK-II, New Delhi',
      text: 'Clean root vegetables without synthetic wax or chemical smell. Our weekly basket is sorted.',
      rating: 5,
    },
  ];

  const testimonialsRow2 = [
    {
      name: 'Sunil Mehta',
      location: 'Cyber City, Gurugram',
      text: 'Hydroponic butterhead lettuce and heirloom tomatoes in pristine condition. Impressive cold packing.',
      rating: 5,
    },
    {
      name: 'Pooja Iyer',
      location: 'Indirapuram',
      text: 'Wallet checkout takes one tap and morning deliveries are always on time. Highly recommended.',
      rating: 5,
    },
    {
      name: 'Vikram Joshi',
      location: 'Chanakyapuri',
      text: 'Fresh hand-picked Kinnow and Himachal apples. Taste differs noticeably from cold-stored warehouse fruit.',
      rating: 5,
    },
    {
      name: 'Meenakshi R.',
      location: 'Sohna Road',
      text: 'The breathable crates keep greens fresh for days in the refrigerator. Genuine care in packing.',
      rating: 5,
    },
  ];

  // Editorial Recipes (4 items: first card larger per Section 4)
  const recipes = [
    {
      id: 'rec-1',
      title: 'Slow-simmered Sarson Saag with Farm A2 Ghee',
      readTime: '30 min preparation',
      image: getProductImageUrl('prod-ghee'),
      tag: 'Seasonal Main',
    },
    {
      id: 'rec-2',
      title: 'Butterhead Lettuce & Hass Avocado Salad Bowl',
      readTime: '15 min preparation',
      image: getProductImageUrl('prod-avocado'),
      tag: 'Crisp Salad',
    },
    {
      id: 'rec-3',
      title: 'Cold-pressed Gooseberry & Wild Ginger Elixir',
      readTime: '10 min preparation',
      image: getProductImageUrl('prod-amla-shot'),
      tag: 'Daily Tonic',
    },
    {
      id: 'rec-4',
      title: 'Heirloom Tomato & Coriander Village Chutney',
      readTime: '12 min preparation',
      image: getProductImageUrl('prod-tomato'),
      tag: 'Condiment',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* ============================================================ */}
      {/* 1. HERO: SPLIT EDITORIAL LAYOUT (Left 5 cols, Right 7 cols)   */}
      {/* ============================================================ */}
      <section className="pt-8 sm:pt-14 pb-12 sm:pb-16 bg-cream border-b border-line">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left 5 Columns */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
                Farm fresh, delivered
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-medium text-ink leading-[1.08] tracking-tight">
                Fresh from the farm. Clean to the core.
              </h1>

              <p className="font-hindi text-base sm:text-lg text-forest font-medium">
                अन्नपूर्णा – सबके लिए स्वस्थ भोजन
              </p>

              <p className="text-base text-muted max-w-md leading-relaxed">
                Seasonal fruits and vegetables, hand-picked and delivered to your door across Delhi NCR.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/shop')}
                >
                  Shop now
                </Button>
                <a
                  href="#our-process"
                  className="text-sm font-medium text-forest hover:text-forest-deep underline underline-offset-4 decoration-forest/40 hover:decoration-forest transition-colors"
                >
                  Our process
                </a>
              </div>

              {/* Thin Row of 3 Trust Points */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-line text-xs">
                <div className="space-y-1">
                  <Leaf className="w-4 h-4 stroke-[1.5] text-forest" />
                  <div className="font-medium text-ink">Zero Synthetic Wax</div>
                  <div className="text-[11px] text-muted">Cold-water bubble rinse</div>
                </div>
                <div className="space-y-1">
                  <Truck className="w-4 h-4 stroke-[1.5] text-forest" />
                  <div className="font-medium text-ink">6–9 AM Delivery</div>
                  <div className="text-[11px] text-muted">Direct morning dispatch</div>
                </div>
                <div className="space-y-1">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5] text-forest" />
                  <div className="font-medium text-ink">Tested Batches</div>
                  <div className="text-[11px] text-muted">Verified farm harvests</div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Two Overlapping Photos + Small Fresh Stock Card */}
            <div className="lg:col-span-7 relative">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Main Large Photo (4:5) */}
                <div className="col-span-8 aspect-[4/5] rounded-card overflow-hidden bg-mint border border-line shadow-soft">
                  <img
                    src="/images/banners/hero-harvest.jpg"
                    alt="Freshly harvested farm produce"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>

                {/* Overlapping Second Photo */}
                <div className="col-span-4 space-y-4">
                  <div className="aspect-[4/5] rounded-card overflow-hidden bg-cream border border-line shadow-soft">
                    <img
                      src={getCategoryImageUrl('vegetables')}
                      alt="Farm vegetables"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>

                  {/* Discreet Floating Card */}
                  <div className="bg-white p-3.5 rounded-card border border-line shadow-soft">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-leaf" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                        Sunrise Harvest
                      </span>
                    </div>
                    <p className="text-xs text-ink font-medium mt-1">
                      Today&apos;s harvest: fresh stock updated daily
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. BRAND MARQUEE (Large Fraunces type on cream)              */}
      {/* ============================================================ */}
      <section className="py-6 bg-cream border-y border-line overflow-hidden">
        <Marquee speed="slow" pauseOnHover={false} gap="gap-10" fadeColor="from-cream">
          <div className="flex items-center gap-10 font-heading text-2xl sm:text-3xl text-forest font-medium whitespace-nowrap">
            <span>Farm Fresh</span>
            <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
            <span>Organic</span>
            <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
            <span>Hand-picked</span>
            <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
            <span>Delivered with care</span>
            <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
            <span className="font-hindi text-2xl sm:text-3xl">अन्नपूर्णा</span>
            <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
          </div>
        </Marquee>
      </section>

      {/* ============================================================ */}
      {/* 3. CATEGORY BENTO GRID (Asymmetric 12-col layout)            */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              Shop by category
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-ink mt-1">
              Everything fresh, in one place
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-medium text-forest hover:text-forest-deep flex items-center gap-1"
          >
            <span>View all produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento Grid: 6 tiles in asymmetric 12 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Tile 1: Fruits (Large 6 cols x 2 rows) */}
          <Link
            to="/category/fruits"
            className="lg:col-span-6 group relative rounded-card overflow-hidden bg-mint min-h-[260px] sm:min-h-[320px] border border-line"
          >
            <img
              src={getCategoryImageUrl('fruits')}
              alt="Fresh fruits"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs text-white/80">Regional Orchards</span>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-heading text-xl sm:text-2xl font-medium">Fresh Fruits</h3>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 2: Vegetables (6 cols x 1 row) */}
          <Link
            to="/category/vegetables"
            className="lg:col-span-6 group relative rounded-card overflow-hidden bg-cream min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('vegetables')}
              alt="Farm vegetables"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs text-white/80">Daily Soil Harvest</span>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-heading text-lg sm:text-xl font-medium">Farm Vegetables</h3>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 3: Pure Organics (3 cols) */}
          <Link
            to="/category/organics"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-cream min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('organics')}
              alt="Pure organics"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[11px] text-white/80">Certified</span>
              <div className="flex items-center justify-between mt-0.5">
                <h4 className="font-heading text-base font-medium">Organics</h4>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Tile 4: Hydroponics & Exotics (3 cols) */}
          <Link
            to="/category/exotics"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-mint min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('exotics')}
              alt="Exotics and greens"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[11px] text-white/80">Hydroponic</span>
              <div className="flex items-center justify-between mt-0.5">
                <h4 className="font-heading text-base font-medium">Exotics</h4>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Tile 5: Cold-pressed Juices (3 cols) */}
          <Link
            to="/category/juices-beverages"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-cream min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('juices')}
              alt="Cold-pressed juices"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[11px] text-white/80">Raw &amp; Unheated</span>
              <div className="flex items-center justify-between mt-0.5">
                <h4 className="font-heading text-base font-medium">Juices</h4>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Tile 6: Salad Bowls & Dips (3 cols) */}
          <Link
            to="/category/salads-dips"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-mint min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('salads')}
              alt="Salad bowls"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[11px] text-white/80">Ready to Eat</span>
              <div className="flex items-center justify-between mt-0.5">
                <h4 className="font-heading text-base font-medium">Salads &amp; Dips</h4>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURED PRODUCTS (Clean 4-column grid with tabs, no carousel) */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              From our collection
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink mt-1">
              Seasonal harvest picks
            </h2>
          </div>

          {/* Tabs: Best sellers, New arrivals, Offers */}
          <div className="flex items-center gap-1 bg-cream p-1 rounded-[10px] border border-line self-start sm:self-auto">
            {(
              [
                { id: 'best-sellers', label: 'Best sellers' },
                { id: 'new-arrivals', label: 'New arrivals' },
                { id: 'offers', label: 'Special offers' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${
                  activeTab === t.id
                    ? 'bg-white text-ink shadow-xs font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid (8 products) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tabProducts.map((product) => (
            <ProductCard key={product.id} product={product} layout="grid" />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/shop')}
          >
            Explore all {activeProducts.length} items
          </Button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FULL-BLEED PROMO BAND (21:9 ratio photo banner)           */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="relative aspect-[16/7] sm:aspect-[21/9] rounded-card overflow-hidden bg-forest-deep text-white border border-line">
          <img
            src="/images/banners/hero-harvest.jpg"
            alt="Cold winter harvest"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/60 to-transparent p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-lime">
              Seasonal harvest
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium max-w-lg mt-2 leading-tight">
              Himachal apples &amp; winter greens, plucked fresh this morning.
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-md mt-3 leading-relaxed">
              Harvested under 18 hours before dispatch. Order by 9 PM for tomorrow morning delivery.
            </p>
            <div className="pt-5">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/shop')}
              >
                Order seasonal basket
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. STORY SECTION: STICKY SCROLL ("From farm to your door")    */}
      {/* ============================================================ */}
      <section id="our-process" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Sticky Heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-4">
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              Our process
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink leading-tight">
              From farm to your door
            </h2>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              We harvest solely against active daily demand. Zero warehouse holding means produce stays full of natural moisture, taste, and living nutrition.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
              >
                <span>Browse today&apos;s harvest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Steps (Large image + short text) */}
          <div className="lg:col-span-7 space-y-12">
            {[
              {
                step: '01',
                title: 'Responsible Sourcing',
                desc: 'Cultivated by regional partner growers practicing compost nourishment and clean well-water irrigation across Himachal, Punjab, and Rajasthan.',
                image: getCategoryImageUrl('vegetables'),
              },
              {
                step: '02',
                title: 'Batch Quality & Ozone Wash',
                desc: 'Produce undergoes cold-water bubble rinsing to eliminate surface dust. Every morning batch is verified for freshness standards.',
                image: getProductImageUrl('prod-spinach'),
              },
              {
                step: '03',
                title: 'Breathable Crate Packing',
                desc: 'Hand-sorted directly into returnable breathable crates and compostable containers, eliminating single-use plastic wrap.',
                image: getProductImageUrl('prod-apple'),
              },
              {
                step: '04',
                title: 'Sunrise Delivery (6–9 AM)',
                desc: 'Dispatched in cold-chain electric delivery vans so your family receives garden-crisp vegetables before the morning rush.',
                image: getProductImageUrl('prod-orange'),
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-card border border-line overflow-hidden p-6 sm:p-8 space-y-5"
              >
                <div className="aspect-[16/9] rounded-[10px] overflow-hidden bg-cream border border-line">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono font-medium text-forest uppercase tracking-wider">
                    Step {s.step}
                  </span>
                  <h3 className="font-heading text-xl font-medium text-ink mt-1">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. DARK SECTION (Forest-Deep): "Why Annapurna" + Partner Marquee */}
      {/* ============================================================ */}
      <section className="bg-forest-deep text-white py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-lime">
              Why Annapurna
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium mt-1">
              Food grown with patience, not chemicals
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-2">
              Everything we deliver connects back to verified orchards and certified growers.
            </p>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
            <div className="space-y-2">
              <Leaf className="w-5 h-5 stroke-[1.5] text-lime" />
              <h3 className="font-heading text-lg font-medium text-white">Living Organic Soil</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Nourished through vermicompost and traditional crop rotation, preserving natural micronutrients.
              </p>
            </div>

            <div className="space-y-2">
              <ShieldCheck className="w-5 h-5 stroke-[1.5] text-lime" />
              <h3 className="font-heading text-lg font-medium text-white">Batch Verified</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Tested for agrochemical residue limits before cold collection. Clean food for your home.
              </p>
            </div>

            <div className="space-y-2">
              <Clock className="w-5 h-5 stroke-[1.5] text-lime" />
              <h3 className="font-heading text-lg font-medium text-white">Under 18h From Field</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Harvested at dawn and dispatched directly to avoid lengthy wholesale distribution delays.
              </p>
            </div>
          </div>

          {/* Partner Farms Marquee */}
          <div className="pt-8">
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-4 text-center sm:text-left">
              Our partner orchards &amp; growers
            </div>
            <Marquee speed="slow" pauseOnHover={true} gap="gap-8" fadeColor="from-forest-deep">
              <div className="flex items-center gap-8 text-xs text-white/80 font-medium">
                {partnerFarms.map((farm, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-[8px] bg-white/5 border border-white/10"
                  >
                    {farm}
                  </span>
                ))}
              </div>
            </Marquee>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. TWO-UP FEATURE CARDS: Wallet & Referrals                   */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Wallet */}
          <div className="bg-white rounded-card border border-line p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[10px] bg-cream flex items-center justify-center text-forest border border-line">
                <Wallet className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                Convenient checkout
              </span>
              <h3 className="font-heading text-xl font-medium text-ink">
                Your wallet, ready for checkout.
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Store balance for 1-click morning orders. Simple refunds and referral credits credited instantly.
              </p>
            </div>
            <div className="pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/wallet')}
              >
                View wallet balance
              </Button>
            </div>
          </div>

          {/* Card 2: Refer & Earn */}
          <div className="bg-white rounded-card border border-line p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[10px] bg-cream flex items-center justify-center text-forest border border-line">
                <Gift className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                Community programme
              </span>
              <h3 className="font-heading text-xl font-medium text-ink">
                Share Annapurna. Earn rewards.
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Invite neighbors with your personal code. Both receive ₹{pricingConfig.referralRewardAmount} in wallet credits after their first order.
              </p>
            </div>
            <div className="pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/referrals')}
              >
                Get referral link
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. RECIPES / EDITORIAL (Masonry grid of 4 cards, first larger) */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              Farm kitchen
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink mt-1">
              Seasonal recipes &amp; nourishment
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-medium text-forest hover:text-forest-deep flex items-center gap-1"
          >
            <span>Explore produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Cards: First card large (6 cols), remaining three (6 cols stacked or 2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Featured Recipe (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-card border border-line overflow-hidden flex flex-col justify-between group">
            <div className="aspect-[16/10] overflow-hidden bg-cream">
              <img
                src={recipes[0].image}
                alt={recipes[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <span className="font-medium text-forest">{recipes[0].tag}</span>
                <span>•</span>
                <span>{recipes[0].readTime}</span>
              </div>
              <h3 className="font-heading text-xl font-medium text-ink group-hover:text-forest transition-colors">
                {recipes[0].title}
              </h3>
            </div>
          </div>

          {/* Cards 2, 3, 4 (6 cols, 3 smaller items) */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {recipes.slice(1).map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-card border border-line p-3 sm:p-4 flex items-center gap-4 group hover:border-forest/40 transition-colors"
              >
                <div className="w-24 h-24 rounded-[8px] overflow-hidden bg-cream shrink-0">
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-[11px] text-muted">
                    <span className="font-medium text-forest">{rec.tag}</span> • {rec.readTime}
                  </div>
                  <h4 className="font-heading text-sm sm:text-base font-medium text-ink group-hover:text-forest transition-colors leading-snug line-clamp-2">
                    {rec.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. TESTIMONIALS: DUAL-ROW MARQUEE                           */}
      {/* ============================================================ */}
      <section className="py-12 bg-cream border-y border-line overflow-hidden space-y-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-4 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
            Community feedback
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink mt-1">
            Delivered across Delhi NCR
          </h2>
        </div>

        {/* Row 1: Left */}
        <Marquee speed="slow" pauseOnHover={true} gap="gap-4" fadeColor="from-cream">
          <div className="flex items-center gap-4">
            {testimonialsRow1.map((t, idx) => (
              <div
                key={idx}
                className="w-72 sm:w-80 bg-white rounded-card border border-line p-4 space-y-2 text-xs shrink-0"
              >
                <div className="flex text-forest">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-ink leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-2 border-t border-line text-[11px] text-muted">
                  <span className="font-semibold text-ink">{t.name}</span> • {t.location}
                </div>
              </div>
            ))}
          </div>
        </Marquee>

        {/* Row 2: Right (Reverse) */}
        <Marquee speed="slow" direction="right" pauseOnHover={true} gap="gap-4" fadeColor="from-cream">
          <div className="flex items-center gap-4">
            {testimonialsRow2.map((t, idx) => (
              <div
                key={idx}
                className="w-72 sm:w-80 bg-white rounded-card border border-line p-4 space-y-2 text-xs shrink-0"
              >
                <div className="flex text-forest">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-ink leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-2 border-t border-line text-[11px] text-muted">
                  <span className="font-semibold text-ink">{t.name}</span> • {t.location}
                </div>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* ============================================================ */}
      {/* 11. COMPACT NEWSLETTER STRIP                                 */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-card border border-line p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-medium text-ink">
              Weekly harvest bulletin
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Receive updates on seasonal produce, fresh orchard arrivals, and recipe ideas.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-forest bg-mint px-4 py-3 rounded-[10px] border border-line">
                <Check className="w-4 h-4 stroke-[2]" />
                <span>Thank you. You are on the morning harvest list.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-sm w-full">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-cream text-ink text-xs px-4 py-2.5 rounded-[10px] border border-line focus:outline-none focus:border-forest w-full h-11"
                />
                <Button type="submit" variant="primary" size="sm" className="shrink-0 h-11">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
