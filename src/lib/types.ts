// Admin Types
export interface Admin {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    admin: Admin;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  isEmailVerified: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  verificationCode?: string;
  verificationCodeExpiry?: string;
}

// Order Types
export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  description?: string;
}

export interface Address {
  _id?: string;
  userId?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  label?: string;
  recipientName?: string;
  recipientPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderStats {
  total: number;
  totalDelivered: number;
  totalPending: number;
  totalInTransit: number;
  totalCancelled: number;
  totalFailedDelivery: number;
  todayOrders: number;
  todayDelivered: number;
  revenue: {
    total: number;
    today: number;
  };
}

export interface Order {
  _id: string;
  userId: string;
  trackingNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  price: number;
  isFragile: boolean;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  items: OrderItem[];
  pickupAddress: Address;
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

// Consumer Types
export interface Consumer {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isEmailVerified: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: {
    favoriteStores: string[];
    preferredCategories: string[];
  };
}

export interface ConsumerStats {
  total: number;
  active: number;
  inactive: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
}

export interface OrderStatusUpdateResponse {
  order: Order;
  emailSent: boolean;
}

export interface Zone {
  _id: string;
  name: string;
  deliveryPrice: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 