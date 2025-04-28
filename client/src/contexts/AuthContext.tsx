import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  googleId?: string;
  googleName?: string;
  googlePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data
  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Failed to get user data:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetchUserData(token);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    const success = await fetchUserData(token);
    if (!success) {
      throw new Error('Failed to authenticate user');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 