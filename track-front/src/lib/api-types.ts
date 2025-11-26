export const UserRole = {
  CLIENT: 'CLIENT',
  COMMERCANT: 'COMMERCANT',
  FOURNISSEUR: 'FOURNISSEUR',
  LIVREUR: 'LIVREUR',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface ClientInfo {
  town: string;
  address: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
}

export interface MerchantInfo {
  shopName: string;
  town: string;
  address: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
}

export interface SupplierInfo {
  shopName: string;
  town: string;
  address: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryInfo {
  town: string;
  address: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
}

export interface ProfileRequest {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  clientInfo?: ClientInfo;
  merchantInfo?: MerchantInfo;
  supplierInfo?: SupplierInfo;
  deliveryInfo?: DeliveryInfo;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  email: string;
  token: string;
  name?: string;
  roles?: string[];
}

export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  isApproved: boolean;
  roles: string[];
}

export interface ApiError {
  error: boolean;
  message: string;
}