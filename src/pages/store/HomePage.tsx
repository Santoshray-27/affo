import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { pricingConfig } from '../../config/pricing';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Button } from '../../components/ui/Button';
import { Marquee } from '../../components/ui/Marquee';
import { Section } from '../../components/ui/Section';
import { getProductImageUrl, getCategoryImageUrl } from '../../lib/images';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Truck,
  Clock,
  Wallet,
  Gift,
  Star,
  Check,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProducts } = useAppStore();

  const [activeTab, setActiveTab] = useState<'best-sellers' | 'new-arrivals' | 'offers'>('best-sellers');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Products filtered for the 4-column tabs
  const tabProducts = React.useMemo(() => {
    if (activeTab === 'offers') {
      const discounted = activeProducts.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
      return discounted.length >= 4 ? discounted.slice(0, 8) : activeProducts.slice(0, 8);
    }
    if (activeTab === 'new-arrivals') {
      return [...activeProducts].reverse().slice(0, 8);
    }
    // Default best-sellers (first 8)
    return activeProducts.slice(0, 8);
  }, [activeProducts, activeTab]);

  // Partner farms data for marquee
  const partnerFarms = [
    'Himachal Alpine Orchards',
    'Punjab Organic Cluster',
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
      name: 'Kavita Das',
      location: 'South Extension, Delhi',
      text: 'Zero chemical smell on the greens. You can taste the difference in everyday sabzi and salads.',
      rating: 5,
    },
  ];

  // Recipes / Editorial cards
  const recipes = [
    {
      id: 'rec-1',
      title: 'Himachal Crisp Apple & Spiced Walnuts Morning Oats',
      readTime: '10 min preparation',
      image: getProductImageUrl('prod-apple'),
      tag: 'Breakfast Harvest',
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
    <div className="w-full flex flex-col">
      {/* ============================================================ */}
      {/* 1. HERO: SPLIT EDITORIAL LAYOUT (Left 5 cols, Right 7 cols)   */}
      {/* ============================================================ */}
      <Section tone="cream" className="pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-line">
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
                className="text-sm font-semibold text-forest hover:text-forest-deep underline underline-offset-4 decoration-forest/40 hover:decoration-forest transition-colors"
              >
                Our process
              </a>
            </div>

            {/* Row of 3 Trust Points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-line text-xs">
              <div className="space-y-1">
                <Leaf className="w-4 h-4 stroke-[1.5] text-forest" />
                <div className="font-semibold text-ink">Zero Wax</div>
                <div className="text-[11px] text-muted">Cold-water rinse</div>
              </div>
              <div className="space-y-1">
                <Truck className="w-4 h-4 stroke-[1.5] text-forest" />
                <div className="font-semibold text-ink">6–9 AM Delivery</div>
                <div className="text-[11px] text-muted">Direct morning run</div>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 stroke-[1.5] text-forest" />
                <div className="font-semibold text-ink">Tested Batches</div>
                <div className="text-[11px] text-muted">Certified organic</div>
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

                {/* Floating Stock Card */}
                <div className="bg-white p-3.5 rounded-card border border-line shadow-soft">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-leaf" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                      Sunrise Harvest
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium mt-1">
                    Morning batch: stock updated daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 2. BRAND MARQUEE (Large Fraunces type on cream)              */}
      {/* ============================================================ */}
      <div className="w-full py-7 bg-cream border-b border-line overflow-hidden">
        <Marquee duration={45} gap="48px" repeatCount={3} showToggle={true}>
          <div className="flex items-center gap-12 font-heading text-3xl sm:text-4xl text-forest font-medium whitespace-nowrap">
            <span>Farm Fresh</span>
            <Leaf className="w-5 h-5 stroke-[1.5] text-leaf shrink-0" />
            <span>Pure Organic</span>
            <Leaf className="w-5 h-5 stroke-[1.5] text-leaf shrink-0" />
            <span>Hand-picked</span>
            <Leaf className="w-5 h-5 stroke-[1.5] text-leaf shrink-0" />
            <span>Delivered by 9 AM</span>
            <Leaf className="w-5 h-5 stroke-[1.5] text-leaf shrink-0" />
            <span className="font-hindi text-3xl sm:text-4xl">अन्नपूर्णा</span>
            <Leaf className="w-5 h-5 stroke-[1.5] text-leaf shrink-0" />
          </div>
        </Marquee>
      </div>

      {/* ============================================================ */}
      {/* 3. CATEGORY BENTO GRID (Asymmetric 12-col layout)            */}
      {/* ============================================================ */}
      <Section tone="cream" className="py-16 lg:py-24 border-b border-line">
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
            className="text-xs sm:text-sm font-semibold text-forest hover:text-forest-deep flex items-center gap-1"
          >
            <span>View all produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento Grid: 6 tiles in asymmetric 12 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Tile 1: Fruits */}
          <Link
            to="/category/fruits"
            className="lg:col-span-6 group relative rounded-card overflow-hidden bg-mint min-h-[260px] sm:min-h-[320px] border border-line"
          >
            <img
              src={getCategoryImageUrl('fruits')}
              alt="Fresh fruits"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <div className="bg-[#0B3D1A]/85 backdrop-blur-xs p-4 rounded-[10px] border border-white/10 text-[#FAFAF3]">
                <span className="text-xs text-[#C9D8C6] font-medium uppercase tracking-wider block">Regional Orchards</span>
                <div className="flex items-center justify-between mt-1">
                  <h3 className="font-heading text-xl sm:text-2xl font-medium text-[#FAFAF3]">Fresh Fruits</h3>
                  <ArrowRight className="w-5 h-5 text-lime transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile 2: Vegetables */}
          <Link
            to="/category/vegetables"
            className="lg:col-span-6 group relative rounded-card overflow-hidden bg-cream min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('vegetables')}
              alt="Farm vegetables"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <div className="bg-[#0B3D1A]/85 backdrop-blur-xs p-4 rounded-[10px] border border-white/10 text-[#FAFAF3]">
                <span className="text-xs text-[#C9D8C6] font-medium uppercase tracking-wider block">Daily Soil Harvest</span>
                <div className="flex items-center justify-between mt-1">
                  <h3 className="font-heading text-lg sm:text-xl font-medium text-[#FAFAF3]">Farm Vegetables</h3>
                  <ArrowRight className="w-4 h-4 text-lime transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile 3: Pure Organics */}
          <Link
            to="/category/organics"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-cream min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('organics')}
              alt="Pure organics"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
              <div className="bg-[#0B3D1A]/85 backdrop-blur-xs p-3 rounded-[8px] border border-white/10 text-[#FAFAF3]">
                <span className="text-[11px] text-[#C9D8C6] uppercase tracking-wider block">Certified</span>
                <div className="flex items-center justify-between mt-0.5">
                  <h4 className="font-heading text-base font-medium text-[#FAFAF3]">Organics</h4>
                  <ArrowRight className="w-4 h-4 text-lime" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile 4: Hydroponics & Exotics */}
          <Link
            to="/category/exotics"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-mint min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('exotics')}
              alt="Exotics and greens"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
              <div className="bg-[#0B3D1A]/85 backdrop-blur-xs p-3 rounded-[8px] border border-white/10 text-[#FAFAF3]">
                <span className="text-[11px] text-[#C9D8C6] uppercase tracking-wider block">Hydroponic</span>
                <div className="flex items-center justify-between mt-0.5">
                  <h4 className="font-heading text-base font-medium text-[#FAFAF3]">Exotics</h4>
                  <ArrowRight className="w-4 h-4 text-lime" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile 5: Cold-pressed Juices */}
          <Link
            to="/category/juices-beverages"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-cream min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('juices')}
              alt="Cold-pressed juices"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
              <div className="bg-[#0B3D1A]/85 backdrop-blur-xs p-3 rounded-[8px] border border-white/10 text-[#FAFAF3]">
                <span className="text-[11px] text-[#C9D8C6] uppercase tracking-wider block">Raw &amp; Unheated</span>
                <div className="flex items-center justify-between mt-0.5">
                  <h4 className="font-heading text-base font-medium text-[#FAFAF3]">Juices</h4>
                  <ArrowRight className="w-4 h-4 text-lime" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile 6: Salad Bowls */}
          <Link
            to="/category/salads-dips"
            className="lg:col-span-3 group relative rounded-card overflow-hidden bg-mint min-h-[200px] border border-line"
          >
            <img
              src={getCategoryImageUrl('salads')}
              alt="Salad bowls"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
              <div className="bg-[#0B3D1A]/85 backdrop-blur-xs p-3 rounded-[8px] border border-white/10 text-[#FAFAF3]">
                <span className="text-[11px] text-[#C9D8C6] uppercase tracking-wider block">Ready to Eat</span>
                <div className="flex items-center justify-between mt-0.5">
                  <h4 className="font-heading text-base font-medium text-[#FAFAF3]">Salads &amp; Dips</h4>
                  <ArrowRight className="w-4 h-4 text-lime" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 4. FEATURED PRODUCTS (Clean 4-column grid with tabs)         */}
      {/* ============================================================ */}
      <Section tone="white" className="py-16 lg:py-24 border-b border-line">
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
                className={`px-3.5 py-1.5 text-xs rounded-[8px] transition-colors ${
                  activeTab === t.id
                    ? 'bg-white text-ink shadow-xs font-semibold'
                    : 'text-muted hover:text-ink font-medium'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid */}
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
      </Section>

      {/* ============================================================ */}
      {/* 5. FULL-BLEED PROMO BAND (21:9 ratio photo banner)           */}
      {/* ============================================================ */}
      <Section tone="cream" className="py-16 lg:py-24 border-b border-line">
        <div className="relative aspect-[16/8] sm:aspect-[21/9] rounded-card overflow-hidden bg-forest-deep text-white border border-line">
          <img
            src="/images/banners/hero-harvest.jpg"
            alt="Cold winter harvest"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/75 to-transparent p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-lime">
              Seasonal harvest
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium max-w-lg mt-2 leading-tight text-white">
              Himachal apples &amp; winter greens, plucked fresh this morning.
            </h3>
            <p className="text-xs sm:text-sm text-on-dark-muted max-w-md mt-3 leading-relaxed">
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
      </Section>

      {/* ============================================================ */}
      {/* 6. STICKY STORY SECTION (4 steps: Farm -> Check -> Pack -> Door) */}
      {/* ============================================================ */}
      <Section tone="white" id="our-process" className="py-16 lg:py-24 border-b border-line">
        <div className="max-w-xl mb-12">
          <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
            How it works
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink mt-1">
            From orchard trees to your doorstep in 18 hours
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            No long-term cold store inventory. When you order, it is plucked, inspected, and packed.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Plucked at Dawn',
              desc: 'Harvested early morning when sugar and moisture balance is naturally at its peak.',
              image: getProductImageUrl('prod-apple'),
            },
            {
              step: '02',
              title: 'Cold-Water Inspection',
              desc: 'Bubble rinsed with chilled water. No paraffin wax, artificial shines, or chemical dips.',
              image: getProductImageUrl('prod-tomato'),
            },
            {
              step: '03',
              title: 'Earth-Friendly Packing',
              desc: 'Packed in breathable kraft paper crates and cotton bags for maximum freshness.',
              image: getProductImageUrl('prod-banana'),
            },
            {
              step: '04',
              title: 'Sunrise Delivery',
              desc: 'Direct morning dispatch so your family receives garden-crisp produce before breakfast.',
              image: getProductImageUrl('prod-orange'),
            },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-cream/40 rounded-card border border-line overflow-hidden p-6 space-y-4"
            >
              <div className="aspect-[16/10] rounded-[10px] overflow-hidden bg-cream border border-line">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold text-forest uppercase tracking-wider">
                  Step {s.step}
                </span>
                <h3 className="font-heading text-lg font-medium text-ink mt-1">
                  {s.title}
                </h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 7. DARK SECTION (Forest-Deep): "Why Annapurna" + Partner Marquee */}
      {/* ============================================================ */}
      <Section tone="dark" className="py-16 lg:py-24 border-b border-white/10">
        <div className="max-w-xl mb-12">
          <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-lime">
            Why Annapurna
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium mt-1 text-on-dark">
            Food grown with patience, not chemicals
          </h2>
          <p className="text-xs sm:text-sm text-on-dark-muted mt-2">
            Everything we deliver connects back to verified orchards and certified growers.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="space-y-2">
            <Leaf className="w-5 h-5 stroke-[1.5] text-lime" />
            <h3 className="font-heading text-lg font-medium text-on-dark">Living Organic Soil</h3>
            <p className="text-xs text-on-dark-muted leading-relaxed">
              Nourished through vermicompost and traditional crop rotation, preserving natural micronutrients.
            </p>
          </div>

          <div className="space-y-2">
            <ShieldCheck className="w-5 h-5 stroke-[1.5] text-lime" />
            <h3 className="font-heading text-lg font-medium text-on-dark">Batch Verified</h3>
            <p className="text-xs text-on-dark-muted leading-relaxed">
              Tested for agrochemical residue limits before cold collection. Clean food for your home.
            </p>
          </div>

          <div className="space-y-2">
            <Clock className="w-5 h-5 stroke-[1.5] text-lime" />
            <h3 className="font-heading text-lg font-medium text-on-dark">Under 18h From Field</h3>
            <p className="text-xs text-on-dark-muted leading-relaxed">
              Harvested at dawn and dispatched directly to avoid lengthy wholesale distribution delays.
            </p>
          </div>
        </div>

        {/* Partner Farms Marquee */}
        <div className="pt-8">
          <div className="text-[11px] font-mono uppercase tracking-wider text-on-dark-muted mb-4 text-center sm:text-left">
            Our partner orchards &amp; growers
          </div>
          <Marquee duration={50} direction="right" gap="32px" repeatCount={3}>
            <div className="flex items-center gap-6 text-xs text-on-dark font-medium">
              {partnerFarms.map((farm, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-[8px] bg-white/10 border border-white/20 whitespace-nowrap"
                  style={{ borderColor: 'rgba(250,250,243,0.25)' }}
                >
                  {farm}
                </span>
              ))}
            </div>
          </Marquee>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 8. TWO-UP FEATURE CARDS: Wallet & Referrals                   */}
      {/* ============================================================ */}
      <Section tone="cream" className="py-16 lg:py-24 border-b border-line">
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
                variant="secondary"
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
                variant="secondary"
                size="sm"
                onClick={() => navigate('/referrals')}
              >
                Get referral link
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 9. RECIPES / EDITORIAL (Masonry grid of 4 cards)             */}
      {/* ============================================================ */}
      <Section tone="white" className="py-16 lg:py-24 border-b border-line">
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
            className="text-xs sm:text-sm font-semibold text-forest hover:text-forest-deep flex items-center gap-1"
          >
            <span>Explore produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Cards: First card large (6 cols), remaining three (6 cols stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Featured Recipe (6 cols) */}
          <div className="md:col-span-6 bg-cream/40 rounded-card border border-line overflow-hidden flex flex-col justify-between group">
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
                <span className="font-semibold text-forest">{recipes[0].tag}</span>
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
            {recipes.slice(1).map((r) => (
              <div
                key={r.id}
                className="bg-cream/40 rounded-card border border-line p-4 flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-[8px] overflow-hidden bg-cream shrink-0 border border-line">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span className="font-semibold text-forest">{r.tag}</span>
                    <span>•</span>
                    <span>{r.readTime}</span>
                  </div>
                  <h4 className="font-heading text-base font-medium text-ink group-hover:text-forest transition-colors">
                    {r.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 10. TESTIMONIALS: DUAL-ROW MARQUEE (Aligned, 340px cards)    */}
      {/* ============================================================ */}
      <div className="w-full py-16 lg:py-24 bg-cream border-b border-line overflow-hidden space-y-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-4 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
            Community feedback
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink mt-1">
            Delivered across Delhi NCR
          </h2>
        </div>

        {/* Row 1: Left (60s) */}
        <Marquee duration={60} direction="left" gap="24px" repeatCount={2}>
          <div className="flex items-stretch gap-6">
            {testimonialsRow1.map((t, idx) => (
              <div
                key={idx}
                className="w-[340px] min-h-[160px] bg-white rounded-card border border-line p-5 flex flex-col justify-between shrink-0 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex text-forest">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ink leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="pt-3 border-t border-line text-[11px] text-muted mt-2">
                  <span className="font-semibold text-ink">{t.name}</span> • {t.location}
                </div>
              </div>
            ))}
          </div>
        </Marquee>

        {/* Row 2: Right (70s) */}
        <Marquee duration={70} direction="right" gap="24px" repeatCount={2}>
          <div className="flex items-stretch gap-6">
            {testimonialsRow2.map((t, idx) => (
              <div
                key={idx}
                className="w-[340px] min-h-[160px] bg-white rounded-card border border-line p-5 flex flex-col justify-between shrink-0 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex text-forest">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ink leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="pt-3 border-t border-line text-[11px] text-muted mt-2">
                  <span className="font-semibold text-ink">{t.name}</span> • {t.location}
                </div>
              </div>
            ))}
          </div>
        </Marquee>
      </div>

      {/* ============================================================ */}
      {/* 11. COMPACT NEWSLETTER STRIP (White input, visible CTA)       */}
      {/* ============================================================ */}
      <Section tone="cream" className="py-16 lg:py-24">
        <div className="bg-white rounded-card border border-line p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
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
                  className="bg-white text-ink text-xs px-4 py-2.5 rounded-[10px] border border-line focus:outline-none focus:border-forest w-full h-12"
                />
                <Button type="submit" variant="primary" size="md" className="shrink-0 h-12">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
