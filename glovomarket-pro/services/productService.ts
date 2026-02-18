import { Product, ProductStatus, Role, User } from '../types';
import { dataService } from './data';

export const productService = {
  getAllProducts: (): Product[] => {
    return dataService.getProducts();
  },

  getApprovedProducts: (): Product[] => {
    return dataService.getProducts().filter(p => p.status === ProductStatus.APPROVED);
  },

  getProductsForUser: (user: User): Product[] => {
    if (user.role === Role.ADMIN || user.role === Role.APPROVER) {
      // Admins and Approvers see everything in their business
      return dataService.getProducts().filter(p => p.businessId === user.businessId);
    }
    if (user.role === Role.EDITOR) {
      // Editors see everything in their business (could restrict to own, but usually business level)
      return dataService.getProducts().filter(p => p.businessId === user.businessId);
    }
    return []; // Viewers shouldn't use this method
  },

  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'status'>, user: User) => {
    // STRICT: Only Admin or Editor can create
    if (user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
         throw new Error('Unauthorized: Only Admins or Editors can create products.');
    }

    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: ProductStatus.DRAFT, // Default to draft
      businessId: user.businessId,
      createdBy: user.id
    };
    dataService.saveProduct(newProduct);
    return newProduct;
  },

  updateProduct: (product: Product, user: User) => {
    // STRICT: Only Admin or Editor can edit
    if (user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
        throw new Error('Unauthorized: You do not have permission to edit products.');
    }
    
    // STRICT: Ensure user belongs to same business
    if (product.businessId !== user.businessId) {
        throw new Error('Unauthorized: Cannot edit products from another business.');
    }

    dataService.saveProduct(product);
  },

  changeStatus: (productId: string, newStatus: ProductStatus, user: User) => {
    const products = dataService.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');

    if (product.businessId !== user.businessId) {
        throw new Error('Unauthorized');
    }

    // STRICT: Approval Logic
    if (newStatus === ProductStatus.APPROVED) {
       if (user.role !== Role.APPROVER && user.role !== Role.ADMIN) {
         throw new Error('Unauthorized: Only Approvers or Admins can approve products.');
       }
    }
    
    // STRICT: Submit Logic (Draft -> Pending)
    if (newStatus === ProductStatus.PENDING_APPROVAL) {
        // Editors or Admins can submit
        if (user.role !== Role.EDITOR && user.role !== Role.ADMIN) {
            throw new Error('Unauthorized: You cannot submit products for approval.');
        }
    }

    product.status = newStatus;
    dataService.saveProduct(product);
  },

  deleteProduct: (productId: string, user: User) => {
    // STRICT: Only Admin can delete (Safety choice), or Editor if we want them to delete their own.
    // Based on "Any authorized user can create or edit", usually delete is stricter.
    if (user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
       throw new Error('Unauthorized: Only Admins or Editors can delete products.');
    }
    
    // Fetch to check ownership/business
    const products = dataService.getProducts();
    const product = products.find(p => p.id === productId);
    if (product && product.businessId !== user.businessId) {
         throw new Error('Unauthorized');
    }

    dataService.deleteProduct(productId);
  }
};