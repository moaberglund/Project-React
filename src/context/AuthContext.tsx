import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, AuthContextType } from '../interfaces/auth.types';

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode
}

// AuthProvider component

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const API = "https://read-y-api.onrender.com";

    // States
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Functions
    const register = async (credentials: RegisterCredentials) => {
        try {
            // Make API call
            const res = await fetch(`${API}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (!res.ok) {
                throw new Error('Registration failed');
            }

            // Parse response
            const data: AuthResponse = await res.json();

            // Set user
            setUser(data.user);

        } catch (err) {
            throw err;
        }
    }

    const login = async (credentials: LoginCredentials) => {
        try {
            const res = await fetch(`${API}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            // Hämta token och user från API
            const { token, user }: AuthResponse = await res.json();

            // Spara token och user i localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Uppdatera state
            setUser(user);

        } catch (err) {
            throw err;
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    const checkToken = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setUser(JSON.parse(storedUser));
        } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )

}

// Create custom hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}