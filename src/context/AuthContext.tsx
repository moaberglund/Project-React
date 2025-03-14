import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, AuthContextType } from '../interfaces/auth.types';
import * as Yup from 'yup';

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

    // Yup
    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required").min(5, "Username must be at least 5 characters long").max(20, "Username cannot exceed 20 characters"),
        password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters long").max(20, "Password cannot exceed 20 characters")
    });

    // Functions
    const register = async (credentials: RegisterCredentials) => {
        try {
            // Validate credentials
            await validationSchema.validate(credentials);

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
            if (err instanceof Yup.ValidationError) {
                throw new Error(err.message);  // Validation error
            } else {
                throw new Error("An error occurred during registration");
            }
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

            // Get token and user from API
            const { token, user }: AuthResponse = await res.json();

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Update state
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