import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  Droplets,
  Package,
  Truck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { getCategoryImageUrl, getProductImageUrl } from '../../lib/images';

export interface ProcessStep {
  step: string;
  title: string;
  timeframe: string;
  desc: string;
  highlights: string[];
  image: string;
  icon: React.ElementType;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Responsible Sourcing',
    timeframe: 'Day -1 • 4:00 PM Field Harvest',
    desc: 'Cultivated by regional partner growers practicing compost nourishment and clean well-water irrigation across Himachal, Punjab, and Rajasthan.',
    highlights: ['Verified Partner Orchards', 'Living Compost Soil', 'Zero Chemical Ripeners'],
    image: getCategoryImageUrl('vegetables'),
    icon: Sprout,
  },
  {
    step: '02',
    title: 'Batch Quality & Ozone Wash',
    timeframe: '11:00 PM • Quality Sorting',
    desc: 'Produce undergoes cold-water bubble rinsing to eliminate surface dust. Every morning batch is verified for freshness standards.',
    highlights: ['Cold-Water Bubble Rinse', 'Zero Synthetic Wax', 'Lab Verified Batches'],
    image: getProductImageUrl('prod-spinach'),
    icon: Droplets,
  },
  {
    step: '03',
    title: 'Breathable Crate Packing',
    timeframe: '3:30 AM • Dispatch Packing',
    desc: 'Hand-sorted directly into returnable breathable crates and compostable containers, eliminating single-use plastic wrap.',
    highlights: ['Returnable Crates', 'Compostable Liners', 'Zero Moisture Loss'],
    image: getProductImageUrl('prod-apple'),
    icon: Package,
  },
  {
    step: '04',
    title: 'Sunrise Delivery (6–9 AM)',
    timeframe: '6:00 – 9:00 AM • At Your Door',
    desc: 'Dispatched in cold-chain electric delivery vans so your family receives garden-crisp vegetables before the morning rush.',
    highlights: ['Electric Cold-Chain Fleet', 'Guaranteed Morning Slot', 'Contactless Hand-off'],
    image: getProductImageUrl('prod-orange'),
    icon: Truck,
  },
];

// Staggered scroll reveal variants: Step 1 -> 2 -> 3 -> 4
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.12,
    },
  },
};

const stepCardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const ProcessTimelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSteps = PROCESS_STEPS.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through steps unless paused
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % totalSteps);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSteps, activeStep]);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % totalSteps);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  return (
    <section
      id="our-process"
      className="scroll-mt-24 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-line">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              Our process
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-ink mt-2">
            From farm to your door
          </h2>
          <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
            We harvest solely against active daily demand. Zero warehouse holding means produce stays full of natural moisture, taste, and living nutrition.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-forest hover:text-forest-deep underline underline-offset-4 decoration-forest/40 hover:decoration-forest transition-colors inline-flex items-center gap-1.5"
          >
            <span>Browse today&apos;s harvest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Stepper controls */}
          <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-line">
            <button
              onClick={handlePrev}
              aria-label="Previous process step"
              className="w-9 h-9 rounded-full border border-line bg-white hover:bg-cream flex items-center justify-center text-ink hover:text-forest transition-colors shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-muted px-1.5">
              0{activeStep + 1} / 0{totalSteps}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next process step"
              className="w-9 h-9 rounded-full border border-line bg-white hover:bg-cream flex items-center justify-center text-ink hover:text-forest transition-colors shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PERFECTLY ALIGNED 4-COLUMN PROCESS WITH SEQUENTIAL REVEAL    */}
      {/* Step 1 -> Step 2 -> Step 3 -> Step 4                         */}
      {/* ============================================================ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {PROCESS_STEPS.map((s, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          const Icon = s.icon;

          return (
            <motion.div
              key={s.step}
              variants={stepCardVariants}
              className="flex flex-col h-full group"
            >
              {/* TOP: Perfectly Centered Milestone Node + Connecting Rail */}
              <div className="relative mb-6 hidden lg:flex flex-col items-center">
                {/* Horizontal Connecting Rail Line (from this column's center to next column's center) */}
                {idx < totalSteps - 1 && (
                  <div className="absolute top-6 left-1/2 w-[calc(100%+1.5rem)] h-1 -translate-y-1/2 bg-line z-0">
                    <div
                      className="h-full bg-forest transition-all duration-700"
                      style={{
                        width: idx < activeStep ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}

                {/* Milestone Node Button */}
                <button
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className="relative z-10 flex flex-col items-center group/btn focus:outline-none cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-forest border-forest text-white shadow-md ring-4 ring-forest/20 scale-105'
                        : isCompleted
                        ? 'bg-mint border-forest text-forest hover:bg-forest hover:text-white'
                        : 'bg-white border-line text-muted hover:border-forest/50 hover:text-ink'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-forest" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-mono font-semibold uppercase mt-2.5 transition-colors ${
                      isActive ? 'text-forest font-bold' : 'text-muted group-hover/btn:text-ink'
                    }`}
                  >
                    Step {s.step}
                  </span>
                  <span
                    className={`text-xs font-medium text-center mt-0.5 px-2 transition-colors ${
                      isActive ? 'text-ink font-semibold' : 'text-muted group-hover/btn:text-ink'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              </div>

              {/* BOTTOM: Process Step Card (Strictly aligned in the same column) */}
              <div
                onClick={() => setActiveStep(idx)}
                className={`flex-1 flex flex-col justify-between rounded-card border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isActive
                    ? 'bg-white border-forest shadow-card ring-2 ring-forest/20'
                    : 'bg-white/80 hover:bg-white border-line hover:border-forest/40 hover:shadow-soft'
                }`}
              >
                {/* Active Progress Bar Strip */}
                <div className="h-1.5 w-full bg-line overflow-hidden">
                  <div
                    className={`h-full bg-forest transition-all duration-500 ${
                      isActive ? 'w-full' : idx < activeStep ? 'w-full bg-forest/40' : 'w-0'
                    }`}
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Step Tag + Timeframe Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
                        isActive
                          ? 'bg-mint text-forest font-semibold'
                          : 'bg-cream text-muted'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>STEP {s.step}</span>
                    </span>

                    <span className="text-[11px] font-medium text-forest flex items-center gap-1">
                      <Clock className="w-3 h-3 text-leaf" />
                      <span>{s.timeframe.split('•')[0]}</span>
                    </span>
                  </div>

                  {/* Step Image */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-cream border border-line">
                    <img
                      src={s.image}
                      alt={s.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isActive ? 'scale-105' : 'group-hover:scale-102 opacity-90'
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <span className="text-[10.5px] font-medium text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {s.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description with comfortable uniform min-height */}
                  <div>
                    <h3
                      className={`font-heading text-lg font-medium leading-snug transition-colors ${
                        isActive ? 'text-forest font-semibold' : 'text-ink'
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted mt-2 leading-relaxed min-h-[58px]">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Highlights Chips */}
                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-line/60 flex flex-wrap gap-1.5">
                    {s.highlights.map((h, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                          isActive
                            ? 'bg-mint text-forest'
                            : 'bg-cream text-muted'
                        }`}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default ProcessTimelineSection;
