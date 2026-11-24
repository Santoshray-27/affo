import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Leaf,
  Sprout,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure background video plays automatically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const trustIndicators = [
    {
      title: 'Zero Synthetic Wax',
      desc: 'Cold-water bubble rinse',
      icon: Leaf,
    },
    {
      title: '6–9 AM Delivery',
      desc: 'Direct morning dispatch',
      icon: Truck,
    },
    {
      title: 'Tested Batches',
      desc: 'Verified farm harvests',
      icon: ShieldCheck,
    },
    {
      title: 'Farm Fresh',
      desc: 'From our partner farms',
      icon: Sprout,
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-forest-deep">
      {/* ============================================================ */}
      {/* 1. CINEMATIC AUTOPLAY BACKGROUND VIDEO                       */}
      {/* ============================================================ */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        {/* Poster / Photo Fallback */}
        <img
          src="/images/hero/farm-sunrise-hero.jpg"
          alt="Annapurna farm sunrise background"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Real Autoplay Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/farm-sunrise-hero.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
        >
          <source src="/videos/hero-farm-bg.mp4" type="video/mp4" />
          <source src="/videos/mixkit-crops-watering.mp4" type="video/mp4" />
        </video>

        {/* Golden-Hour Sunlight Flare Top-Right */}
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-300/35 via-amber-200/10 to-transparent mix-blend-screen pointer-events-none" />

        {/* Left Dark Gradient for High-Contrast Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/75 md:via-forest-deep/50 lg:via-forest-deep/30 to-transparent" />

        {/* Subtle top & bottom shadow gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/30" />
      </div>

      {/* ============================================================ */}
      {/* 2. HERO CONTENT CONTAINER                                    */}
      {/* ============================================================ */}
      <div className="relative max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-12 lg:pt-16 pb-14 sm:pb-20 lg:pb-28">
        <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5 text-left z-10">
            
            {/* A. Brand Logo: Direct transparent brand identity with random organic cloud glow */}
            <div className="relative inline-block transition-transform duration-300 hover:scale-[1.02]">
              {/* Layer 1: Random organic amorphous glow */}
              <div
                className="absolute -inset-3 bg-white/90 blur-lg pointer-events-none shadow-sm"
                style={{
                  borderRadius: '42% 58% 70% 30% / 45% 35% 65% 55%',
                  transform: 'scale(1.06) rotate(3deg)',
                }}
              />
              {/* Layer 2: Counter-rotated organic blob to create a truly random, non-defined cloud shape */}
              <div
                className="absolute -inset-2 bg-white/85 blur-md pointer-events-none"
                style={{
                  borderRadius: '58% 42% 35% 65% / 40% 65% 35% 60%',
                  transform: 'scale(1.02) rotate(-7deg)',
                }}
              />
              <img
                src="/brand/hero-logo.png"
                alt="Annapurna Farm Fresh & Organics"
                className="relative z-10 w-56 sm:w-64 lg:w-72 h-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] brightness-105"
              />
            </div>

            {/* B. Eyebrow Text with Decorative Separator Lines */}
            <div className="flex items-center gap-3 text-white/95 w-fit">
              <span className="w-8 sm:w-12 h-px bg-white/60" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-sans drop-shadow-sm whitespace-nowrap">
                Farm Fresh, Delivered
              </span>
              <span className="w-8 sm:w-12 h-px bg-white/60" />
            </div>

            {/* C. Main Headline with Hand-drawn Green Curve Underneath */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-medium text-white leading-[1.08] tracking-tight drop-shadow-md">
              Fresh from the farm. <br />
              <span className="relative inline-block text-white font-normal">
                Clean to the core.
                {/* Organic Green Brush Stroke */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-leaf"
                  viewBox="0 0 240 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 11C60 3 150 2 236 12"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* D. Hindi Supporting Line in Warm Golden Yellow */}
            <p className="font-hindi text-lg sm:text-xl text-amber-300 font-medium tracking-wide drop-shadow-sm">
              अन्नपूर्णा – सबके लिए स्वस्थ भोजन
            </p>

            {/* E. Description */}
            <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed font-sans font-normal drop-shadow-xs">
              Seasonal fruits and vegetables, hand-picked and delivered to your door across Delhi NCR.
            </p>

            {/* F. Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary CTA: Coral-Red Pill */}
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="group inline-flex items-center gap-2 rounded-full bg-red hover:bg-red-hover text-white text-sm sm:text-base font-semibold px-6 sm:px-7 py-3 sm:py-3.5 shadow-lg shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA: Translucent Outlined Pill */}
              <a
                href="#our-process"
                className="group inline-flex items-center gap-2 rounded-full border border-white/60 hover:border-white bg-black/25 hover:bg-black/40 backdrop-blur-xs text-white text-sm sm:text-base font-medium px-5 sm:px-6 py-3 sm:py-3.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md"
              >
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-lime-300 transition-transform duration-200 group-hover:rotate-12" />
                <span>Our Process</span>
              </a>
            </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RE-DESIGNED INTEGRATED GLASSMORPHIC TRUST BAR             */}
      {/* ============================================================ */}
      <div className="relative z-20 border-t border-white/15 bg-black/45 backdrop-blur-md">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3.5 sm:py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x lg:divide-white/15">
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 sm:gap-3.5 ${
                    index > 0 ? 'lg:pl-6' : ''
                  }`}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-lime-300 shadow-2xs backdrop-blur-sm">
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-medium text-white leading-tight font-heading tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] text-white/70 leading-normal mt-0.5 font-sans truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. FARM STORY VIDEO MODAL (Interactive)                      */}
      {/* ============================================================ */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-forest-deep rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-forest-deep/90 text-white">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-lime-400" />
                <span className="font-heading text-lg font-medium">
                  Our Farm Story • Annapurna Harvest
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close farm story video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                poster="/images/hero/farm-sunrise-hero.jpg"
              >
                <source src="/videos/hero-farm-bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Modal Footer Notes */}
            <div className="p-4 bg-forest-deep text-cream text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10">
              <p className="text-cream/80 text-center sm:text-left">
                Cultivated with clean well-water &amp; zero chemical sprays across our partner orchards.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsVideoModalOpen(false);
                  navigate('/shop');
                }}
                className="px-4 py-1.5 rounded-full bg-red hover:bg-red-hover text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
              >
                Browse Today&apos;s Harvest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;