// AuthContext.tsx
import React from 'react';

interface AuthContextInterface {
    isLoggedIn: boolean;
    isAdmin: boolean,
    username: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (username: string, password: string) => Promise<void>;
}

// Create a context with default values
export const AuthContext = React.createContext<AuthContextInterface>({
    isLoggedIn: false,
    isAdmin: true,
    username: '',
    login: () => Promise.resolve(),
    logout: () => { },
    signup: () => Promise.resolve(),
});
