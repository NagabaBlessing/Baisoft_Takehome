import React, { useEffect, useState } from 'react';
import { User, Product, Role, ProductStatus } from '../types';
import { productService } from '../services/productService';
import { Icons } from '../constants';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  
  // Refresh data
  const loadData = () => {
    try {
        setProducts(productService.getProductsForUser(user));
    } catch (e) {
        setProducts([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreate = () => {
    setEditForm({ name: '', price: 0, description: '', imageUrl: '' });
    setIsEditing(true);
  };

  const handleEdit = (product: Product) => {
    setEditForm({ ...product });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.price) return;

    try {
        if (editForm.id) {
            // Update
            productService.updateProduct(editForm as Product, user);
        } else {
            // Create
            productService.createProduct({
                name: editForm.name,
                price: Number(editForm.price),
                description: editForm.description || '',
                imageUrl: editForm.imageUrl || 'https://picsum.photos/400/300?random=' + Math.random(),
                businessId: user.businessId,
                createdBy: user.id
            } as any, user);
        }
        setIsEditing(false);
        loadData();
    } catch (err: any) {
        alert(err.message);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
        try {
            productService.deleteProduct(id, user);
            loadData();
        } catch(err: any) {
            alert(err.message);
        }
    }
  };

  const handleStatusChange = (id: string, status: ProductStatus) => {
    try {
        productService.changeStatus(id, status, user);
        loadData();
    } catch (err: any) {
        alert(err.message);
    }
  };

  const canCreate = user.role === Role.ADMIN || user.role === Role.EDITOR;
  const canApprove = user.role === Role.ADMIN || user.role === Role.APPROVER;
  const canDelete = user.role === Role.ADMIN || user.role === Role.EDITOR;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Business Dashboard</h2>
           <p className="text-sm text-gray-500">Manage your inventory and approvals</p>
        </div>
        {canCreate && (
            <button 
            onClick={handleCreate}
            className="bg-glovo-yellow text-glovo-dark px-4 py-2 rounded-lg font-bold shadow hover:bg-yellow-400 transition flex items-center space-x-2"
            >
            <Icons.Plus />
            <span>New Product</span>
            </button>
        )}
      </div>

      {/* Form Modal (Inline for simplicity) */}
      {isEditing && (
          <div className="p-6 bg-yellow-50 border-b border-yellow-100">
              <h3 className="font-bold text-lg mb-4">{editForm.id ? 'Edit Product' : 'Create Product'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Product Name" 
                        className="p-2 border rounded" 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                        required
                      />
                       <input 
                        type="number" 
                        placeholder="Price" 
                        className="p-2 border rounded" 
                        value={editForm.price || ''} 
                        onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} 
                        required
                      />
                  </div>
                  <textarea 
                    placeholder="Description" 
                    className="w-full p-2 border rounded" 
                    value={editForm.description || ''}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                  <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-glovo-green text-white rounded font-bold hover:bg-green-700">Save</button>
                  </div>
              </form>
          </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                    <div className="font-bold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.id}</div>
                </td>
                <td className="p-4 font-mono text-gray-600">${p.price.toFixed(2)}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        p.status === ProductStatus.APPROVED ? 'bg-green-100 text-green-700' :
                        p.status === ProductStatus.PENDING_APPROVAL ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        {p.status.replace('_', ' ')}
                    </span>
                </td>
                <td className="p-4 text-right space-x-2 flex justify-end">
                    {/* Approval Actions: Only Admin/Approver can Approve */}
                    {canApprove && p.status === ProductStatus.PENDING_APPROVAL && (
                        <button 
                            onClick={() => handleStatusChange(p.id, ProductStatus.APPROVED)}
                            className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100" 
                            title="Approve Product"
                        >
                           <Icons.Check />
                        </button>
                    )}
                    
                    {/* Submit for Approval Actions: Editor/Admin can submit drafts */}
                    {canCreate && p.status === ProductStatus.DRAFT && (
                         <button 
                            onClick={() => handleStatusChange(p.id, ProductStatus.PENDING_APPROVAL)}
                            className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100" 
                            title="Submit for Approval"
                        >
                           <Icons.Shield />
                        </button>
                    )}

                    {/* Edit Actions: Only Admin/Editor can edit. Approver CANNOT edit. */}
                    {canCreate && (
                        <button onClick={() => handleEdit(p)} className="p-2 text-gray-500 hover:text-glovo-dark rounded hover:bg-gray-200">
                            <Icons.Edit />
                        </button>
                    )}
                    
                    {/* Delete Actions */}
                    {canDelete && (
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-600 rounded hover:bg-red-50">
                            <Icons.Trash2 />
                        </button>
                    )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">No products found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};