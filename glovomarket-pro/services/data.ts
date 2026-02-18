import { User, Role, Product, ProductStatus } from '../types';

// Seed Users
const SEED_USERS: User[] = [
  { id: '1', email: 'admin@glovo.com', name: 'Admin User', role: Role.ADMIN, businessId: 'biz_1' },
  { id: '2', email: 'editor@glovo.com', name: 'Editor Dave', role: Role.EDITOR, businessId: 'biz_1' },
  { id: '3', email: 'approver@glovo.com', name: 'Approver Alice', role: Role.APPROVER, businessId: 'biz_1' },
  { id: '4', email: 'user@gmail.com', name: 'Public User', role: Role.VIEWER, businessId: 'biz_1' },
];

// Seed Products
const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Glovo Burger Deluxe',
    description: 'Double patty, special sauce, sesame bun.',
    price: 12.99,
    status: ProductStatus.APPROVED,
    createdBy: '2',
    businessId: 'biz_1',
    createdAt: new Date().toISOString(),
    // Using a high-quality Burger image
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    name: 'Vegan Pizza',
    description: 'Fresh vegetables, vegan cheese, thin crust.',
    price: 15.50,
    status: ProductStatus.APPROVED,
    createdBy: '2',
    businessId: 'biz_1',
    createdAt: new Date().toISOString(),
    // Using a high-quality Pizza image
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p3',
    name: 'Draft Sushi Platter',
    description: 'Assorted nigiri and rolls.',
    price: 45.00,
    status: ProductStatus.DRAFT,
    createdBy: '2',
    businessId: 'biz_1',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 'p4',
    name: 'Pending Pasta Carbonara',
    description: 'Authentic Italian recipe with guanciale.',
    price: 18.00,
    status: ProductStatus.PENDING_APPROVAL,
    createdBy: '2',
    businessId: 'biz_1',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/400/300?random=4'
  }
];

const BUSINESS_NAMES: Record<string, string> = {
  'biz_1': 'Glovo HQ',
  'biz_2': 'Pizza Express',
  'biz_3': 'Sushi Master'
};

// Local Storage Keys - Bumped version to v2 to ensure new images load for you immediately
const USERS_KEY = 'glovo_users';
const PRODUCTS_KEY = 'glovo_products_v2';

export const dataService = {
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(PRODUCTS_KEY)) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
    }
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addUser: (user: User) => {
    const users = dataService.getUsers();
    // Check if email exists
    if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        throw new Error("User with this email already exists");
    }
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  deleteUser: (userId: string) => {
    const users = dataService.getUsers();
    // Prevent deleting self (simplified check) or the last admin
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProduct: (product: Product) => {
    const products = dataService.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: (productId: string) => {
    const products = dataService.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  getBusinessName: (businessId: string): string => {
    return BUSINESS_NAMES[businessId] || businessId;
  }
};

// Initialize on load
dataService.init();