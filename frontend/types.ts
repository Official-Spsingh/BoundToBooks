
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum BookCondition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  USED = 'Used',
  POOR = 'Poor'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum RequestType {
  SELL = 'SELL',
  DONATE = 'DONATE'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  phone?: string;
  address?: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BookItem {
  id: string;
  name: string;
  author: string;
  condition: BookCondition;
  description: string;
  expectedPrice?: number;
  images: string[];
}

export interface BookRequest {
  id: string;
  userId: string;
  userName: string;
  type: RequestType;
  books: BookItem[];
  status: RequestStatus;
  createdAt: string;
  takeoverDate?: string;
  adminNotes?: string;
  finalListingIds?: string[];
}

export interface BookListing {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  condition: BookCondition;
  images: string[];
  isAvailable: boolean;
  sourceRequestId: string;
  category: string;
}

export interface OrderItem {
  listingId: string;
  title: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  address: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CartItem {
  listing: BookListing;
  quantity: number;
}
