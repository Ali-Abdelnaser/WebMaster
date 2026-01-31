import React, { useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRedo, FaSignOutAlt, FaRocket, FaHome, FaUserEdit, FaCheck } from 'react-icons/fa';

const InterStageDashboard = () => {
    const { 
        currentStage, 
        setCurrentStage, 
        stageScore, 
        confidenceBonus, 
        userProfile, 
        setGameState,
        startGame, 
        saveProgress 
    } = useQuiz();

    useEffect(() => {
        saveProgress(currentStage, stageScore, confidenceBonus);
    }, []);

    const handleNextStage = () => {
        if (currentStage < 3) {
            setCurrentStage(prev => prev + 1);
            startGame();
        } else {
            setGameState('final');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="glass-card"
            style={{ maxWidth: '700px',}}
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div className="avatar-large floating-soft" style={{  border: '4px solid var(--success)', boxShadow: '0 0 30px rgba(46, 204, 113, 0.3)' }}>
                    <img src={userProfile?.photoURL || '/img/avatars/male1.png'} alt="Player" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h2 className="game-title" style={{ fontSize: '2.8rem', margin: 0 }}>Stage {currentStage} Secured!</h2>
                    <p className="subtitle" style={{ fontSize: '1.1rem' }}>Outstanding progress, Agent {userProfile?.fullName?.split(' ')[0]}</p>
                </div>
            </motion.div>

            {/* Progress Tracker */}
            <motion.div variants={itemVariants} className="inter-stage-progress">
                {[1, 2, 3].map(s => (
                    <React.Fragment key={s}>
                        <div className={`stage-node ${s < currentStage ? 'completed' : s === currentStage ? 'active' : ''}`}>
                            {s < currentStage ? <FaCheck size={14} /> : s}
                        </div>
                        {s < 3 && <div className={`progress-connector ${s < currentStage ? 'active' : ''}`} />}
                    </React.Fragment>
                ))}
            </motion.div>
            
            {/* Main Stats Card */}
            <motion.div variants={itemVariants} className="success-stat-card">
                <div className="mini-stat">
                    <span className="label">Stage Score</span>
                    <span className="value" style={{ color: 'var(--accent-cyan)' }}>{stageScore}</span>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>PRECISION POINTS</div>
                </div>
                <div className="mini-stat">
                    <span className="label">Confidence</span>
                    <span className="value" style={{ color: 'var(--gold)' }}>+{confidenceBonus}</span>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>BONUS ENERGY</div>
                </div>
            </motion.div>

            {/* Total Score Highlight */}
            <motion.div variants={itemVariants} style={{ 
                background: 'rgba(0, 210, 255, 0.1)', 
                border: '1px solid rgba(0, 210, 255, 0.2)',
                borderRadius: '15px',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2.5rem'
            }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', opacity: 0.8 }}>TOTAL ACCUMULATED SCORE</span>
                <span style={{ fontFamily: 'Orbitron', fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                    {([1, 2, 3]
                        .filter(s => s < currentStage)
                        .reduce((acc, s) => acc + (userProfile?.[`stage${s}Score`] || 0) + (userProfile?.[`stage${s}Bonus`] || 0), 0)) 
                        + stageScore + confidenceBonus}
                </span>
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px var(--primary-glow)' }}
                    whileTap={{ scale: 0.98 }}
                    className="primary-btn" 
                    onClick={handleNextStage}
                    style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
                >
                    {currentStage < 3 ? `IGNITE PHASE ${currentStage + 1}` : 'CLAIM ULTIMATE VICTORY'} <FaArrowRight />
                    <div className="btn-glow"></div>
                </motion.button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <button className="secondary-btn" onClick={() => startGame()} style={{ padding: '0.8rem', fontSize: '0.8rem' }}>
                        <FaRedo /> RETRY
                    </button>
                    <button className="secondary-btn" onClick={() => setGameState('auth')} style={{ padding: '0.8rem', fontSize: '0.8rem' }}>
                         <FaUserEdit /> PROFILE
                    </button>
                    <button className="secondary-btn" onClick={() => setGameState('entry')} style={{ padding: '0.8rem', fontSize: '0.8rem' }}>
                        <FaHome /> ARENA
                    </button>
                </div>
            </motion.div>

            {/* Decorative Scanline Effect */}
            <div className="scanline" style={{ borderRadius: '40px' }}></div>
        </motion.div>
    );
};

export default InterStageDashboard;
