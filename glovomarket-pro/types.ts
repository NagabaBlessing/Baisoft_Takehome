export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  APPROVER = 'APPROVER',
  VIEWER = 'VIEWER'
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  businessId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdBy: string; // User ID
  businessId: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}