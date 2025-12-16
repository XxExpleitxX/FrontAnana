import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipado del usuario
export interface User {
    clave: string;
    id: number;
    usuario: string;
    mensaje?: string;
    rol: 'ADMIN' | 'USER';
}

// Tipado del contexto
interface UserContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean; // 👈 nuevo
}

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe usarse dentro de UserProvider');
    }
    return context;
};

// Provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 nuevo

    // Cargar usuario desde localStorage al inicio
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false); // 👈 termina de cargar
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
