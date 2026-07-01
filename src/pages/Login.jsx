import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!pin) {
            setError('Please enter a PIN');
            return;
        }
        const success = await login(pin);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid PIN');
        }
    };

    return (
        <div id="loginOverlay" style={{ display: 'flex' }}>
            <div className="login-box">
                <div className="brand-icon" style={{ margin: '0 auto 20px' }}>
                    <i className="fa-solid fa-lock"></i>
                </div>
                <h2>Secure ERP Access</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '25px' }}>
                    Enter PIN (Admin: 1234, Staff: 0000)
                </p>
                {error && <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>{error}</p>}
                <input 
                    type="password" 
                    className="pin-input" 
                    maxLength="4" 
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button className="btn-main" onClick={handleLogin}>Unlock System</button>
            </div>
        </div>
    );
};

export default Login;
