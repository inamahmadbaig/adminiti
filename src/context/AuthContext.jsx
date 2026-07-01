import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('erp_token');
        const role = localStorage.getItem('erp_role');
        if (token && role) {
            setUser({ role });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (pin) => {
        try {
            const response = await axios.post('/api/auth/login-pin', { pin });
            const { accessToken, role } = response.data;
            localStorage.setItem('erp_token', accessToken);
            localStorage.setItem('erp_role', role);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setUser({ role });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_role');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
