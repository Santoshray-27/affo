import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { ProductForm } from '../../components/admin/ProductForm';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { getProductById } = useAppStore();

  const product = getProductById(productId || '');

  if (!product) {
    return (
      <div className="py-12 text-center">
        <EmptyState
          title="Product Not Found"
          description={`Product ID "${productId}" was not found in the catalog.`}
          actionLabel="Back to Products"
          onAction={() => navigate('/admin/products')}
        />
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEditing={true} />;
};

