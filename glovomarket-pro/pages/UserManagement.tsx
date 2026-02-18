import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authService } from '../services/authService';
import { Icons } from '../constants';

interface UserManagementProps {
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', role: Role.VIEWER });

  const loadUsers = async () => setUsers(await authService.getAllUsers());
  useEffect(() => { loadUsers(); }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.createUser(newUser);
      setNewUser({ firstName: '', lastName: '', username: '', email: '', password: '', role: Role.VIEWER });
      await loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser.id) return alert('Cannot delete yourself');
    if (!confirm('Delete this user?')) return;
    try {
      await authService.deleteUser(userId);
      await loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50"><h2 className="text-2xl font-bold text-gray-800">User Management</h2></div>
      <div className="p-6 border-b border-gray-100">
        <form onSubmit={handleAddUser} className="grid md:grid-cols-3 gap-3">
          <input className="p-2 border rounded" placeholder="First name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} required />
          <input className="p-2 border rounded" placeholder="Last name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} required />
          <input className="p-2 border rounded" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
          <input type="email" className="p-2 border rounded" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <input type="password" className="p-2 border rounded" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <select className="p-2 border rounded" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}>
            <option value={Role.ADMIN}>Admin</option><option value={Role.EDITOR}>Editor</option><option value={Role.APPROVER}>Approver</option><option value={Role.VIEWER}>Viewer</option>
          </select>
          <button className="md:col-span-3 px-6 py-2 bg-glovo-yellow text-glovo-dark font-bold rounded-lg">Add User</button>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left"><thead><tr><th className="p-4">Name</th><th className="p-4">Username</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody>{users.map((u) => <tr key={u.id}><td className="p-4">{u.name}</td><td className="p-4">{u.username}</td><td className="p-4">{u.role}</td><td className="p-4 text-right">{u.id !== currentUser.id && <button onClick={() => handleDeleteUser(u.id)} className="text-red-500"><Icons.Trash2 /></button>}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};
