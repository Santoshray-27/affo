import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import {
  Category,
  Product,
  Customer,
  CartItem,
  CartItemDetailed,
  Order,
  WalletTransaction,
  Referral,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Address,
  LOW_STOCK_THRESHOLD,
  getStockStatus,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialCustomers,
  initialOrders,
  initialWalletTransactions,
  initialReferrals,
} from '../data/seedData';
import { calculateDeliveryFee, calculateDiscount, pricingConfig } from '../config/pricing';
import { generateId } from '../lib/utils';

const STORAGE_KEY = 'ANNAPURNA_STORE_V1';

interface AppState {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  currentCustomerId: string;
  cart: CartItem[];
  orders: Order[];
  walletTransactions: WalletTransaction[];
  referrals: Referral[];
  appliedCoupon: string | null;
  isAdminLoggedIn: boolean;
  selectedDeliverySlot: string;
}

type Action =
  | { type: 'LOAD_STORE'; payload: AppState }
  | { type: 'RESET_DEMO_DATA' }
  // Cart
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity?: number } }
  | { type: 'UPDATE_CART_QTY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: string }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SET_DELIVERY_SLOT'; payload: string }
  // Orders
  | {
      type: 'PLACE_ORDER';
      payload: {
        deliveryAddress: Address;
        paymentMethod: PaymentMethod;
        notes?: string;
        useWallet?: boolean;
      };
      callback?: (orderId: string) => void;
    }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus; internalNote?: string } }
  | { type: 'CANCEL_ORDER'; payload: { orderId: string; reason?: string } }
  // Products (Admin & cross)
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | {
      type: 'BULK_UPDATE_PRODUCTS';
      payload: {
        ids: string[];
        updates: {
          priceAdjustment?: { type: 'fixed' | 'percent'; value: number };
          stockAdjustment?: { type: 'set' | 'add'; value: number };
          categoryId?: string;
          isActive?: boolean;
        };
      };
    }
  | { type: 'BULK_DELETE_PRODUCTS'; payload: string[] }
  | { type: 'RESTORE_PREVIOUS_PRODUCTS'; payload: Product[] }
  | { type: 'ADJUST_STOCK'; payload: { productId: string; newStock: number; reason?: string } }
  // Customer Profile & Address
  | { type: 'UPDATE_CUSTOMER_PROFILE'; payload: { name: string; email?: string; mobile: string } }
  | { type: 'ADD_CUSTOMER_ADDRESS'; payload: Omit<Address, 'id'> }
  | { type: 'UPDATE_CUSTOMER_ADDRESS'; payload: Address }
  | { type: 'DELETE_CUSTOMER_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  // Wallet
  | {
      type: 'ADD_WALLET_ADJUSTMENT';
      payload: {
        customerId: string;
        amount: number;
        type: 'credit' | 'debit';
        reason: string;
      };
    }
  // Referral
  | { type: 'SIMULATE_FRIEND_REFERRAL'; payload?: { friendName?: string } }
  // Admin Auth
  | { type: 'SET_ADMIN_AUTH'; payload: boolean };

function getInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.products) &&
        Array.isArray(parsed.categories) &&
        Array.isArray(parsed.customers) &&
        Array.isArray(parsed.orders)
      ) {
        return {
          ...parsed,
          isAdminLoggedIn: parsed.isAdminLoggedIn ?? true, // default admin session for demo ease
          appliedCoupon: parsed.appliedCoupon ?? null,
          selectedDeliverySlot: parsed.selectedDeliverySlot ?? 'Morning (6 AM - 9 AM)',
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse localStorage store, falling back to seed data:', err);
  }

  return {
    products: initialProducts,
    categories: initialCategories,
    customers: initialCustomers,
    currentCustomerId: 'cust-demo',
    cart: [
      { productId: 'prod-apple', quantity: 2 },
      { productId: 'prod-tomato', quantity: 1 },
    ],
    orders: initialOrders,
    walletTransactions: initialWalletTransactions,
    referrals: initialReferrals,
    appliedCoupon: 'ANNA10',
    isAdminLoggedIn: true,
    selectedDeliverySlot: 'Morning (6 AM - 9 AM)',
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STORE':
      return action.payload;

    case 'RESET_DEMO_DATA': {
      localStorage.removeItem(STORAGE_KEY);
      return {
        products: initialProducts,
        categories: initialCategories,
        customers: initialCustomers,
        currentCustomerId: 'cust-demo',
        cart: [
          { productId: 'prod-apple', quantity: 2 },
          { productId: 'prod-tomato', quantity: 1 },
        ],
        orders: initialOrders,
        walletTransactions: initialWalletTransactions,
        referrals: initialReferrals,
        appliedCoupon: 'ANNA10',
        isAdminLoggedIn: true,
        selectedDeliverySlot: 'Morning (6 AM - 9 AM)',
      };
    }

    case 'ADD_TO_CART': {
      const { productId, quantity = 1 } = action.payload;
      const product = state.products.find((p) => p.id === productId);
      if (!product || product.stockQuantity <= 0 || !product.isActive) {
        return state;
      }

      const existingIndex = state.cart.findIndex((item) => item.productId === productId);
      let newCart = [...state.cart];

      if (existingIndex >= 0) {
        const newQty = Math.min(newCart[existingIndex].quantity + quantity, product.stockQuantity);
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQty };
      } else {
        newCart.push({ productId, quantity: Math.min(quantity, product.stockQuantity) });
      }

      return { ...state, cart: newCart };
    }

    case 'UPDATE_CART_QTY': {
      const { productId, quantity } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((i) => i.productId !== productId),
        };
      }

      const maxAvailable = product ? product.stockQuantity : quantity;
      const validQty = Math.min(quantity, maxAvailable);

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: validQty } : item
        ),
      };
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.payload.productId),
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload.toUpperCase() };

    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };

    case 'SET_DELIVERY_SLOT':
      return { ...state, selectedDeliverySlot: action.payload };

    case 'PLACE_ORDER': {
      const { deliveryAddress, paymentMethod, notes, useWallet } = action.payload;
      const customer = state.customers.find((c) => c.id === state.currentCustomerId) || state.customers[0];

      // Calculate totals
      let subtotal = 0;
      const orderItems = [];
      const stockUpdates = new Map<string, number>();

      for (const cartItem of state.cart) {
        const prod = state.products.find((p) => p.id === cartItem.productId);
        if (!prod || prod.stockQuantity < cartItem.quantity) {
          // Out of stock or insufficient, throw or abort
          return state;
        }
        subtotal += prod.price * cartItem.quantity;
        orderItems.push({
          productId: prod.id,
          name: prod.name,
          unitLabel: prod.unitLabel,
          price: prod.price,
          quantity: cartItem.quantity,
          image: prod.image,
        });
        stockUpdates.set(prod.id, prod.stockQuantity - cartItem.quantity);
      }

      const deliveryCharge = calculateDeliveryFee(subtotal);
      const discount = calculateDiscount(subtotal, state.appliedCoupon || undefined);
      let total = Math.max(0, subtotal + deliveryCharge - discount);

      let walletDebited = 0;
      let newCustomerWallet = customer.walletBalance;
      const newTransactions = [...state.walletTransactions];

      if (paymentMethod === 'wallet' || useWallet) {
        walletDebited = Math.min(newCustomerWallet, total);
        newCustomerWallet -= walletDebited;
        total -= walletDebited;

        if (walletDebited > 0) {
          newTransactions.unshift({
            id: 'tx-' + Date.now(),
            customerId: customer.id,
            type: 'debit',
            amount: walletDebited,
            description: `Debited for order payment`,
            createdAt: new Date().toISOString(),
          });
        }
      }

      const paymentStatus: PaymentStatus =
        paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid (simulated)';

      const newOrderId = generateId('ANN');
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: newOrderId,
        customerId: customer.id,
        customerName: customer.name,
        customerMobile: customer.mobile,
        items: orderItems,
        deliveryAddress,
        subtotal,
        deliveryCharge,
        discount,
        total: Math.max(0, total),
        paymentMethod,
        paymentStatus,
        orderStatus: 'Pending',
        createdAt: now,
        internalNote: notes ? `Customer note: ${notes}` : undefined,
        deliverySlot: state.selectedDeliverySlot,
      };

      // Decrement stock in products
      const updatedProducts = state.products.map((p) => {
        if (stockUpdates.has(p.id)) {
          return {
            ...p,
            stockQuantity: Math.max(0, stockUpdates.get(p.id)!),
            updatedAt: now,
          };
        }
        return p;
      });

      // Update customer wallet balance
      const updatedCustomers = state.customers.map((c) =>
        c.id === customer.id ? { ...c, walletBalance: newCustomerWallet } : c
      );

      if (action.callback) {
        action.callback(newOrderId);
      }

      return {
        ...state,
        products: updatedProducts,
        orders: [newOrder, ...state.orders],
        cart: [],
        walletTransactions: newTransactions,
        customers: updatedCustomers,
        appliedCoupon: null,
      };
    }

    case 'UPDATE_ORDER_STATUS': {
      const { orderId, status, internalNote } = action.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: status,
                internalNote: internalNote !== undefined ? internalNote : o.internalNote,
              }
            : o
        ),
      };
    }

    case 'CANCEL_ORDER': {
      const { orderId, reason } = action.payload;
      const targetOrder = state.orders.find((o) => o.id === orderId);
      if (!targetOrder || targetOrder.orderStatus === 'Delivered' || targetOrder.orderStatus === 'Cancelled') {
        return state;
      }

      // Restock items
      const restockMap = new Map<string, number>();
      for (const item of targetOrder.items) {
        restockMap.set(item.productId, (restockMap.get(item.productId) || 0) + item.quantity);
      }

      const updatedProducts = state.products.map((p) => {
        if (restockMap.has(p.id)) {
          return {
            ...p,
            stockQuantity: p.stockQuantity + restockMap.get(p.id)!,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      // If simulated payment was paid, refund wallet or show refund
      let updatedCustomers = state.customers;
      let updatedTransactions = [...state.walletTransactions];

      if (targetOrder.paymentStatus === 'Paid (simulated)') {
        updatedTransactions.unshift({
          id: 'tx-' + Date.now(),
          customerId: targetOrder.customerId,
          type: 'refund',
          amount: targetOrder.total,
          description: `Refund for cancelled order ${targetOrder.id}`,
          createdAt: new Date().toISOString(),
          referenceId: targetOrder.id,
        });

        updatedCustomers = state.customers.map((c) =>
          c.id === targetOrder.customerId
            ? { ...c, walletBalance: c.walletBalance + targetOrder.total }
            : c
        );
      }

      return {
        ...state,
        products: updatedProducts,
        customers: updatedCustomers,
        walletTransactions: updatedTransactions,
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: 'Cancelled',
                paymentStatus: o.paymentStatus === 'Paid (simulated)' ? 'Refunded' : o.paymentStatus,
                internalNote: `Cancelled: ${reason || 'Customer requested'}. Restocked all items.`,
              }
            : o
        ),
      };
    }

    case 'ADD_PRODUCT': {
      const now = new Date().toISOString();
      const newProduct: Product = {
        ...action.payload,
        id: 'prod-' + Date.now(),
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...state,
        products: [newProduct, ...state.products],
      };
    }

    case 'UPDATE_PRODUCT': {
      const now = new Date().toISOString();
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates, updatedAt: now }
            : p
        ),
      };
    }

    case 'DELETE_PRODUCT': {
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        cart: state.cart.filter((c) => c.productId !== action.payload),
      };
    }

    case 'BULK_UPDATE_PRODUCTS': {
      const { ids, updates } = action.payload;
      const now = new Date().toISOString();

      return {
        ...state,
        products: state.products.map((p) => {
          if (!ids.includes(p.id)) return p;

          let newPrice = p.price;
          if (updates.priceAdjustment) {
            if (updates.priceAdjustment.type === 'fixed') {
              newPrice = Math.max(1, p.price + updates.priceAdjustment.value);
            } else {
              newPrice = Math.max(1, Math.round(p.price * (1 + updates.priceAdjustment.value / 100)));
            }
          }

          let newStock = p.stockQuantity;
          if (updates.stockAdjustment) {
            if (updates.stockAdjustment.type === 'set') {
              newStock = Math.max(0, updates.stockAdjustment.value);
            } else {
              newStock = Math.max(0, p.stockQuantity + updates.stockAdjustment.value);
            }
          }

          return {
            ...p,
            price: newPrice,
            stockQuantity: newStock,
            categoryId: updates.categoryId !== undefined ? updates.categoryId : p.categoryId,
            isActive: updates.isActive !== undefined ? updates.isActive : p.isActive,
            updatedAt: now,
          };
        }),
      };
    }

    case 'BULK_DELETE_PRODUCTS': {
      const deleteIds = new Set(action.payload);
      return {
        ...state,
        products: state.products.filter((p) => !deleteIds.has(p.id)),
        cart: state.cart.filter((c) => !deleteIds.has(c.productId)),
      };
    }

    case 'RESTORE_PREVIOUS_PRODUCTS': {
      return {
        ...state,
        products: action.payload,
      };
    }

    case 'ADJUST_STOCK': {
      const { productId, newStock } = action.payload;
      const now = new Date().toISOString();
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === productId
            ? { ...p, stockQuantity: Math.max(0, newStock), updatedAt: now }
            : p
        ),
      };
    }

    case 'UPDATE_CUSTOMER_PROFILE': {
      const { name, email, mobile } = action.payload;
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === state.currentCustomerId ? { ...c, name, email, mobile } : c
        ),
      };
    }

    case 'ADD_CUSTOMER_ADDRESS': {
      const newAddress: Address = {
        ...action.payload,
        id: 'addr-' + Date.now(),
      };
      return {
        ...state,
        customers: state.customers.map((c) => {
          if (c.id !== state.currentCustomerId) return c;
          const addresses = newAddress.isDefault
            ? c.addresses.map((a) => ({ ...a, isDefault: false }))
            : [...c.addresses];
          return {
            ...c,
            addresses: [...addresses, newAddress],
          };
        }),
      };
    }

    case 'UPDATE_CUSTOMER_ADDRESS': {
      const updated = action.payload;
      return {
        ...state,
        customers: state.customers.map((c) => {
          if (c.id !== state.currentCustomerId) return c;
          return {
            ...c,
            addresses: c.addresses.map((a) => {
              if (a.id === updated.id) return updated;
              if (updated.isDefault) return { ...a, isDefault: false };
              return a;
            }),
          };
        }),
      };
    }

    case 'DELETE_CUSTOMER_ADDRESS': {
      const addressId = action.payload;
      return {
        ...state,
        customers: state.customers.map((c) => {
          if (c.id !== state.currentCustomerId) return c;
          const filtered = c.addresses.filter((a) => a.id !== addressId);
          // Ensure at least one default if list not empty
          if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
            filtered[0].isDefault = true;
          }
          return { ...c, addresses: filtered };
        }),
      };
    }

    case 'SET_DEFAULT_ADDRESS': {
      const addressId = action.payload;
      return {
        ...state,
        customers: state.customers.map((c) => {
          if (c.id !== state.currentCustomerId) return c;
          return {
            ...c,
            addresses: c.addresses.map((a) => ({
              ...a,
              isDefault: a.id === addressId,
            })),
          };
        }),
      };
    }

    case 'ADD_WALLET_ADJUSTMENT': {
      const { customerId, amount, type, reason } = action.payload;
      const now = new Date().toISOString();
      const tx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        customerId,
        type,
        amount,
        description: `Admin manual adjustment: ${reason}`,
        createdAt: now,
      };

      return {
        ...state,
        walletTransactions: [tx, ...state.walletTransactions],
        customers: state.customers.map((c) => {
          if (c.id !== customerId) return c;
          const delta = type === 'credit' ? amount : -amount;
          return {
            ...c,
            walletBalance: Math.max(0, c.walletBalance + delta),
          };
        }),
      };
    }

    case 'SIMULATE_FRIEND_REFERRAL': {
      const friendName = action.payload?.friendName || 'Rohit Mehra (Demo Friend)';
      const reward = pricingConfig.referralRewardAmount;
      const now = new Date().toISOString();
      const currentCustomer = state.customers.find((c) => c.id === state.currentCustomerId);
      if (!currentCustomer) return state;

      const newRef: Referral = {
        id: 'ref-' + Date.now(),
        referralCode: currentCustomer.referralCode,
        referrerCustomerId: currentCustomer.id,
        referrerName: currentCustomer.name,
        referredCustomerName: friendName,
        status: 'Completed',
        rewardAmount: reward,
        createdAt: now,
      };

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        customerId: currentCustomer.id,
        type: 'reward',
        amount: reward,
        description: `Referral reward: ${friendName} completed their first purchase!`,
        createdAt: now,
        referenceId: newRef.id,
      };

      return {
        ...state,
        referrals: [newRef, ...state.referrals],
        walletTransactions: [newTx, ...state.walletTransactions],
        customers: state.customers.map((c) =>
          c.id === currentCustomer.id
            ? { ...c, walletBalance: c.walletBalance + reward }
            : c
        ),
      };
    }

    case 'SET_ADMIN_AUTH': {
      return {
        ...state,
        isAdminLoggedIn: action.payload,
      };
    }

    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<Action>;
  // Derived helpers
  currentCustomer: Customer;
  detailedCart: CartItemDetailed[];
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;
  activeProducts: Product[];
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  pendingOrdersCount: number;
  totalRevenue: number;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getProductById: (id: string) => Product | undefined;
  getOrderById: (id: string) => Order | undefined;
  getCustomerById: (id: string) => Customer | undefined;
  // Direct Action helpers
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  setDeliverySlot: (slot: string) => void;
  placeOrder: (
    deliveryAddress: Address,
    paymentMethod: PaymentMethod,
    notes?: string,
    useWallet?: boolean
  ) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  adjustStock: (productId: string, newStock: number, reason?: string) => void;
  resetDemoData: () => void;
}

const AppStoreContext = createContext<AppContextValue | null>(null);

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to sync state to localStorage:', e);
    }
  }, [state]);

  const currentCustomer = useMemo(() => {
    return (
      state.customers.find((c) => c.id === state.currentCustomerId) || state.customers[0]
    );
  }, [state.customers, state.currentCustomerId]);

  const detailedCart = useMemo<CartItemDetailed[]>(() => {
    return state.cart
      .map((item) => {
        const product = state.products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
        };
      })
      .filter(Boolean) as CartItemDetailed[];
  }, [state.cart, state.products]);

  const cartSubtotal = useMemo(() => {
    return detailedCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [detailedCart]);

  const cartDeliveryFee = useMemo(() => {
    return calculateDeliveryFee(cartSubtotal);
  }, [cartSubtotal]);

  const cartDiscount = useMemo(() => {
    return calculateDiscount(cartSubtotal, state.appliedCoupon || undefined);
  }, [cartSubtotal, state.appliedCoupon]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);
  }, [cartSubtotal, cartDeliveryFee, cartDiscount]);

  const cartCount = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cart]);

  const activeProducts = useMemo(() => {
    return state.products.filter((p) => p.isActive);
  }, [state.products]);

  const lowStockProducts = useMemo(() => {
    return state.products.filter((p) => {
      const status = getStockStatus(p.stockQuantity);
      return status === 'Low Stock';
    });
  }, [state.products]);

  const outOfStockProducts = useMemo(() => {
    return state.products.filter((p) => p.stockQuantity <= 0);
  }, [state.products]);

  const pendingOrdersCount = useMemo(() => {
    return state.orders.filter((o) => o.orderStatus === 'Pending').length;
  }, [state.orders]);

  const totalRevenue = useMemo(() => {
    return state.orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [state.orders]);

  const getCategoryById = (id: string) => state.categories.find((c) => c.id === id);
  const getCategoryBySlug = (slug: string) => state.categories.find((c) => c.slug === slug);
  const getProductById = (id: string) => state.products.find((p) => p.id === id);
  const getOrderById = (id: string) => state.orders.find((o) => o.id === id);
  const getCustomerById = (id: string) => state.customers.find((c) => c.id === id);

  const addToCart = (productId: string, quantity?: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyCoupon = (code: string) => {
    dispatch({ type: 'APPLY_COUPON', payload: code });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const setDeliverySlot = (slot: string) => {
    dispatch({ type: 'SET_DELIVERY_SLOT', payload: slot });
  };

  const placeOrder = (
    deliveryAddress: Address,
    paymentMethod: PaymentMethod,
    notes?: string,
    useWallet?: boolean
  ): string => {
    let createdId = '';
    dispatch({
      type: 'PLACE_ORDER',
      payload: { deliveryAddress, paymentMethod, notes, useWallet },
      callback: (id) => {
        createdId = id;
      },
    });
    return createdId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status, internalNote: note } });
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    dispatch({ type: 'CANCEL_ORDER', payload: { orderId, reason } });
  };

  const adjustStock = (productId: string, newStock: number, reason?: string) => {
    dispatch({ type: 'ADJUST_STOCK', payload: { productId, newStock, reason } });
  };

  const resetDemoData = () => {
    dispatch({ type: 'RESET_DEMO_DATA' });
  };

  const value: AppContextValue = {
    ...state,
    dispatch,
    currentCustomer,
    detailedCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    cartCount,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    pendingOrdersCount,
    totalRevenue,
    getCategoryById,
    getCategoryBySlug,
    getProductById,
    getOrderById,
    getCustomerById,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    setDeliverySlot,
    placeOrder,
    updateOrderStatus,
    cancelOrder,
    adjustStock,
    resetDemoData,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}

