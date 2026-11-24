import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, Leaf, CheckCircle2 } from 'lucide-react';
import { getCategoryImageUrl } from '../../lib/images';

export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  href: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'fruits',
    name: 'Fresh Fruits',
    shortName: 'Fruits',
    badge: 'Regional Orchards',
    title: 'Fresh Orchard Fruits',
    description: 'Kinnaur apples, Nagpur sweet oranges, Robusta bananas, and seasonal stone fruits plucked ripe from partner trees.',
    highlights: ['Plucked tree-ripe', 'Cold-water bubble rinsed', 'Zero wax coating'],
    image: getCategoryImageUrl('fruits'),
    href: '/category/fruits',
  },
  {
    id: 'vegetables',
    name: 'Farm Vegetables',
    shortName: 'Vegetables',
    badge: 'Daily Soil Harvest',
    title: 'Daily Farm Vegetables',
    description: 'Living spinach, desi tomatoes, crunchy bell peppers, and root vegetables harvested at dawn across Haryana & Punjab.',
    highlights: ['Harvested at 4 AM', 'Ozone bubble cleaned', 'Field temperature dispatch'],
    image: getCategoryImageUrl('vegetables'),
    href: '/category/vegetables',
  },
  {
    id: 'organics',
    name: 'Certified Organics',
    shortName: 'Organics',
    badge: '100% Certified',
    title: 'Certified Pure Organics',
    description: 'Vedic bilona A2 cow ghee, cold-pressed golden mustard oil, raw wild honey, and heirloom stone-ground grains.',
    highlights: ['Chemical-free soil', 'Traditional bilona churning', 'Zero preservatives'],
    image: getCategoryImageUrl('organics'),
    href: '/category/organics',
  },
  {
    id: 'exotics',
    name: 'Hydroponic Exotics',
    shortName: 'Exotics',
    badge: 'Polyhouse Grown',
    title: 'Hydroponic & Exotics',
    description: 'Living butterhead lettuce with root balls, buttery Hass avocados, baby zucchini, and fresh culinary herbs.',
    highlights: ['Clean nutrient-film farming', 'Intact root systems', 'Zero soil residue'],
    image: getCategoryImageUrl('exotics'),
    href: '/category/exotics',
  },
  {
    id: 'juices',
    name: 'Cold-Pressed Juices',
    shortName: 'Juices',
    badge: 'Raw & Unheated',
    title: 'Cold-Pressed Elixirs',
    description: 'Freshly extracted Amla booster shots, citrus cleansers, and wild turmeric tonics bottled cold with zero added water or sugar.',
    highlights: ['Hydraulic cold-pressed', 'Unpasteurized & raw', 'Zero water or sugar'],
    image: getCategoryImageUrl('juices'),
    href: '/category/juices',
  },
  {
    id: 'salads',
    name: 'Salads & Dips',
    shortName: 'Salads & Dips',
    badge: 'Kitchen Ready',
    title: 'Ready-to-Eat Salads & Dips',
    description: 'Pre-washed crisp artisan salad bowls, stone-ground village chutneys, and nourishing seed dressings.',
    highlights: ['Ready to consume', 'Triple-washed greens', 'Stone-ground dressings'],
    image: getCategoryImageUrl('salads'),
    href: '/category/salads-dips',
  },
];

export const CategorySpotlightSection: React.FC = () => {
  // Initially null: ONLY the category top strip is visible
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleCardMouseEnter = (idx: number) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredIndex(idx);
  };

  const handleContainerMouseLeave = () => {
    // 240ms grace period so moving cursor between cards and drawer is ultra smooth
    leaveTimerRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 240);
  };

  const handleDrawerMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleCardClick = (cat: CategoryItem, idx: number) => {
    // On desktop, hover already set hoveredIndex === idx, so clicking navigates directly.
    // On touch devices without hover, first tap opens the pop-out, second tap navigates.
    if (hoveredIndex === idx) {
      navigate(cat.href);
    } else {
      setHoveredIndex(idx);
    }
  };

  const handleClose = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredIndex(null);
  };

  const current = hoveredIndex !== null ? CATEGORIES_DATA[hoveredIndex] : null;

  return (
    <section
      className={`max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 transition-all duration-300 ${
        hoveredIndex !== null ? 'pb-8' : 'pb-2'
      }`}
    >
      {/* ============================================================ */}
      {/* 1. SECTION HEADING: Open & free like Our Process section     */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 pb-5 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              Farm Categories
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-ink mt-2">
            Categories
          </h2>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed sm:text-right">
            Daily harvested organic fruits, farm vegetables, hydroponic exotics, and cold-pressed juices delivered sunrise fresh.
          </p>
          <span className="text-[11px] font-mono text-leaf font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Hover any category to preview harvest details
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INTERACTIVE CONTAINER: Top Strip + Pop-out Underneath     */}
      {/* ============================================================ */}
      <div
        className="relative"
        onMouseLeave={handleContainerMouseLeave}
      >
        {/* TOP STRIP: ALL 6 CATEGORIES AS COMPLETE IMAGE SQUARE CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 relative z-10">
          {CATEGORIES_DATA.map((cat, idx) => {
            const isHovered = idx === hoveredIndex;

            return (
              <div key={cat.id} className="relative flex flex-col items-center">
                <button
                  type="button"
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onFocus={() => handleCardMouseEnter(idx)}
                  onClick={() => handleCardClick(cat, idx)}
                  aria-expanded={isHovered}
                  aria-label={`Category ${cat.name}`}
                  className={`group relative aspect-square w-full rounded-2xl overflow-hidden border transition-all duration-300 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                    isHovered
                      ? 'border-forest ring-3 ring-forest/35 shadow-lg -translate-y-1'
                      : 'border-line/80 hover:border-forest/50 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {/* Complete Image Filling Entire Card */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out ${
                      isHovered ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* Gradient overlay for readability */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isHovered
                        ? 'bg-gradient-to-t from-black/85 via-black/30 to-black/10'
                        : 'bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/80'
                    }`}
                  />

                  {/* Badge Top */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-start">
                    <span
                      className={`text-[9px] sm:text-[9.5px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full tracking-wide truncate max-w-full backdrop-blur-xs transition-colors ${
                        isHovered
                          ? 'bg-mint text-forest font-bold shadow-xs'
                          : 'bg-black/40 text-white/95 group-hover:bg-black/60'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  {/* Category Name Bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 text-left">
                    <span
                      className={`text-xs sm:text-[13px] font-semibold text-white block leading-tight drop-shadow-sm transition-colors ${
                        isHovered ? 'text-lime-300 font-bold' : 'group-hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                </button>

                {/* Subtle downward indicator beacon pointing to the popped-out description */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute -bottom-2.5 z-30 hidden lg:flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-3 h-3 bg-forest rotate-45 rounded-[2px] shadow-sm" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* 3. LOWER SECTION: POPS OUT VERY SMOOTHLY FROM UNDERNEATH     */}
        {/* Revealed on hover with silky accordion slide-down animation  */}
        {/* ============================================================ */}
        <AnimatePresence>
          {current && hoveredIndex !== null && (
            <motion.div
              key="category-popout-drawer"
              initial={{ height: 0, opacity: 0, y: -16 }}
              animate={{
                height: 'auto',
                opacity: 1,
                y: 0,
                transition: {
                  height: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.32, ease: 'easeOut', delay: 0.05 },
                  y: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                y: -12,
                transition: {
                  height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.18, ease: 'easeIn' },
                  y: { duration: 0.22, ease: 'easeIn' },
                },
              }}
              onMouseEnter={handleDrawerMouseEnter}
              className="overflow-hidden relative z-0"
            >
              {/* Divider linking top strip and description */}
              <div className="pt-6 pb-2">
                <div className="relative rounded-2xl bg-gradient-to-br from-cream/90 via-sand/40 to-cream/70 border border-line/80 shadow-soft p-5 sm:p-7 overflow-hidden">
                  {/* Subtle decorative background glow */}
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-forest/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Manual Close Button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
                    title="Collapse preview"
                    aria-label="Collapse preview"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Dynamic Cross-fading Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
                    >
                      {/* Left: Narrative, Highlights & CTAs */}
                      <div className="lg:col-span-8 space-y-4 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-leaf font-semibold flex items-center gap-1.5">
                            <Leaf className="w-3.5 h-3.5" />
                            Category Spotlight • {current.badge}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-line" />
                          <span className="text-[11px] font-mono text-muted">Ready for morning dispatch</span>
                        </div>

                        <h3 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-medium text-ink leading-[1.16] tracking-tight">
                          {current.title}
                        </h3>

                        <p className="text-sm sm:text-[15px] text-muted max-w-xl leading-relaxed">
                          {current.description}
                        </p>

                        {/* Quality Highlights Pills */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {current.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="inline-flex items-center gap-1.5 text-xs text-ink/80 bg-white/80 border border-line/60 rounded-full px-3 py-1 font-sans shadow-2xs"
                            >
                              <CheckCircle2 className="w-3 h-3 text-leaf" />
                              {highlight}
                            </span>
                          ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <Link
                            to={current.href}
                            className="group inline-flex items-center gap-2 rounded-full bg-forest text-white hover:bg-forest-deep text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                          >
                            <span>Explore {current.shortName}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                          <Link
                            to="/shop"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white text-ink border border-line hover:border-forest/40 hover:text-forest text-xs sm:text-sm font-medium px-4.5 py-2.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>View all produce</span>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Scaled Large Image Preview Card */}
                      <div className="lg:col-span-4 flex justify-center lg:justify-end">
                        <Link
                          to={current.href}
                          className="group relative aspect-square w-full max-w-[280px] sm:max-w-[310px] rounded-2xl overflow-hidden bg-mint border border-line shadow-card block"
                          title={`Browse ${current.name}`}
                        >
                          <img
                            src={current.image}
                            alt={current.name}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
                          />

                          {/* Category Badge on Large Image */}
                          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs text-forest text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-line">
                            {current.badge}
                          </div>

                          {/* Bottom gradient hint */}
                          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent p-4 flex items-center justify-between text-white transition-opacity duration-300">
                            <span className="text-[11px] font-medium tracking-wide">
                              Plucked fresh daily
                            </span>
                            <span className="text-[11px] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Browse {current.shortName} <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategorySpotlightSection;