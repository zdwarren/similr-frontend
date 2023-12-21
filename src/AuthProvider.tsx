import React, { ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('isAdmin') === 'true' ? true : false);
    const isLoggedIn = Boolean(authToken);

    useEffect(() => {
        setAuthToken(localStorage.getItem('authToken'));
        setUsername(localStorage.getItem('username'));
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, []);

    const login = (username: string, password: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('http://localhost:8000/api/api-token-auth/', {
                    username,
                    password,
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem('username', username);  // store username in local storage
                    setAuthToken(response.data.token);
                    setUsername(username); // update username state

                    localStorage.setItem('isAdmin', true ? 'true' : 'false');
                    setIsAdmin(true);

                    resolve();
                } else {
                    reject(new Error("The response did not contain a token"));
                }
            } catch (err) {
                reject(err);
            }
        });
    };

    const signup = async (username: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:8000/api/signup/', {
                username,
                password,
            });

            if (response.data && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('isAdmin', response.data.isAdmin ? 'true' : 'false');
                setAuthToken(response.data.token);
                setUsername(username);
                setIsAdmin(response.data.isAdmin);
            } else {
                // Handle error: the response did not contain a token
            }
        } catch (err) {
            // Handle error: the request failed, e.g. due to network error or 500 status
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
        setAuthToken(null);
        setUsername(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, username, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
