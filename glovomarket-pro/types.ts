export enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  APPROVER = 'approver',
  VIEWER = 'viewer'
}

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved'
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: Role;
  businessId: string;
  businessName: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdBy: string;
  approvedBy?: string | null;
  businessId: string;
  imageUrl?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}
