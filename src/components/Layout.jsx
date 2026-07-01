import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const nav = (path) => {
        setSidebarOpen(false); // Close sidebar on mobile after navigation
        navigate(path);
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100%' }}>
            
            {/* Overlay for mobile */}
            <div 
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''} no-print`} 
                onClick={() => setSidebarOpen(false)}
            ></div>

            <div className={`sidebar no-print ${sidebarOpen ? 'open' : ''}`}>
                <div className="brand">
                    <div className="brand-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                    <h2>SUNSHINE ITI</h2>
                    <p>Seoni, Madhya Pradesh</p>
                    <div className="role-badge">{user?.role === 'ROLE_ADMIN' ? 'ADMIN MODE' : 'STAFF MODE'}</div>
                </div>
                <div className="menu">
                    <div className={`menu-item ${isActive('/')}`} onClick={() => nav('/')}>
                        <i className="fa-solid fa-chart-pie"></i> Master Dashboard
                    </div>
                    <div className={`menu-item ${isActive('/admission')}`} onClick={() => nav('/admission')}>
                        <i className="fa-solid fa-user-plus"></i> Admissions
                    </div>
                    <div className={`menu-item ${isActive('/fee')}`} onClick={() => nav('/fee')}>
                        <i className="fa-solid fa-file-invoice-dollar"></i> Collect Fee
                    </div>
                    
                    {user?.role === 'ROLE_ADMIN' && (
                        <>
                            <div className={`menu-item ${isActive('/expense')}`} onClick={() => nav('/expense')}>
                                <i className="fa-solid fa-wallet"></i> Expense Book
                            </div>
                            <div className={`menu-item ${isActive('/audit')}`} onClick={() => nav('/audit')}>
                                <i className="fa-solid fa-clock-rotate-left"></i> Logs & Bin
                            </div>
                            <div className={`menu-item ${isActive('/database')}`} onClick={() => nav('/database')}>
                                <i className="fa-solid fa-cloud-arrow-up"></i> Data Center
                            </div>
                        </>
                    )}
                </div>
                <div className="sidebar-footer" style={{ padding: '20px', marginTop: 'auto' }}>
                    <button 
                        onClick={logout} 
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                <div className="topbar no-print">
                    <h1 id="pageTitle">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        {location.pathname === '/' && 'Analytics Dashboard'}
                        {location.pathname === '/admission' && 'New Admission'}
                        {location.pathname === '/fee' && 'Fee Collection'}
                        {location.pathname === '/expense' && 'Expense Book'}
                        {location.pathname === '/audit' && 'Audit Logs'}
                        {location.pathname === '/database' && 'Database Management'}
                    </h1>
                    <div className="badge badge-neutral" style={{ fontSize: '14px', padding: '10px 20px', background: 'white', border: '1px solid var(--border-color)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="container-fluid content-area" style={{ display: 'block' }}>
                    <div key={location.pathname} style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
