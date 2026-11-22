export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  unitLabel: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Address {
  id: string;
  name: string;
  mobile: string;
  line: string;
  locality: string;
  city: string;
  pinCode: string;
  isDefault?: boolean;
  deliveryNote?: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  addresses: Address[];
  walletBalance: number;
  referralCode: string;
  joinedAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartItemDetailed extends CartItem {
  product: Product;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitLabel: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'upi' | 'card_netbanking' | 'wallet' | 'cod';

export type PaymentStatus =
  | 'Paid (simulated)'
  | 'Pending (COD)'
  | 'Failed'
  | 'Refunded';

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  customerMobile?: string;
  items: OrderItem[];
  deliveryAddress: Address;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  internalNote?: string;
  deliverySlot?: string;
}

export type WalletTransactionType = 'credit' | 'debit' | 'refund' | 'reward';

export interface WalletTransaction {
  id: string;
  customerId: string;
  type: WalletTransactionType;
  amount: number;
  description: string;
  createdAt: string;
  referenceId?: string;
}

export interface Referral {
  id: string;
  referralCode: string;
  referrerCustomerId: string;
  referrerName?: string;
  referredCustomerId?: string;
  referredCustomerName?: string;
  status: 'Pending' | 'Completed';
  rewardAmount: number;
  createdAt: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export const LOW_STOCK_THRESHOLD = 10;

export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return 'Out of Stock';
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return 'Low Stock';
  return 'In Stock';
}

