import { createContext, useContext, useState, type ReactNode } from 'react';

type Role = 'admin' | 'operator' | 'volunteer' | 'fan';

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock JWT payload setup for architecture realism
  const [user, setUser] = useState<User | null>({
    id: 'usr_123',
    name: 'Ops Admin',
    role: 'admin', // MOCKED ROLE
  });

  const login = (role: Role) => {
    setUser({ id: `usr_${Math.random().toString(36).substring(7)}`, name: 'Test User', role });
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
