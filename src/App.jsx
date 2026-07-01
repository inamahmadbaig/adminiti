import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admissions from './pages/Admissions';
import CollectFee from './pages/CollectFee';
import ExpenseBook from './pages/ExpenseBook';
import LogsAndBin from './pages/LogsAndBin';
import DataCenter from './pages/DataCenter';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="admission" element={<Admissions />} />
                <Route path="fee" element={<CollectFee />} />
                <Route path="expense" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><ExpenseBook /></ProtectedRoute>} />
                <Route path="audit" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><LogsAndBin /></ProtectedRoute>} />
                <Route path="database" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><DataCenter /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
