import React from 'react';
import { ProductForm } from '../../components/admin/ProductForm';

export const AdminProductNewPage: React.FC = () => {
  return <ProductForm isEditing={false} />;
};

