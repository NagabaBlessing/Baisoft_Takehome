import React, { useEffect, useState } from 'react';
import { User, Product, Role, ProductStatus } from '../types';
import { productService } from '../services/productService';
import { Icons } from '../constants';
import { formatUsd, formatUgxFromUsd } from '../services/currency';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const loadData = async () => {
    try {
      setProducts(await productService.getProductsForUser());
    } catch (e: any) {
      alert(e.message);
      setProducts([]);
    }
  };

  useEffect(() => { loadData(); }, [user.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.price) return;
    try {
      if (editForm.id) {
        await productService.updateProduct(editForm.id, {
          name: editForm.name,
          description: editForm.description || '',
          price: Number(editForm.price),
          status: editForm.status || ProductStatus.DRAFT,
        });
      } else {
        await productService.createProduct({
          name: editForm.name,
          description: editForm.description || '',
          price: Number(editForm.price),
          status: ProductStatus.DRAFT,
        });
      }
      setIsEditing(false);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await productService.deleteProduct(id);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmitForApproval = async (id: string) => {
    try {
      await productService.submitForApproval(id);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await productService.approveProduct(id);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canCreate = user.role === Role.ADMIN || user.role === Role.EDITOR;
  const canApprove = user.role === Role.ADMIN || user.role === Role.APPROVER;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your inventory and approvals</p>
        </div>
        {canCreate && (
          <button
            onClick={() => { setEditForm({}); setIsEditing(true); }}
            className="bg-glovo-yellow text-glovo-dark px-4 py-2 rounded-lg font-bold shadow"
            title="Add product"
            aria-label="Add product"
          >
            <Icons.Plus />
          </button>
        )}
      </div>

      {isEditing && (
        <div className="p-6 bg-yellow-50 border-b border-yellow-100">
          <form onSubmit={handleSave} className="space-y-4">
            <input className="w-full p-2 border rounded" placeholder="Name" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <input type="number" className="w-full p-2 border rounded" placeholder="Price" value={editForm.price || ''} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} required />
            <textarea className="w-full p-2 border rounded" placeholder="Description" value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            <div className="flex gap-2 justify-end"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-glovo-green text-white rounded">Save</button></div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4">{p.name}</td>
                <td className="p-4">
                  <span className="block font-medium">{formatUsd(p.price)}</span>
                  <span className="block text-xs text-gray-500">{formatUgxFromUsd(p.price)}</span>
                </td>
                <td className="p-4">{p.status}</td>
                <td className="p-4 text-right space-x-2">
                  {canCreate && (
                    <button
                      onClick={() => { setEditForm(p); setIsEditing(true); }}
                      className="p-2"
                      title={`Edit ${p.name}`}
                      aria-label={`Edit ${p.name}`}
                    >
                      <Icons.Edit />
                    </button>
                  )}
                  {canCreate && p.status === ProductStatus.DRAFT && (
                    <button
                      onClick={() => handleSubmitForApproval(p.id)}
                      className="p-2"
                      title={`Submit ${p.name} for approval`}
                      aria-label={`Submit ${p.name} for approval`}
                    >
                      <Icons.Shield />
                    </button>
                  )}
                  {canApprove && p.status === ProductStatus.PENDING_APPROVAL && (
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="p-2"
                      title={`Approve ${p.name}`}
                      aria-label={`Approve ${p.name}`}
                    >
                      <Icons.Check />
                    </button>
                  )}
                  {canCreate && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-red-500"
                      title={`Delete ${p.name}`}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Icons.Trash2 />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
