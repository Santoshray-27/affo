import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import SushiConveyorMenu, { ConveyorDish } from '../ui/sushi-conveyor-menu';
import { useAppStore } from '../../store/AppStoreContext';
import { useToast } from '../ui/Toast';

export const SEASONAL_RECIPES: ConveyorDish[] = [
  {
    id: 'recipe-sarson-saag',
    name: 'Slow-simmered Sarson Saag with Farm A2 Ghee',
    price: '₹460 bundle',
    tier: 5,
    description: 'Slow-simmered organic mustard greens and spinach, tempered with cumin and crowned with golden farm A2 Bilona cow ghee.',
    details: ['Seasonal Main', '30 min preparation', '3 farm ingredients', 'High Iron', 'Traditional'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    ingredientProductIds: ['prod-spinach', 'prod-ghee', 'prod-mustard-oil'],
    ingredientNames: ['Organic Farm Spinach & Saag (500g)', 'A2 Vedic Bilona Cow Ghee (500ml)', 'Cold-Pressed Mustard Oil (1L)'],
  },
  {
    id: 'recipe-avocado-salad',
    name: 'Butterhead Lettuce & Hass Avocado Salad Bowl',
    price: '₹315 bundle',
    tier: 4,
    description: 'Crisp hydroponic butterhead leaves gently tossed with ripe Hass avocado cubes, sweet vine tomatoes, and sea salt.',
    details: ['Crisp Salad', '15 min preparation', '3 farm ingredients', 'Hydroponic', 'Heart Healthy'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    ingredientProductIds: ['prod-lettuce', 'prod-avocado', 'prod-tomato'],
    ingredientNames: ['Hydroponic Butterhead Lettuce (250g)', 'Ripe Hass Avocado (2 pcs)', 'Vine Heirloom Tomatoes (1 kg)'],
  },
  {
    id: 'recipe-amla-tonic',
    name: 'Cold-pressed Gooseberry & Wild Ginger Elixir',
    price: '₹240 bundle',
    tier: 3,
    description: 'Immunity-boosting Ayurvedic elixir combining cold-pressed Pahadi amla, raw wild ginger, and organic Lakadong turmeric.',
    details: ['Daily Tonic', '10 min preparation', '3 farm ingredients', 'Vitamin C', 'Immunity Boost'],
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    ingredientProductIds: ['prod-amla-shot', 'prod-turmeric', 'prod-orange-elixir'],
    ingredientNames: ['Raw Cold-Pressed Amla Elixir', 'Fresh Lakadong Turmeric Root', 'Cold-Pressed Citrus Immunity Blend'],
  },
  {
    id: 'recipe-tomato-chutney',
    name: 'Heirloom Tomato & Coriander Village Chutney',
    price: '₹190 bundle',
    tier: 2,
    description: 'Crushed sun-ripened desi heirloom tomatoes, freshly plucked coriander, and sweet red onions tempered in cold-pressed mustard oil.',
    details: ['Condiment', '12 min preparation', '4 farm ingredients', 'Stone Ground', 'Zero Additives'],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    ingredientProductIds: ['prod-tomato', 'prod-coriander', 'prod-onion', 'prod-mustard-oil'],
    ingredientNames: ['Heirloom Desi Tomatoes (1 kg)', 'Fresh Farm Coriander (250g)', 'Red Desi Onions (1 kg)', 'Mustard Oil'],
  },
  {
    id: 'recipe-apple-oats',
    name: 'Kashmiri Apple & Cinnamon Morning Oats',
    price: '₹415 bundle',
    tier: 4,
    description: 'Crisp hand-picked Kinnaur apples simmered with natural heirloom sugarcane jaggery and wild mountain blueberries.',
    details: ['Breakfast', '10 min preparation', '3 farm ingredients', 'Orchard Plucked', 'Natural Sweetener'],
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80',
    ingredientProductIds: ['prod-apple', 'prod-jaggery', 'prod-blueberries'],
    ingredientNames: ['Shimla Royal Gala Apples (1 kg)', 'Organic Sugarcane Jaggery (500g)', 'Fresh Blueberries (125g)'],
  },
  {
    id: 'recipe-spinach-medley',
    name: 'Country Garden Spinach & Capsicum Stir-Fry',
    price: '₹150 bundle',
    tier: 1,
    description: 'Tender baby spinach and crunchy green bell peppers sautéed lightly in cold-pressed mustard oil with roasted cumin seeds.',
    details: ['Quick Side', '18 min preparation', '3 farm ingredients', 'Rich in Folate', 'Quick Sauté'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    ingredientProductIds: ['prod-spinach', 'prod-capsicum', 'prod-onion'],
    ingredientNames: ['Farm Harvest Spinach (500g)', 'Crunchy Bell Peppers (500g)', 'Desi Red Onions (1 kg)'],
  },
];

export const RECIPE_TIER_LEGEND = {
  1: 'Quick Sides (₹150)',
  2: 'Condiments (₹190)',
  3: 'Daily Tonics (₹240)',
  4: 'Crisp Salads (₹315)',
  5: 'Seasonal Mains (₹460)',
};

export const SeasonalRecipesSection: React.FC = () => {
  const { addToCart } = useAppStore();
  const toast = useToast();

  const handleAddRecipeBundle = (dish: ConveyorDish) => {
    const ingredientIds = dish.ingredientProductIds || [];
    if (ingredientIds.length === 0) return;

    ingredientIds.forEach((id) => {
      addToCart(id, 1);
    });

    toast.success(
      'Recipe Bundle Added!',
      `Added all ${ingredientIds.length} farm ingredients for "${dish.name}" to your basket.`
    );
  };

  return (
    <section className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-12 overflow-x-clip">
      {/* Farm Kitchen - Scaled up by 5% */}
      <div className="w-full scale-[1.05] origin-top transition-transform duration-300">
        <SushiConveyorMenu
          items={SEASONAL_RECIPES}
          legend={RECIPE_TIER_LEGEND}
          eyebrow="Farm Kitchen"
          heading="Seasonal recipes & nourishment"
          caption="Hover to stop the belt, flick to rotate, tap any dish to view recipe & add all ingredients to basket."
          speed={24}
          autoplay={true}
          interval={3800}
          onAdd={handleAddRecipeBundle}
          labels={{
            add: 'Add All Ingredients to Basket',
            close: 'Close',
            previous: 'Previous recipe',
            next: 'Next recipe',
            pause: 'Pause conveyor',
          }}
          action={
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-btn bg-forest px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-forest-deep"
              >
                <span>Explore all produce</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-medium text-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-marigold" />
                Bundle includes 100% farm-sourced fresh ingredients
              </span>
            </div>
          }
        />
      </div>
    </section>
  );
};

export default SeasonalRecipesSection;
