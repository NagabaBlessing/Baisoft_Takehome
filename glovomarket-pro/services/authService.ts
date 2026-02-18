import { User, Role } from '../types';
import { dataService } from './data';

const SESSION_KEY = 'glovo_session';

export const authService = {
  login: (email: string): User | null => {
    const users = dataService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  getAllUsers: (): User[] => {
    return dataService.getUsers();
  },
  
  createUser: (name: string, email: string, role: Role, adminUser: User) => {
    if (adminUser.role !== Role.ADMIN) {
        throw new Error("Only Admins can create users");
    }
    
    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        businessId: adminUser.businessId
    };
    
    dataService.addUser(newUser);
    return newUser;
  },

  deleteUser: (userId: string, adminUser: User) => {
     if (adminUser.role !== Role.ADMIN) {
        throw new Error("Only Admins can delete users");
    }
    if (userId === adminUser.id) {
        throw new Error("Cannot delete yourself");
    }
    dataService.deleteUser(userId);
  }
};