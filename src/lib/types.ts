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

export interface Order {
  _id: string;
  userId: string;
  trackingNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED';
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  isFragile: boolean;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  price: number;
  estimatedWeight: number;
  estimatedDeliveryDate: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  pickupAddress: Address;
  deliveryAddress: {
    type: 'manual';
    manualAddress: Address;
  } | string; // Can be either an address object or an address ID
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