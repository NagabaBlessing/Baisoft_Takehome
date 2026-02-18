import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authService } from '../services/authService';
import { Icons } from '../constants';

interface UserManagementProps {
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: Role.VIEWER });

  useEffect(() => {
    // Filter to only show users in the same business
    const allUsers = authService.getAllUsers();
    setUsers(allUsers.filter(u => u.businessId === currentUser.businessId));
  }, [currentUser]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
        authService.createUser(newUser.name, newUser.email, newUser.role, currentUser);
        // Refresh list
        const allUsers = authService.getAllUsers();
        setUsers(allUsers.filter(u => u.businessId === currentUser.businessId));
        setNewUser({ name: '', email: '', role: Role.VIEWER });
    } catch (err: any) {
        alert(err.message);
    }
  };

  const handleDeleteUser = (id: string) => {
      if (!confirm("Are you sure you want to remove this user?")) return;
      try {
          authService.deleteUser(id, currentUser);
          const allUsers = authService.getAllUsers();
          setUsers(allUsers.filter(u => u.businessId === currentUser.businessId));
      } catch (err: any) {
          alert(err.message);
      }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
           <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
           <p className="text-sm text-gray-500">Add users and assign roles for your business</p>
      </div>

      <div className="p-6 border-b border-gray-100 bg-white">
          <h3 className="font-bold text-gray-700 mb-3">Add New User</h3>
          <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-grow w-full">
                  <label className="text-xs text-gray-500 block mb-1">Name</label>
                  <input 
                    className="w-full p-2 border rounded-lg bg-gray-50" 
                    value={newUser.name}
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
              </div>
              <div className="flex-grow w-full">
                  <label className="text-xs text-gray-500 block mb-1">Email</label>
                  <input 
                    className="w-full p-2 border rounded-lg bg-gray-50" 
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
              </div>
              <div className="w-full md:w-48">
                   <label className="text-xs text-gray-500 block mb-1">Role</label>
                   <select 
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                   >
                       <option value={Role.ADMIN}>Admin (Full Access)</option>
                       <option value={Role.EDITOR}>Editor (Create/Edit)</option>
                       <option value={Role.APPROVER}>Approver (Approve Only)</option>
                       <option value={Role.VIEWER}>Viewer (Read Only)</option>
                   </select>
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-glovo-yellow text-glovo-dark font-bold rounded-lg hover:bg-yellow-400 transition"
              >
                  Add User
              </button>
          </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-800">{u.name} {u.id === currentUser.id && '(You)'}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase text-gray-600">
                        {u.role}
                    </span>
                </td>
                <td className="p-4 text-right">
                    {u.id !== currentUser.id && (
                        <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-400 hover:text-red-600 p-2"
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