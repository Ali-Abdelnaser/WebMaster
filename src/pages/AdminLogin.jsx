import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUser, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (username === 'IEEEMET' && password === 'web12345') {
            setLoading(true);
            try {
                // Sign in to Firebase to satisfy "authenticated" security rules
                await signInAnonymously(auth);
                sessionStorage.setItem('admin_auth', 'true');
                navigate('/admin-control');
            } catch (err) {
                console.error("Firebase Admin Auth Error:", err);
                setError('SYSTEM ERROR: FIREBASE AUTH BLOCKED');
            } finally {
                setLoading(false);
            }
        } else {
            setError('ACCESS DENIED: INVALID CREDENTIALS');
        }
    };

    return (
        <div className="admin-login-container" style={containerStyle}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card"
                style={cardStyle}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <FaShieldAlt size={50} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', color: 'white' }}>COMMAND CENTER</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>RESTRICTED ACCESS ONLY</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={inputGroupStyle}>
                        <FaUser style={iconStyle} />
                        <input 
                            type="text" 
                            placeholder="OPERATOR ID" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <FaLock style={iconStyle} />
                        <input 
                            type="password" 
                            placeholder="ACCESS CODE" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem', fontFamily: 'monospace' }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-btn" style={btnStyle}>
                        AUTHORIZE ACCESS
                    </button>
                </form>

                <div className="scanline"></div>
            </motion.div>

            <style>{`
                .admin-login-container {
                    background: #050505;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                }
                .admin-login-container::before {
                    content: '';
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    background-image: radial-gradient(rgba(0, 150, 255, 0.1) 1px, transparent 1px);
                    background-size: 30px 30px;
                    top: -50%;
                    left: -50%;
                    animation: grid-move 60s linear infinite;
                }
                @keyframes grid-move {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .login-card {
                    position: relative;
                    z-index: 10;
                    background: rgba(15, 15, 15, 0.9);
                    border: 1px solid rgba(0, 255, 255, 0.2);
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
                    padding: 3rem;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 400px;
                    backdrop-filter: blur(10px);
                }
                .login-btn {
                    width: 100%;
                    background: transparent;
                    border: 1px solid var(--primary);
                    color: var(--primary);
                    padding: 12px;
                    font-family: 'Orbitron';
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    letter-spacing: 1px;
                }
                .login-btn:hover {
                    background: var(--primary);
                    color: black;
                    box-shadow: 0 0 20px var(--primary-glow);
                }
                .scanline {
                    width: 100%;
                    height: 2px;
                    background: rgba(0, 255, 255, 0.1);
                    position: absolute;
                    top: 0;
                    left: 0;
                    animation: scan 3s linear infinite;
                    pointer-events: none;
                }
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
};

const containerStyle = {
    // defined in style tag
};

const cardStyle = {
};

const inputGroupStyle = {
    position: 'relative',
    marginBottom: '1.5rem',
};

const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.4)',
};

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '12px 12px 12px 40px',
    color: 'white',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'monospace',
};

const btnStyle = {
};

export default AdminLogin;
