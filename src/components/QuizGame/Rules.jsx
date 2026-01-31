import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { motion } from 'framer-motion';
import { 
    FaShieldAlt, 
    FaCheck, 
    FaExclamationCircle, 
    FaTrophy, 
    FaLayerGroup, 
    FaSync, 
    FaMedal, 
    FaChevronLeft, 
    FaBolt,
    FaFingerprint,
    FaGamepad
} from 'react-icons/fa';

const Rules = () => {
    const { startGame, setGameState } = useQuiz();
    const [agreed, setAgreed] = useState(false);

    const protocolItems = [
        { 
            icon: <FaLayerGroup />, 
            title: "Operational Stages", 
            text: "Progression through 3 tactical phases: Cadet, Agent, and Special Envoy levels.",
            color: '#3b82f6'
        },
        { 
            icon: <FaGamepad />, 
            title: "Mission Volume", 
            text: "Each phase consists of 20 randomized IEEE-centric cognitive challenges.",
            color: '#8b5cf6'
        },
        { 
            icon: <FaBolt />, 
            title: "Scoring Protocol", 
            text: "Execution Accuracy (100) + Velocity Bonus (up to 80 points based on speed).",
            color: '#eab308'
        },
        { 
            icon: <FaFingerprint />, 
            title: "Support Assets", 
            text: "3 tactical lifelines (50:50, Hint, Skip) available per stage. Use sparingly.",
            color: '#10b981'
        },
        { 
            icon: <FaExclamationCircle />, 
            title: "Integrity Monitor", 
            text: "Strict Focus Protocol active. Tab switching or browser blurs are logged.",
            color: '#f43f5e'
        },
        { 
            icon: <FaSync />, 
            title: "Cloud Synchronization", 
            text: "Identity and mission progress are synced in real-time to your IEEE profile.",
            color: '#0ea5e9'
        },
        { 
            icon: <FaMedal />, 
            title: "Accreditation", 
            text: "Digital certification and global ranking awarded upon successful mission completion.",
            color: '#f59e0b'
        }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ maxWidth: '750px', padding: '2.5rem' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(0, 98, 155, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaShieldAlt size={30} color="var(--primary)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h2 className="game-title" style={{ fontSize: '2.2rem', margin: 0 }}>Arena Protocols</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6, letterSpacing: '1px' }}>IEEE MET SB OFFICIAL MISSION BRIEFING</p>
                </div>
            </div>
            
            <div className="protocol-content-scroll" style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {protocolItems.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className="protocol-item"
                        >
                            <div className="protocol-icon-wrapper" style={{ color: item.color }}>
                                {item.icon}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px', letterSpacing: '0.5px' }}>{item.title}</div>
                                <div style={{ opacity: 0.6, fontSize: '0.85rem', lineHeight: 1.5 }}>{item.text}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="protocol-agreement-section" onClick={() => setAgreed(!agreed)}>
                <div className={`protocol-checkbox ${agreed ? 'checked' : ''}`}>
                    {agreed && <FaCheck size={12} color="white" />}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, opacity: agreed ? 1 : 0.7 }}>
                    I have read and understood the mission protocols and I am ready to engage.
                </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', width: '100%' }}>
                <button 
                    className="secondary-btn" 
                    style={{ 
                        flex: 1, 
                        padding: '0.9rem 1.2rem', 
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                    }} 
                    onClick={() => setGameState('auth')}
                >
                    <FaChevronLeft /> Back
                </button>
                <motion.button 
                    whileHover={agreed ? { scale: 1.01, boxShadow: '0 0 25px var(--primary-glow)' } : {}}
                    whileTap={agreed ? { scale: 0.98 } : {}}
                    className="primary-btn" 
                    onClick={() => agreed && startGame()}
                    disabled={!agreed}
                    style={{ 
                        flex: 2, 
                        opacity: agreed ? 1 : 0.4, 
                        cursor: agreed ? 'pointer' : 'not-allowed',
                        padding: '0.9rem 1.5rem',
                        fontSize: '0.95rem',
                        borderRadius: '50px',
                        letterSpacing: '0.5px'
                    }}
                >
                    {agreed ? 'ENGAGE MISSION' : 'AWAIT AUTHORIZATION'}
                </motion.button>
            </div>

            <style>{`
                .protocol-content-scroll::-webkit-scrollbar {
                    width: 5px;
                }
                .protocol-content-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .protocol-content-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </motion.div>
    );
};

export default Rules;
