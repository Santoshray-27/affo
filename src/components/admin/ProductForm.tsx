import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '../../types';
import { useAppStore } from '../../store/AppStoreContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProductCard } from '../storefront/ProductCard';
import { useToast } from '../ui/Toast';
import { Upload, ArrowLeft } from 'lucide-react';

const productSchema = z
  .object({
    name: z.string().min(2, 'Produce name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    categoryId: z.string().min(1, 'Category selection is required'),
    price: z.coerce.number().min(1, 'Selling price must be at least ₹1'),
    compareAtPrice: z.coerce.number().optional().nullable(),
    unitLabel: z.string().min(1, 'Pack unit label required (e.g. 1 kg, 500 g)'),
    stockQuantity: z.coerce.number().min(0, 'Stock cannot be negative'),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.compareAtPrice && data.compareAtPrice > 0) {
        return data.compareAtPrice > data.price;
      }
      return true;
    },
    {
      message: 'Original Compare-At Price must be strictly higher than Selling Price',
      path: ['compareAtPrice'],
    }
  );

type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormProps {
  initialProduct?: Product;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { categories, dispatch } = useAppStore();
  const toast = useToast();

  const [imagePreview, setImagePreview] = useState<string>(
    initialProduct?.image || '/images/products/apple.jpg'
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialProduct?.name || '',
      description: initialProduct?.description || '',
      categoryId: initialProduct?.categoryId || categories[0]?.id || '',
      price: initialProduct?.price || 100,
      compareAtPrice: initialProduct?.compareAtPrice || null,
      unitLabel: initialProduct?.unitLabel || '1 kg',
      stockQuantity: initialProduct?.stockQuantity ?? 25,
      isActive: initialProduct?.isActive ?? true,
    },
  });

  const formValues = watch();

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    if (isEditing && initialProduct) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: {
          id: initialProduct.id,
          updates: {
            ...data,
            compareAtPrice: data.compareAtPrice || undefined,
            image: imagePreview,
          },
        },
      });
      toast.success('Product Updated', `${data.name} saved. Customer storefront reflects it now.`);
    } else {
      dispatch({
        type: 'ADD_PRODUCT',
        payload: {
          ...data,
          compareAtPrice: data.compareAtPrice || undefined,
          image: imagePreview,
        },
      });
      toast.success('Product Added', `${data.name} is now live in the store.`);
    }

    navigate('/admin/products');
  };

  // Construct a live mock product object for the right-hand Storefront preview
  const livePreviewProduct: Product = {
    id: initialProduct?.id || 'prod-preview',
    name: formValues.name || 'Produce Name Preview',
    description: formValues.description || 'Description preview...',
    categoryId: formValues.categoryId || categories[0]?.id || '',
    image: imagePreview,
    price: formValues.price || 99,
    compareAtPrice: formValues.compareAtPrice || undefined,
    unitLabel: formValues.unitLabel || '1 kg',
    stockQuantity: formValues.stockQuantity ?? 10,
    isActive: formValues.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const unitSuggestions = ['250 g bunch', '500 g', '1 kg', '1 dozen', '1 box (6 pcs)', '200 ml bottle', '1 Litre'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="text-xs font-mono text-muted hover:text-forest flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Form */}
        <div className="lg:col-span-8 bg-white rounded-card border border-line p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="pb-3 border-b border-line">
              <h3 className="font-heading text-xl font-normal text-ink">
                {isEditing ? `Edit ${initialProduct?.name}` : 'New Produce Item'}
              </h3>
              <p className="text-xs text-muted font-mono mt-0.5">
                Update harvest specifications, pricing, and stock count
              </p>
            </div>

            {/* Produce Name */}
            <Input
              label="Produce Name"
              placeholder="e.g. Organic Seedless Watermelon"
              {...register('name')}
              error={errors.name?.message}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">
                Description &amp; Origin Notes <span className="text-red">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Cultivation notes, taste profile, and harvest details..."
                {...register('description')}
                className="w-full bg-cream/40 text-ink rounded-[10px] border border-line p-3 text-xs transition-colors focus:outline-none focus:border-forest"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red font-mono">{errors.description.message}</p>
              )}
            </div>

            {/* Category & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Category <span className="text-red">*</span>
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full bg-cream/40 text-ink rounded-[10px] border border-line px-3 h-12 text-xs focus:outline-none focus:border-forest"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-red font-mono">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <Input
                  label="Pack Unit"
                  placeholder="e.g. 1 kg, 500 g, 1 dozen"
                  {...register('unitLabel')}
                  error={errors.unitLabel?.message}
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {unitSuggestions.slice(0, 4).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setValue('unitLabel', u)}
                      className="text-[10px] font-mono bg-cream px-2 py-0.5 rounded-[6px] border border-line hover:border-forest text-muted hover:text-ink transition-colors"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Selling Price (₹)"
                type="number"
                min="1"
                {...register('price')}
                error={errors.price?.message}
                required
              />

              <Input
                label="Compare-At Price (₹) - Optional"
                type="number"
                placeholder="Shows strike-through if higher"
                {...register('compareAtPrice')}
                error={errors.compareAtPrice?.message}
              />
            </div>

            {/* Stock Quantity & Active Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <Input
                label="Stock Quantity (Units)"
                type="number"
                min="0"
                {...register('stockQuantity')}
                error={errors.stockQuantity?.message}
                helperText="≤ 10 triggers low stock warning"
                required
              />

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 rounded mt-0.5 text-forest focus:ring-forest accent-forest cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-medium text-ink block">
                      Active on Storefront
                    </span>
                    <span className="text-[11px] text-muted block">
                      Uncheck to hide item from customer catalog.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Image Upload Simulator */}
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">
                Produce Photograph
              </label>
              <div className="flex items-center gap-4 p-4 bg-cream/40 rounded-card border border-dashed border-line">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-[8px] object-cover bg-white border border-line"
                />
                <div className="space-y-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-line hover:border-forest text-xs font-medium text-ink cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-forest" />
                    <span>Upload Local Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-muted font-mono">
                    Local preview object for browser demo
                  </p>
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-line">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
              >
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Live Storefront Card Preview */}
        <div className="lg:col-span-4 sticky top-24 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-muted">
            Storefront Card Preview
          </div>
          <div className="max-w-[280px]">
            <ProductCard product={livePreviewProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};
