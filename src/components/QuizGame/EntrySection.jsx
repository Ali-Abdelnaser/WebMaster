import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { motion } from 'framer-motion';
import { FaTrophy, FaRocket, FaBolt, FaSignOutAlt, FaMedal, FaStar } from 'react-icons/fa';
import { db } from '../../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './EntryArena.css';

const characters = [
    { id: 'techy', name: 'Cyber Hero', icon: '🤖', description: 'Master of code' },
    { id: 'spark', name: 'Volt Walker', icon: '⚡', description: 'Power master' },
    { id: 'brainy', name: 'Logic Sage', icon: '🧠', description: 'Deep analyst' },
    { id: 'quantum', name: 'Data Ghost', icon: '⚛️', description: 'Tech ghost' }
];

const EntrySection = () => {
    const { setGameState, user, userProfile, logout, setCurrentStage } = useQuiz();
    const [topPlayers, setTopPlayers] = React.useState([]);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(3));
                const querySnapshot = await getDocs(q);
                const players = [];
                querySnapshot.forEach((doc) => {
                    players.push({ id: doc.id, ...doc.data() });
                });
                setTopPlayers(players);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };
        fetchLeaderboard();
    }, []);

    const handleMissionControl = () => {
        if (!user) {
            setGameState('auth');
            return;
        }

        // If logged in, check progress
        if (userProfile?.lastCompletedStage === 3) {
            setGameState('final');
        } else if (userProfile?.lastCompletedStage > 0) {
            // CRITICAL: Ensure we are showing the inter-stage dashboard for the CORRECT stage
            setCurrentStage(userProfile.lastCompletedStage);
            setGameState('interStage');
        } else {
            setGameState('auth'); // Shows profile overview or edit
        }
    };

    const getMedalColor = (index) => {
        if (index === 0) return '#FFD700'; // Gold
        if (index === 1) return '#C0C0C0'; // Silver
        if (index === 2) return '#CD7F32'; // Bronze
    };

    const getMedalGlow = (index) => {
        if (index === 0) return '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)';
        if (index === 1) return '0 0 30px rgba(192, 192, 192, 0.6), 0 0 60px rgba(192, 192, 192, 0.3)';
        if (index === 2) return '0 0 30px rgba(205, 127, 50, 0.6), 0 0 60px rgba(205, 127, 50, 0.3)';
    };

    const getPodiumHeight = (index) => {
        if (index === 0) return '180px'; // 1st place - tallest
        if (index === 1) return '140px'; // 2nd place
        if (index === 2) return '110px'; // 3rd place
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.8, 
                staggerChildren: 0.15 
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const podiumVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="entry-arena-wrapper">
            {/* Animated Space Background */}
            <div className="arena-space-bg">
                <div className="stars-layer"></div>
                <div className="stars-layer-2"></div>
                <div className="stars-layer-3"></div>
                <div className="nebula-glow"></div>
                
                {/* Distant Planets */}
                <div className="distant-planet planet-1"></div>
                <div className="distant-planet planet-2"></div>
                
                {/* Cosmic Rings */}
                <div className="cosmic-ring ring-1"></div>
                <div className="cosmic-ring ring-2"></div>
            </div>

            <motion.div 
                className="entry-content-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="arena-header">
                    <motion.div 
                        className="floating-logo"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img src="/logo.png" alt="IEEE Logo" 
                            onError={(e) => e.target.style.display = 'none'} />
                    </motion.div>
                    <h1 className="arena-title">
                        <span className="title-gradient">IEEE MET SB</span>
                        <br />
                        <span className="title-challenge">Ultimate Challenge</span>
                    </h1>
                    <p className="arena-tagline">
                        <FaBolt className="tagline-icon" />
                        Where Knowledge Meets Glory
                        <FaBolt className="tagline-icon" />
                    </p>
                </motion.div>

                {/* Motivational Quote */}
                <motion.div variants={itemVariants} className="motivation-card">
                    <FaStar className="quote-icon" />
                    <p className="motivation-text">
                        "Test your limits. Challenge the best. Rise to the top."
                    </p>
                    <div className="motivation-stats">
                        <span><FaRocket /> 3 Epic Stages</span>
                        <span><FaTrophy /> Unlimited Glory</span>
                    </div>
                </motion.div>

                {/* Podium Section - Top 3 Players */}
                <motion.div variants={itemVariants} className="podium-section">
                    <div className="podium-header">
                        <FaTrophy className="podium-trophy-icon" />
                        <h2>Hall of Champions</h2>
                    </div>

                    <div className="podium-container">
                        {topPlayers.length > 0 ? (
                            <>
                                {/* Reorder: 2nd, 1st, 3rd for visual podium effect */}
                                {[1, 0, 2].map((originalIndex) => {
                                    const player = topPlayers[originalIndex];
                                    if (!player) return null;
                                    
                                    const displayRank = originalIndex + 1;
                                    
                                    return (
                                        <motion.div
                                            key={player.id}
                                            className={`podium-player rank-${displayRank}`}
                                            variants={podiumVariants}
                                            whileHover={{ scale: 1.05, y: -10 }}
                                        >
                                            {/* Medal Badge */}
                                            <div 
                                                className="medal-badge"
                                                style={{
                                                    background: getMedalColor(originalIndex),
                                                    boxShadow: getMedalGlow(originalIndex)
                                                }}
                                            >
                                                <FaMedal size={displayRank === 1 ? 32 : 24} />
                                            </div>

                                            {/* Avatar */}
                                            <div 
                                                className="player-avatar"
                                                style={{
                                                    borderColor: getMedalColor(originalIndex),
                                                    boxShadow: getMedalGlow(originalIndex)
                                                }}
                                            >
                                                <div className="avatar-display-wrapper" style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                                                    {player.photoURL ? (
                                                        <img src={player.photoURL} alt={player.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span className="avatar-emoji">
                                                            {player.selectedCharacter ? (characters.find(c => c.id === player.selectedCharacter)?.icon.length > 5 ? <img src={characters.find(c => c.id === player.selectedCharacter).icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : characters.find(c => c.id === player.selectedCharacter)?.icon) : (player.character || '🤖')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Player Info */}
                                            <div className="player-info">
                                                <h3 className="player-name">
                                                    {player.fullName || 'Anonymous'}
                                                </h3>
                                                <p className="player-branch">
                                                    {player.branch || 'Main Branch'}
                                                </p>
                                                <div 
                                                    className="player-score"
                                                    style={{ color: getMedalColor(originalIndex) }}
                                                >
                                                    {player.totalScore || 0} PTS
                                                </div>
                                            </div>

                                            {/* Podium Base */}
                                            <div 
                                                className="podium-base"
                                                style={{
                                                    height: getPodiumHeight(originalIndex),
                                                    background: `linear-gradient(180deg, ${getMedalColor(originalIndex)}22, ${getMedalColor(originalIndex)}05)`,
                                                    borderTop: `3px solid ${getMedalColor(originalIndex)}`
                                                }}
                                            >
                                                <span className="podium-rank">#{displayRank}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="loading-podium">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaTrophy size={48} color="#FFD700" />
                                </motion.div>
                                <p>Loading Champions...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="arena-actions">
                    <motion.button 
                        className="arena-cta-btn primary"
                        onClick={handleMissionControl}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 210, 255, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaRocket />
                        <span>{user ? 'Mission Control' : 'Enter the Arena'}</span>
                        <div className="btn-glow"></div>
                    </motion.button>

                    {user && (
                        <motion.button 
                            className="arena-cta-btn secondary"
                            onClick={logout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSignOutAlt />
                            <span>Log Out</span>
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default EntrySection;
