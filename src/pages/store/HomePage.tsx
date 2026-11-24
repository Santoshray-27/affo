import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/AppStoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { HeroSection } from '../../components/storefront/HeroSection';
import { CategorySpotlightSection } from '../../components/storefront/CategorySpotlightSection';
import { SeasonalRecipesSection } from '../../components/storefront/SeasonalRecipesSection';
import { HarvestBeltSection } from '../../components/storefront/HarvestBeltSection';
import { ProcessTimelineSection } from '../../components/storefront/ProcessTimelineSection';
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

  // Smooth, calm section-by-section scroll reveal (not abrupt or complicated)
  const sectionReveal = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* ============================================================ */}
      {/* 1. HERO + BRAND MARQUEE + CATEGORIES (Gap closed completely)  */}
      {/* ============================================================ */}
      <div>
        <div className="bg-cream border-b border-line">
          {/* Full-width Immersive Visual Hero */}
          <HeroSection />

          {/* Attached Marquee ribbon directly under Hero without gap */}
          <section className="py-3.5 sm:py-4 border-t border-line overflow-hidden">
            <Marquee speed="slow" pauseOnHover={false} gap="gap-10" fadeColor="from-cream">
              <div className="flex items-center gap-10 font-heading text-xl sm:text-2xl text-forest font-medium whitespace-nowrap">
                <span>Farm Fresh</span>
                <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
                <span>Organic</span>
                <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
                <span>Hand-picked</span>
                <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
                <span>Delivered with care</span>
                <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
                <span className="font-hindi text-xl sm:text-2xl">अन्नपूर्णा</span>
                <Leaf className="w-4 h-4 stroke-[1.5] text-leaf shrink-0" />
              </div>
            </Marquee>
          </section>
        </div>

        {/* 2. CATEGORY SPOTLIGHT (Smooth scroll reveal attached below marquee) */}
        <motion.div {...sectionReveal} className="pt-2 sm:pt-3">
          <CategorySpotlightSection />
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* 4. FRESH HARVEST BELT (Dish Orbit Carousel)                  */}
      {/* ============================================================ */}
      <motion.div {...sectionReveal} className="!mt-4 sm:!mt-6">
        <HarvestBeltSection />
      </motion.div>

      {/* ============================================================ */}
      {/* 4. FEATURED PRODUCTS (Clean 4-column grid with tabs, no carousel) */}
      {/* ============================================================ */}
      <motion.section
        {...sectionReveal}
        className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12"
      >
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
                className={`px-3.5 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${activeTab === t.id
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
      </motion.section>

      {/* ============================================================ */}
      {/* 5. FARM KITCHEN: SEASONAL RECIPES CONVEYOR BELT (+5% SCALE)  */}
      {/* ============================================================ */}
      <motion.div {...sectionReveal}>
        <SeasonalRecipesSection />
      </motion.div>

      {/* ============================================================ */}
      {/* 6. FULL-BLEED PROMO BAND (21:9 ratio photo banner)           */}
      {/* ============================================================ */}
      <motion.section
        {...sectionReveal}
        className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12"
      >
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
      </motion.section>

      {/* ============================================================ */}
      {/* 6. OUR PROCESS: ANIMATED TIMELINE (Sequential 1->2->3->4)    */}
      {/* ============================================================ */}
      <ProcessTimelineSection />

      {/* ============================================================ */}
      {/* 7. DARK SECTION (Forest-Deep): "Why Annapurna" + Partner Marquee */}
      {/* ============================================================ */}
      <motion.section
        {...sectionReveal}
        className="bg-forest-deep text-white py-16 lg:py-20"
      >
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
      </motion.section>

      {/* ============================================================ */}
      {/* 8. TWO-UP FEATURE CARDS: Wallet & Referrals                   */}
      {/* ============================================================ */}
      <motion.section
        {...sectionReveal}
        className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12"
      >
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
      </motion.section>

      {/* ============================================================ */}
      {/* 9. TESTIMONIALS: DUAL-ROW MARQUEE                            */}
      {/* ============================================================ */}
      <motion.section
        {...sectionReveal}
        className="py-12 bg-cream border-y border-line overflow-hidden space-y-4"
      >
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-4 text-center">
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
      </motion.section>

      {/* ============================================================ */}
      {/* 11. COMPACT NEWSLETTER STRIP                                 */}
      {/* ============================================================ */}
      <motion.section
        {...sectionReveal}
        className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12"
      >
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
      </motion.section>
    </div>
  );
};
export default HomePage;
