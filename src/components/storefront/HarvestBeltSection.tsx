import React from 'react';
import DishOrbitCarousel, { Dish } from '../ui/dish-orbit-carousel';
import { useAppStore } from '../../store/AppStoreContext';
import { useToast } from '../ui/Toast';

export const HARVEST_DISHES: Dish[] = [
  {
    title: 'Kinnaur High-Altitude',
    subtitle: 'Royal Gala Apples',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    eyebrow: '#1 Fresh Orchard Harvest',
    rating: 4.9,
    chef: 'Sunil Thakur (3rd Gen Grower)',
    kitchen: 'Kotgarh Valley, Himachal (7,200 ft)',
    description: 'Hand-picked at peak crispness, cold-stored naturally, and delivered with untouched natural orchard bloom.',
    ingredients: ['Zero Wax Coating', 'Tree-Ripened', 'High Dietary Fiber', 'Heirloom Rootstock'],
    accent: '#D62828',
    productId: 'prod-apple',
    price: '₹140 / kg',
    likes: 342,
  },
  {
    title: 'Hydroponic Greenhouse',
    subtitle: 'Creamy Hass Avocado',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    eyebrow: '#2 Exotic Harvest Pick',
    rating: 4.8,
    chef: 'Dr. Arvind Rao (Agri-Scientist)',
    kitchen: 'Sohna Precision Polyhouse, Haryana',
    description: 'Slow-ripened Hass avocados with unmatched buttery richness, perfect for breakfast toasts and seasonal bowls.',
    ingredients: ['Healthy Oleic Fats', 'Chemical-Free Water', 'Harvested to Order', 'Zero Cold-Shock'],
    accent: '#85A827',
    productId: 'prod-avocado',
    price: '₹180 / 2 pcs',
    likes: 218,
  },
  {
    title: 'Wood-Churned Vedic',
    subtitle: 'A2 Gir Cow Ghee',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    eyebrow: '#3 Artisanal Dairy Heritage',
    rating: 5.0,
    chef: 'Gau-Seva Heritage Trust',
    kitchen: 'Bhiwani Native Breed Gaushala, Haryana',
    description: 'Cultured from whole curd of grass-fed native Gir cows using traditional two-way wooden bilona churning over slow fire.',
    ingredients: ['100% A2 Beta-Casein', 'Zero Preservatives', 'Granular Danedar Texture', 'Rich in Butyric Acid'],
    accent: '#F5A524',
    productId: 'prod-ghee',
    price: '₹350 / 500ml',
    likes: 520,
  },
  {
    title: 'Stone-Pressed Virgin',
    subtitle: 'Desi Mustard Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    eyebrow: '#4 Pure Cold-Pressed Oil',
    rating: 4.9,
    chef: 'Kisan Sahakari Samiti',
    kitchen: 'Bharatpur Organic Mustard Belt, Rajasthan',
    description: 'Slow crushed at room temperature below 45°C in traditional wooden kohlu to preserve intense pungency and vitamins.',
    ingredients: ['Single-Press Virgin', 'Zero Hexane Extraction', 'Rich in Omega 3 & 6', 'Unrefined & Golden'],
    accent: '#D98207',
    productId: 'prod-mustard-oil',
    price: '₹65 / 1L',
    likes: 189,
  },
  {
    title: 'Living Hydroponic',
    subtitle: 'Butterhead Lettuce',
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
    eyebrow: '#5 Hydroponic Greens',
    rating: 4.9,
    chef: 'GreenRoots Collective',
    kitchen: 'Aravalli Foothill Farm, Gurgaon',
    description: 'Plucked with living root system intact for maximum crunch and longevity in your crisper drawer.',
    ingredients: ['Pesticide-Free Water', 'Delivered Same Morning', 'Tender Sweet Leaves', 'Ultra Low Nitrate'],
    accent: '#14612A',
    productId: 'prod-lettuce',
    price: '₹85 / 250g',
    likes: 164,
  },
];

export const HarvestBeltSection: React.FC = () => {
  const { addToCart } = useAppStore();
  const toast = useToast();

  const handleOrder = (dish: Dish) => {
    if (dish.productId) {
      addToCart(dish.productId, 1);
      toast.success('Added to Basket!', `${dish.title} ${dish.subtitle} (${dish.price})`);
    } else {
      toast.success('Added to Basket!', `${dish.title} ${dish.subtitle}`);
    }
  };

  const handlePlayStory = (dish: Dish) => {
    toast.info(`Farm Origin: ${dish.kitchen}`, `Grown by ${dish.chef}. Verified 100% natural and pesticide-free.`);
  };

  return (
    <section className="relative overflow-hidden max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-2 sm:pt-4 pb-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
              Morning Harvest Spotlight
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-ink mt-2">
            Fresh Harvest Belt
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed">
          Explore this morning&apos;s featured farm harvest. Click or swipe to orbit through items and view origin notes.
        </p>
      </div>

      <div className="relative w-full">
        <DishOrbitCarousel
          dishes={HARVEST_DISHES}
          height="540px"
          scrollDriven={false}
          autoplay={true}
          interval={4500}
          loop={true}
          orderLabel="Add to Basket"
          playLabel="Farm Origin"
          onOrder={handleOrder}
          onPlay={handlePlayStory}
        />
      </div>
    </section>
  );
};

export default HarvestBeltSection;
