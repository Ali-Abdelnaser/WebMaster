import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUserSecret, FaGamepad, FaUsers, FaChartBar, FaSignOutAlt, 
    FaSync, FaTrophy, FaMedal, FaDatabase, FaEdit, 
    FaSearch, FaFilter, FaDownload, FaTrash, FaUndo, FaSave, FaExclamationTriangle, FaCheck,
    FaPlus, FaCrown, FaFire, FaChartPie, FaChevronRight, FaPowerOff, FaTerminal 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, writeBatch, getDocs, setDoc } from 'firebase/firestore';

const dashboardStyle = {};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeStage3: 0,
        totalPoints: 0,
        avgScore: 0,
        totalAttempts: 0
    });
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('game'); // game, site
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    
    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBranch, setFilterBranch] = useState('ALL');
    const [filterPhase, setFilterPhase] = useState('ALL');

    // Question Management States
    const [qList, setQList] = useState([]);
    const [qStage, setQStage] = useState(1);
    const [editingQ, setEditingQ] = useState(null);
    const [qLoading, setQLoading] = useState(false);
    const [qSearchTerm, setQSearchTerm] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [gameLive, setGameLive] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        // Simple auth check
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin-login');
            return;
        }

        setLoading(true);
        const usersRef = collection(db, 'users');
        
        // REAL-TIME LISTENER
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const playerList = [];
            let totalPts = 0;
            let finishedAll = 0;
            let totalAttempts = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                playerList.push({ id: doc.id, ...data });
                totalPts += (data.totalScore || 0);
                if (data.lastCompletedStage >= 3) finishedAll++;
                
                if (data.analytics) {
                    totalAttempts += (parseInt(data.analytics.stage1Attempts) || 0) + 
                                   (parseInt(data.analytics.stage2Attempts) || 0) + 
                                   (parseInt(data.analytics.stage3Attempts) || 0);
                }
            });

            playerList.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
            setPlayers(playerList);
            setStats({
                totalUsers: snapshot.size,
                activeStage3: finishedAll,
                totalPoints: totalPts,
                avgScore: playerList.length > 0 ? Math.floor(totalPts / playerList.length) : 0,
                totalAttempts: totalAttempts
            });
            setLoading(false);
        }, (error) => {
            console.error("Snapshot error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (activeTab === 'questions') {
            setQLoading(true);
            const qRef = collection(db, `questions_s${qStage}`);
            const unsubscribe = onSnapshot(qRef, (snapshot) => {
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQList(list);
                setQLoading(false);
            }, (error) => {
                console.error("Questions fetch error:", error);
                setQLoading(false);
            });
            return () => unsubscribe();
        }
    }, [activeTab, qStage]);

    useEffect(() => {
        const configRef = doc(db, "config", "gameSettings");
        const unsubscribe = onSnapshot(configRef, (doc) => {
            if (doc.exists()) setGameLive(doc.data().isActive);
        });
        return () => unsubscribe();
    }, []);

    // Custom Alert State
    const [alertConfig, setAlertConfig] = useState({
        show: false,
        type: 'confirm', // confirm, error, success
        message: '',
        onConfirm: null
    });

    const triggerAlert = (type, message, onConfirm = null) => {
        setAlertConfig({ show: true, type, message, onConfirm });
    };


    const exportToCSV = () => {
        const headers = ["Rank", "Agent Name", "Email", "Branch", "Phase", "XP", "Last Seen"];
        const rows = players.map((p, i) => [
            i + 1,
            p.fullName || 'Unknown',
            p.id,
            p.branch || '---',
            p.lastCompletedStage,
            p.totalScore || 0,
            p.lastActivity && typeof p.lastActivity.toDate === 'function' ? p.lastActivity.toDate().toLocaleString() : '---'
        ]);

        // Safe CSV encoding with quotes for text fields
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `IEEE_MET_Agents_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleResetPlayer = async (id) => {
        triggerAlert('confirm', `ARE YOU SURE YOU WANT TO RESET PROGRESS FOR ${id}? THIS ACTION IS IRREVERSIBLE.`, async () => {
            try {
                const userRef = doc(db, 'users', id);
                await updateDoc(userRef, {
                    stage1Score: 0, stage1Bonus: 0,
                    stage2Score: 0, stage2Bonus: 0,
                    stage3Score: 0, stage3Bonus: 0,
                    totalScore: 0,
                    lastCompletedStage: 0,
                    'analytics.reinitialized': true
                });
                triggerAlert('success', "AGENT PROGRESS RE-INITIALIZED.");
                setSelectedPlayer(null);
            } catch (err) {
                triggerAlert('error', "RESET FAILED: " + err.message);
            }
        });
    };

    const handleDeletePlayer = async (id) => {
        triggerAlert('confirm', `CRITICAL: PERMANENTLY TERMINATE AGENT ${id}? ALL DATA WILL BE WIPED FROM ARCHIVES.`, async () => {
            try {
                await deleteDoc(doc(db, 'users', id));
                triggerAlert('success', "AGENT TERMINATED PERMANENTLY.");
                setSelectedPlayer(null);
            } catch (err) {
                triggerAlert('error', "TERMINATION FAILED: " + err.message);
            }
        });
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        if (!editingQ) return;
        
        try {
            if (isAddingNew) {
                const qRef = collection(db, `questions_s${qStage}`);
                await addDoc(qRef, {
                    ...editingQ,
                    stage: qStage,
                    createdAt: new Date(),
                    correctCount: 0,
                    incorrectCount: 0
                });
                triggerAlert('success', "NEW QUESTION DEPLOYED SUCCESSFULLY!");
            } else {
                const docRef = doc(db, `questions_s${qStage}`, editingQ.id);
                await updateDoc(docRef, {
                    question: editingQ.question,
                    options: editingQ.options,
                    correct: editingQ.correct
                });
                triggerAlert('success', "INTEL UPDATED SUCCESSFULLY!");
            }
            setEditingQ(null);
            setIsAddingNew(false);
        } catch (err) {
            console.error("Auth error:", err);
            triggerAlert('error', "OPERATION FAILED: " + err.message);
        }
    };

    const handleDeleteQuestion = async (id) => {
        triggerAlert('confirm', "ARE YOU SURE YOU WANT TO DELETE THIS QUESTION PERMANENTLY?", async () => {
            try {
                await deleteDoc(doc(db, `questions_s${qStage}`, id));
                triggerAlert('success', "QUESTION TERMINATED.");
            } catch (err) {
                triggerAlert('error', "TERMINATION FAILED.");
            }
        });
    };

    const toggleGameStatus = async () => {
        try {
            const configRef = doc(db, "config", "gameSettings");
            await setDoc(configRef, { isActive: !gameLive }, { merge: true });
            triggerAlert('success', `GAME SYSTEM ${!gameLive ? 'ACTIVATED' : 'DEACTIVATED'}`);
        } catch (err) {
            triggerAlert('error', "TOGGLE FAILED: " + err.message);
        }
    };

    const handleResetAll = async () => {
        triggerAlert('confirm', "CRITICAL ACTION: DATA WIPE. THIS WILL DELETE ALL PLAYER RECORDS AND SCORES. PROCEED WITH CAUTION!", async () => {
            setIsResetting(true);
            try {
                const batch = writeBatch(db);
                const snapshot = await getDocs(collection(db, 'users'));
                snapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                triggerAlert('success', "CENTRAL DATA WIPE COMPLETED.");
            } catch (err) {
                triggerAlert('error', "WIPE FAILED: " + err.message);
            } finally {
                setIsResetting(false);
            }
        });
    };

    const filteredPlayers = players.filter(p => {
        const matchesSearch = (p.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = filterBranch === 'ALL' || p.branch === filterBranch;
        const matchesPhase = filterPhase === 'ALL' || p.lastCompletedStage.toString() === filterPhase;
        return matchesSearch && matchesBranch && matchesPhase;
    });

    const fetchData = () => { setLoading(true); setTimeout(() => setLoading(false), 500); };
    const handleLogout = () => { sessionStorage.removeItem('admin_auth'); navigate('/'); };

    return (
        <div className="admin-dashboard-root" style={dashboardStyle}>
            {/* Sidebar */}
            <div className="admin-side">
                <div className="logo-section">
                    <FaUserSecret size={30} color="var(--primary)" />
                    <h3>TERMINAL <span>V1.0</span></h3>
                </div>
                
                <div className="menu-group">
                    <button className={`menu-item ${activeTab === 'game' ? 'active' : ''}`} onClick={() => setActiveTab('game')}>
                        <FaGamepad /> GAME COMMAND
                    </button>
                    <button className={`menu-item ${activeTab === 'site' ? 'active' : ''}`} onClick={() => setActiveTab('site')}>
                        <FaDatabase /> DATA ARCHIVE
                    </button>
                    <button className={`menu-item ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
                        <FaEdit /> GAME QUESTIONS
                    </button>
                    <button className={`menu-item ${activeTab === 'top10' ? 'active' : ''}`} onClick={() => setActiveTab('top10')}>
                        <FaCrown /> TOP 10 AGENTS
                    </button>
                </div>

                <div className="status-indicator">
                    <span className="dot"></span> SYSTEM ONLINE
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> TERMINATE SESSION
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                <div className="sticky-header-container">
                    <header className="content-header">
                        <div className="header-title-box">
                            <div className="pulse-line"></div>
                            <h2>OPERATIONS DASHBOARD</h2>
                            <p>ENCRYPTED LINK: IEEE MET SB CENTRAL SQL</p>
                        </div>
                        <div className="header-actions">
                            <div className="live-clock">
                                <span className="label">Live Updates:</span>
                                <span className="val" style={{ color: '#00ff88' }}>● ACTIVE</span>
                            </div>
                            <button className="refresh-btn tactical" onClick={exportToCSV}>
                                <FaDownload />
                                <span>EXPORT DATA</span>
                            </button>
                            <button className="refresh-btn tactical" onClick={fetchData} disabled={loading}>
                                <FaSync className={loading ? 'spin' : ''} />
                                <span>RE-SYNC</span>
                            </button>
                        </div>
                    </header>
                </div>

                <div className="content-scroll-area">
                    <AnimatePresence mode="wait">
                        {activeTab === 'game' ? (
                            <motion.div 
                                key="game"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Branch Distribution Mini-Bar */}
                                <div className="distribution-container">
                                    <div className="dist-header">
                                        <span>BRANCH DISTRIBUTION</span>
                                        <div className="dist-legend">
                                            <span className="dot ieee"></span> IEEE MET SB
                                            <span className="dot mansb"></span> ManSB
                                            <span className="dot met"></span> MET
                                        </div>
                                    </div>
                                    <div className="dist-bar">
                                        <div className="bar ieee" style={{ width: `${(players.filter(p => p.branch === 'IEEE MET SB').length / (players.length || 1)) * 100}%` }}></div>
                                        <div className="bar mansb" style={{ width: `${(players.filter(p => p.branch === 'IEEE ManSB').length / (players.length || 1)) * 100}%` }}></div>
                                        <div className="bar met" style={{ width: `${(players.filter(p => p.branch === 'MET').length / (players.length || 1)) * 100}%` }}></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-icon-box"><FaUsers /></div>
                                        <div className="info">
                                            <span className="label">ACTIVE AGENTS</span>
                                            <span className="value">{loading ? '...' : stats.totalUsers}</span>
                                        </div>
                                        <div className="stat-chart-mini"></div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon-box green"><FaTrophy /></div>
                                        <div className="info">
                                            <span className="label">MISSIONS COMPLETED</span>
                                            <span className="value">{loading ? '...' : stats.activeStage3}</span>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon-box gold"><FaChartBar /></div>
                                        <div className="info">
                                            <span className="label">AVG PERFORMANCE</span>
                                            <span className="value">{loading ? '...' : stats.avgScore}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* SYSTEM CONTROL PANEL */}
                                <div className="admin-power-panel">
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaTerminal /> SYSTEM CONTROL CENTER
                                    </h3>
                                    <div className="power-actions" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                        <button 
                                            className={`p-btn ${gameLive ? 'delete' : 'reset'}`} 
                                            onClick={toggleGameStatus}
                                            style={{ height: '70px', fontSize: '0.9rem' }}
                                        >
                                            <FaPowerOff /> {gameLive ? 'DEACTIVATE GAME (MAINTENANCE)' : 'ACTIVATE GAME (LIVE)'}
                                        </button>
                                        <button 
                                            className="p-btn delete" 
                                            onClick={handleResetAll}
                                            style={{ height: '70px', fontSize: '0.9rem' }}
                                            disabled={isResetting}
                                        >
                                            <FaTrash /> {isResetting ? 'WIPING...' : 'RESET ALL PLAYER DATA (WIPE)'}
                                        </button>
                                    </div>
                                </div>

                                {/* Control Bar */}
                                <div className="control-bar">
                                    <div className="search-box">
                                        <FaSearch className="icon" />
                                        <input 
                                            type="text" 
                                            placeholder="Search Agent Name or ID..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="filters">
                                        <div className="filter-item">
                                            <FaFilter className="mini-icon" />
                                            <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                                                <option value="ALL">ALL BRANCHES</option>
                                                <option value="IEEE MET SB">IEEE MET SB</option>
                                                <option value="IEEE ManSB">IEEE ManSB</option>
                                                <option value="MET">MET</option>
                                            </select>
                                        </div>
                                        <div className="filter-item">
                                            <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)}>
                                                <option value="ALL">ALL PHASES</option>
                                                <option value="0">PHASE 0</option>
                                                <option value="1">PHASE 1</option>
                                                <option value="2">PHASE 2</option>
                                                <option value="3">PHASE 3</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Player Table */}
                                <div className="player-table-container">
                                    <div className="table-header-box">
                                        <div>
                                            <h3>GLOBAL ROSTER</h3>
                                            <p>Showing {filteredPlayers.length} verified agents</p>
                                        </div>
                                        <div className="op-count">TOTAL OPS: {stats.totalAttempts}</div>
                                    </div>

                                    {loading ? (
                                        <div className="skeleton-loader">
                                            {[1,2,3,4,5].map(i => <div key={i} className="skeleton-row"></div>)}
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="player-table">
                                                <thead>
                                                    <tr>
                                                        <th>RANK</th>
                                                        <th>AGENT</th>
                                                        <th>BRANCH</th>
                                                        <th style={{ textAlign: 'center' }}>PHASE</th>
                                                        <th>XP</th>
                                                        <th>LAST SEEN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                     {filteredPlayers.length === 0 ? (
                                                         <tr>
                                                             <td colSpan="6" className="no-data-cell">
                                                                 <div className="no-data-msg">
                                                                     <FaExclamationTriangle size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                                                     <p>NO AGENTS MATCH YOUR CRITERIA</p>
                                                                 </div>
                                                             </td>
                                                         </tr>
                                                     ) : filteredPlayers.map((p, idx) => (
                                                         <tr key={p.id} onClick={() => setSelectedPlayer(p)} className="clickable-row">
                                                            <td className="rank-td">#{idx + 1}</td>
                                                            <td className="agent-name">
                                                                <div className="avatar-wrapper">
                                                                    <img src={p.photoURL || `/img/avatars/${p.selectedCharacter || 'male1'}.png`} alt="" />
                                                                    <div className="status-dot online"></div>
                                                                </div>
                                                                <div className="name">{p.fullName || 'Unknown'}</div>
                                                            </td>
                                                            <td className="branch-cell">{p.branch || '---'}</td>
                                                            <td className="phase-td">
                                                                <div className={`phase-tag s${p.lastCompletedStage}`}>
                                                                    {p.lastCompletedStage}/3
                                                                </div>
                                                            </td>
                                                            <td className="score-val">{p.totalScore || 0}</td>
                                                            <td className="time-val">
                                                                {p.lastActivity && typeof p.lastActivity.toDate === 'function' 
                                                                  ? p.lastActivity.toDate().toLocaleDateString() 
                                                                  : '---'}
                                                            </td>
                                                         </tr>
                                                     ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : activeTab === 'questions' ? (
                            <motion.div 
                                key="questions"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="questions-manager-section"
                            >
                                <div className="questions-control-header">
                                    <div className="stage-selector">
                                        <button className={qStage === 1 ? 'active' : ''} onClick={() => setQStage(1)}>PHASE 1</button>
                                        <button className={qStage === 2 ? 'active' : ''} onClick={() => setQStage(2)}>PHASE 2</button>
                                        <button className={qStage === 3 ? 'active' : ''} onClick={() => setQStage(3)}>PHASE 3</button>
                                    </div>
                                    
                                    <div className="q-search-wrapper">
                                        <FaSearch className="q-search-icon" />
                                        <input 
                                            type="text" 
                                            placeholder="SEARCH QUESTIONS..." 
                                            value={qSearchTerm}
                                            onChange={e => setQSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="hq-actions">
                                        <button className="primary-btn add-btn" onClick={() => {
                                            setIsAddingNew(true);
                                            setEditingQ({ question: '', options: ['', '', '', ''], correct: '' });
                                        }}>
                                            <FaPlus /> NEW QUESTION
                                        </button>
                                    </div>
                                </div>

                                <div className="questions-grid">
                                    {qLoading ? (
                                        <div className="loading-state">DECRYPTING ARCHIVE...</div>
                                    ) : qList.filter(q => q.question.toLowerCase().includes(qSearchTerm.toLowerCase())).map((q, idx) => {
                                        const totalHits = (q.correctCount || 0) + (q.incorrectCount || 0);
                                        const successRate = totalHits > 0 ? Math.round(((q.correctCount || 0) / totalHits) * 100) : 0;
                                        
                                        return (
                                            <div key={q.id} className="q-manage-card">
                                                <div className="q-header">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span className="q-num">#{idx + 1}</span>
                                                        {successRate < 30 && totalHits > 5 && <span className="difficulty-tag hard">HARD</span>}
                                                        {successRate > 70 && totalHits > 5 && <span className="difficulty-tag easy">EASY</span>}
                                                    </div>
                                                    <div className="q-actions-btns">
                                                        <button className="edit-q-btn" onClick={() => {
                                                            setIsAddingNew(false);
                                                            setEditingQ(q);
                                                        }}><FaEdit /></button>
                                                        <button className="delete-q-btn" onClick={() => handleDeleteQuestion(q.id)}><FaTrash /></button>
                                                    </div>
                                                </div>
                                                <p className="q-text">{q.question}</p>
                                                
                                                <div className="q-analytics-mini">
                                                    <div className="ana-item">
                                                        <FaChartPie /> {successRate}% <span>SUCCESS</span>
                                                    </div>
                                                    <div className="ana-item">
                                                        <FaFire /> {totalHits} <span>RESPONSES</span>
                                                    </div>
                                                </div>

                                                <div className="q-options-preview">
                                                    {q.options?.map((opt, i) => (
                                                        <div key={i} className={`opt-tag ${opt === q.correct ? 'correct' : ''}`}>
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : activeTab === 'top10' ? (
                            <motion.div 
                                key="top10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="top-10-section"
                            >
                                <div className="hall-of-fame-header">
                                    <FaCrown className="crown-icon" />
                                    <h2>HALL OF FAME: TOP 10 AGENTS</h2>
                                    <p>ELITE OPERATIVES WITH PEAK PERFORMANCE RATINGS</p>
                                </div>

                                <div className="leaders-grid">
                                    {players.slice(0, 10).map((p, idx) => (
                                        <motion.div 
                                            key={p.id}
                                            initial={{ x: -100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`leader-card rank-${idx + 1}`}
                                        >
                                            <div className="rank-badge">{idx + 1}</div>
                                            <div className="leader-avatar">
                                                <img src={p.photoURL || `/img/avatars/${p.selectedCharacter || 'male1'}.png`} alt="" />
                                            </div>
                                            <div className="leader-info">
                                                <h3>{p.fullName}</h3>
                                                <span className="branch">{p.branch}</span>
                                            </div>
                                            <div className="leader-stats">
                                                <div className="score">{p.totalScore} XP</div>
                                                <div className="phase-indicator">PHASE {p.lastCompletedStage}/3</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                        <motion.div 
                            key="site"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="site-data-section"
                        >
                            <div className="placeholder-msg">
                                <FaDatabase size={60} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                                <h3>ENCRYPTED MODULE: SITE DATA EDITOR</h3>
                                <p>Integration with JSON/Firebase static files planned for Phase 2 Deployment.</p>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <div className="data-node">
                                        <FaEdit />
                                        <span>Committees</span>
                                    </div>
                                    <div className="data-node">
                                        <FaEdit />
                                        <span>Members</span>
                                    </div>
                                    <div className="data-node">
                                        <FaEdit />
                                        <span>Events</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Detailed Player Modal */}
            <AnimatePresence>
                {selectedPlayer && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPlayer(null)}
                    >
                        <motion.div 
                            className="player-detail-card"
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="close-modal" onClick={() => setSelectedPlayer(null)}>&times;</button>
                            
                            <div className="player-detail-header">
                                <div className="main-info">
                                    <img src={selectedPlayer.photoURL || `/img/avatars/${selectedPlayer.selectedCharacter || 'male1'}.png`} alt="" />
                                    <div>
                                        <h2>{selectedPlayer.fullName}</h2>
                                        <p>{selectedPlayer.id}</p>
                                        <div className="detail-tags">
                                            <span className="tag">BRANCH: {selectedPlayer.branch}</span>
                                            <span className={`tag phase-text s${selectedPlayer.lastCompletedStage}`}>PHASE {selectedPlayer.lastCompletedStage}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="big-score">
                                    <span className="label">NET XP</span>
                                    <span className="val">{selectedPlayer.totalScore}</span>
                                </div>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-section">
                                    <h3>MISSION BREAKDOWN</h3>
                                    <div className="mission-scores">
                                        <div className="m-card">
                                            <span className="m-name">STAGE 1</span>
                                            <span className="m-score">{selectedPlayer.stage1Score || 0} XP</span>
                                            <span className="m-bonus">+{selectedPlayer.stage1Bonus || 0} Bonus</span>
                                        </div>
                                        <div className="m-card">
                                            <span className="m-name">STAGE 2</span>
                                            <span className="m-score">{selectedPlayer.stage2Score || 0} XP</span>
                                            <span className="m-bonus">+{selectedPlayer.stage2Bonus || 0} Bonus</span>
                                        </div>
                                        <div className="m-card">
                                            <span className="m-name">STAGE 3</span>
                                            <span className="m-score">{selectedPlayer.stage3Score || 0} XP</span>
                                            <span className="m-bonus">+{selectedPlayer.stage3Bonus || 0} Bonus</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3>INTEL & ANALYTICS</h3>
                                    <div className="intel-list">
                                        <div className="intel-item">
                                            <span className="label">Total Logins</span>
                                            <span className="val">{selectedPlayer.analytics?.totalLogins || 0}</span>
                                        </div>
                                        <div className="intel-item">
                                            <span className="label">S1 Attempts</span>
                                            <span className="val">{selectedPlayer.analytics?.stage1Attempts || 0}</span>
                                        </div>
                                        <div className="intel-item">
                                            <span className="label">S2 Attempts</span>
                                            <span className="val">{selectedPlayer.analytics?.stage2Attempts || 0}</span>
                                        </div>
                                        <div className="intel-item">
                                            <span className="label">S3 Attempts</span>
                                            <span className="val">{selectedPlayer.analytics?.stage3Attempts || 0}</span>
                                        </div>
                                        <div className="intel-item">
                                            <span className="label">Last Interaction</span>
                                            <span className="val">{selectedPlayer.lastActivity && typeof selectedPlayer.lastActivity.toDate === 'function' ? selectedPlayer.lastActivity.toDate().toLocaleString() : '---'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Power actions */}
                            <div className="admin-power-panel">
                                <h3>ADMIN POWER PANEL</h3>
                                <div className="power-actions">
                                    <button className="p-btn reset" onClick={() => handleResetPlayer(selectedPlayer.id)}>
                                        <FaUndo /> RE-INITIALIZE AGENT
                                    </button>
                                    <button className="p-btn delete" onClick={() => handleDeletePlayer(selectedPlayer.id)}>
                                        <FaTrash /> TERMINATE PERMANENTLY
                                    </button>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <p>DATA INTEGRITY: VERIFIED BY IEEE MET SB SYSTEM</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question Edit Modal */}
            <AnimatePresence>
                {editingQ && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingQ(null)}
                    >
                        <motion.div 
                            className="player-detail-card"
                            style={{ maxWidth: '600px' }}
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="close-modal" onClick={() => {
                                setEditingQ(null);
                                setIsAddingNew(false);
                            }}>&times;</button>
                            <h2 className="game-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                                {isAddingNew ? 'DEPLOY NEW INTEL' : `MODIFY INTEL: S${qStage}`}
                            </h2>
                            
                            <form onSubmit={handleUpdateQuestion} className="edit-q-form">
                                <div className="form-group">
                                    <label>QUESTION TEXT</label>
                                    <textarea 
                                        value={editingQ.question} 
                                        onChange={e => setEditingQ({...editingQ, question: e.target.value})}
                                        className="modern-input"
                                        placeholder="Enter the transmission content..."
                                        style={{ height: '100px', resize: 'none' }}
                                        required
                                    />
                                </div>

                                <div className="options-edit-grid">
                                    {editingQ.options?.map((opt, i) => (
                                        <div key={i} className="opt-input-group">
                                            <label>OPTION {String.fromCharCode(65 + i)}</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input 
                                                    type="text" 
                                                    value={opt} 
                                                    onChange={e => {
                                                        const newOpts = [...editingQ.options];
                                                        newOpts[i] = e.target.value;
                                                        setEditingQ({...editingQ, options: newOpts});
                                                    }}
                                                    className="modern-input"
                                                />
                                                <button 
                                                    type="button"
                                                    className={`correct-toggle ${opt === editingQ.correct ? 'active' : ''}`}
                                                    onClick={() => setEditingQ({...editingQ, correct: opt})}
                                                >
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="primary-btn" style={{ flex: 1 }}>
                                        <FaSave /> SAVE CHANGES
                                    </button>
                                    <button type="button" className="secondary-btn" onClick={() => setEditingQ(null)}>
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Alert Modal */}
            <AnimatePresence>
                {alertConfig.show && (
                    <motion.div 
                        className="custom-alert-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={`custom-alert-box ${alertConfig.type}`}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="alert-icon">
                                {alertConfig.type === 'confirm' && <FaExclamationTriangle />}
                                {alertConfig.type === 'error' && <FaExclamationTriangle style={{ color: '#f43f5e' }} />}
                                {alertConfig.type === 'success' && <FaTrophy style={{ color: '#00ff88' }} />}
                            </div>
                            <h3>{alertConfig.type.toUpperCase()}</h3>
                            <p>{alertConfig.message}</p>
                            <div className="alert-actions">
                                {alertConfig.type === 'confirm' ? (
                                    <>
                                        <button className="a-btn cancel" onClick={() => setAlertConfig({ ...alertConfig, show: false })}>CANCEL</button>
                                        <button className="a-btn confirm" onClick={() => { 
                                            alertConfig.onConfirm();
                                            setAlertConfig({ ...alertConfig, show: false });
                                        }}>PROCEED</button>
                                    </>
                                ) : (
                                    <button className="a-btn ok" onClick={() => setAlertConfig({ ...alertConfig, show: false })}>UNDERSTOOD</button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

            <style>{`
                .admin-dashboard-root {
                    background: #020202;
                    height: 100vh;
                    display: flex;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                }
                .admin-side {
                    width: 280px;
                    background: #080808;
                    border-right: 1px solid rgba(0, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                }
                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 3rem;
                }
                .logo-section h3 {
                    font-family: 'Orbitron';
                    font-size: 1rem;
                    letter-spacing: 1px;
                }
                .logo-section h3 span {
                    color: var(--primary);
                    opacity: 0.8;
                }
                .menu-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .menu-item {
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.5);
                    text-align: left;
                    padding: 12px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .menu-item:hover, .menu-item.active {
                    background: rgba(0, 255, 255, 0.1);
                    color: var(--primary);
                }
                .status-indicator {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .status-indicator .dot {
                    width: 6px;
                    height: 6px;
                    background: #00ff88;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #00ff88;
                }
                .logout-btn {
                    background: rgba(244, 63, 94, 0.1);
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    color: #f43f5e;
                    padding: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border-radius: 6px;
                }
                
                .admin-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background: #020202;
                }

                /* Header Redesign */
                /* Header Redesign */
                .sticky-header-container {
                    background: rgba(4, 4, 4, 0.95);
                    backdrop-filter: blur(25px);
                    padding: 2rem 4rem;
                    border-bottom: 2px solid rgba(0, 255, 255, 0.05);
                    z-index: 100;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .header-title-box { 
                    position: relative; 
                    padding-left: 1rem;
                }
                .pulse-line {
                    position: absolute;
                    left: -15px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 45px;
                    background: var(--primary);
                    box-shadow: 0 0 20px var(--primary-glow);
                    border-radius: 4px;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
                
                .header-title-box h2 {
                    font-family: 'Orbitron';
                    letter-spacing: 4px;
                    margin: 0;
                    color: white;
                    font-size: 1.6rem;
                    text-transform: uppercase;
                }
                .header-title-box p { 
                    font-size: 0.75rem; 
                    color: var(--primary); 
                    margin: 6px 0 0 0; 
                    opacity: 0.8; 
                    font-weight: 800; 
                    letter-spacing: 2px;
                }
                
                .header-actions { display: flex; align-items: center; gap: 3rem; }
                .live-clock { display: flex; flex-direction: column; align-items: flex-end; }
                .live-clock .label { font-size: 0.6rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; }
                .live-clock .val { font-size: 0.9rem; color: #00ff88; font-weight: 800; font-family: 'Orbitron'; }

                .refresh-btn {
                    background: rgba(0, 255, 255, 0.05);
                    border: 1px solid rgba(0, 255, 255, 0.2);
                    color: var(--primary);
                    padding: 10px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: 'Orbitron';
                    font-size: 0.7rem;
                    font-weight: 900;
                    transition: all 0.3s;
                    letter-spacing: 1px;
                }
                .refresh-btn:hover {
                    background: var(--primary);
                    color: black;
                    box-shadow: 0 0 20px var(--primary-glow);
                }

                .content-scroll-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 4rem 4rem; /* Lowered content */
                    scrollbar-width: thin;
                    scrollbar-color: var(--primary) transparent;
                }
                .content-scroll-area::-webkit-scrollbar { width: 6px; }
                .content-scroll-area::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

                /* Distribution Chart */
                .distribution-container {
                    margin-bottom: 2rem;
                    background: rgba(4, 4, 4, 0.4);
                    padding: 1.5rem 2rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }
                .dist-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    font-family: 'Orbitron';
                    font-size: 0.65rem;
                    letter-spacing: 2px;
                    color: rgba(255, 255, 255, 0.3);
                }
                .dist-legend { display: flex; gap: 1rem; }
                .dist-legend .dot { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 5px; }
                .dist-legend .dot.ieee { background: var(--primary); }
                .dist-legend .dot.mansb { background: #a855f7; }
                .dist-legend .dot.met { background: #f59e0b; }
                
                .dist-bar {
                    height: 8px;
                    display: flex;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .dist-bar .bar { height: 100%; transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .dist-bar .bar.ieee { background: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
                .dist-bar .bar.mansb { background: #a855f7; }
                .dist-bar .bar.met { background: #f59e0b; }

                /* Stats Cards Redesign */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-bottom: 4rem;
                }
                .stat-card {
                    background: linear-gradient(135deg, #0a0a0a 0%, #050505 100%);
                    padding: 2rem;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    border: 1px solid rgba(255,255,255,0.03);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .stat-card:hover { transform: translateY(-10px); border-color: rgba(0, 255, 255, 0.2); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .stat-icon-box {
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    font-size: 1.8rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .stat-icon-box.green { color: #00ff88; border-color: rgba(0, 255, 136, 0.1); }
                .stat-icon-box.gold { color: var(--gold); border-color: rgba(255, 215, 0, 0.1); }
                .stat-card .label { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
                .stat-card .value { display: block; font-size: 2.22rem; font-weight: 900; font-family: 'Orbitron'; color: white; margin-top: 5px; }

                /* Table Redesign */
                .player-table-container {
                    background: #060606;
                    border-radius: 28px;
                    padding: 3rem;
                    border: 1px solid rgba(255,255,255,0.02);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
                }
                .table-header-box { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
                .table-header-box h3 { font-family: 'Orbitron'; letter-spacing: 4px; font-size: 1.3rem; margin: 0; color: white; }
                .table-header-box p { font-size: 0.85rem; opacity: 0.5; margin: 8px 0 0 0; }
                .op-count { font-family: 'Orbitron'; font-size: 0.8rem; color: #00ff88; background: rgba(0, 255, 136, 0.05); padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(0, 255, 136, 0.1); }

                .player-table { width: 100%; border-collapse: separate; border-spacing: 0 15px; }
                .player-table th { padding: 10px 25px; text-align: left; font-size: 0.7rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
                .player-table td { padding: 20px 25px; background: rgba(255,255,255,0.015); border-top: 1px solid rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.02); }
                .clickable-row { cursor: pointer; transition: all 0.3s; }
                .clickable-row:hover td { background: rgba(0, 255, 255, 0.04); border-color: rgba(0, 255, 255, 0.15); transform: scale(1.005); }
                
                .rank-td { font-family: 'Orbitron'; font-weight: 900; color: rgba(255,255,255,0.15); font-size: 1.1rem; }
                .agent-name { 
                    display: flex; 
                    align-items: center; 
                    gap: 18px; 
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    color: #eee;
                    font-size: 1.05rem;
                }
                .branch-cell {
                    font-size: 0.95rem;
                    color: rgba(255,255,255,0.6);
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                }
                .avatar-wrapper { position: relative; }
                .avatar-wrapper img { width: 48px; height: 48px; border-radius: 14px; background: #111; border: 2px solid rgba(255,255,255,0.05); }
                .status-dot { position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; border-radius: 50%; border: 3px solid #060606; }
                .status-dot.online { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
                
                .phase-td { 
                    vertical-align: middle; 
                    text-align: center;
                }
                .phase-tag { 
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%; 
                    font-size: 0.8rem; 
                    font-weight: 900; 
                    background: rgba(255, 255, 255, 0.02); 
                    color: rgba(255, 255, 255, 0.3); 
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    font-family: 'Orbitron';
                    margin: 0 auto;
                }
                /* Explicit styles for each stage to ensure consistency */
                .phase-tag.s0 { border-color: rgba(244, 63, 94, 0.2); color: #f43f5e; background: rgba(244, 63, 94, 0.03); }
                .phase-tag.s1, .phase-tag.s2 { border-color: rgba(0, 255, 255, 0.2); color: var(--primary); background: rgba(0, 255, 255, 0.03); box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.05); }
                .phase-tag.s3 { 
                    background: rgba(0, 255, 136, 0.05); 
                    color: #00ff88; 
                    border: 2px solid rgba(0, 255, 136, 0.3);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.1), inset 0 0 10px rgba(0, 255, 136, 0.05);
                }
                .score-val { color: var(--gold); font-weight: 900; font-family: 'Orbitron'; font-size: 1.1rem; text-align: left; }
                .time-val { font-size: 0.8rem; opacity: 0.4; }

                /* Control Bar Styles */
                .control-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    background: rgba(4, 4, 4, 0.4);
                    padding: 1.2rem 2rem;
                    border-radius: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }
                .search-box {
                    flex: 1;
                    position: relative;
                    max-width: 500px;
                }
                .search-box .icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--primary);
                    opacity: 0.5;
                }
                .search-box input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 12px 15px 12px 45px;
                    border-radius: 12px;
                    color: white;
                    font-family: 'Inter';
                    font-size: 0.9rem;
                    transition: all 0.3s;
                }
                .search-box input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(0, 255, 255, 0.03);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
                }
                .filters { display: flex; gap: 1rem; }
                .filter-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 4px 12px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .filter-item select {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 0.75rem;
                    font-family: 'Orbitron';
                    font-weight: 800;
                    cursor: pointer;
                    outline: none;
                }
                .filter-item select option { background: #0a0a0a; color: white; }
                .refresh-btn.tactical { 
                    border-color: rgba(0, 255, 255, 0.1); 
                    font-size: 0.65rem; 
                    padding: 8px 16px;
                }

                /* Skeleton Loader */
                .skeleton-loader { display: flex; flex-direction: column; gap: 15px; padding: 20px; }
                .skeleton-row {
                    height: 60px;
                    background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%);
                    background-size: 200% 100%;
                    animation: shiver 1.5s infinite;
                    border-radius: 12px;
                }
                @keyframes shiver { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

                /* Admin Power Panel */
                .admin-power-panel {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px dashed rgba(255, 255, 255, 0.05);
                }
                .admin-power-panel h3 { color: #f43f5e !important; letter-spacing: 4px !important; }
                .power-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
                .p-btn {
                    padding: 12px;
                    border-radius: 10px;
                    border: none;
                    font-family: 'Orbitron';
                    font-size: 0.7rem;
                    font-weight: 900;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s;
                }
                .p-btn.reset { background: rgba(0, 255, 255, 0.05); color: var(--primary); border: 1px solid rgba(0, 255, 255, 0.1); }
                .p-btn.reset:hover { background: var(--primary); color: black; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
                .p-btn.delete { background: rgba(244, 63, 94, 0.05); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.1); }
                .p-btn.delete:hover { background: #f43f5e; color: white; box-shadow: 0 0 20px rgba(244, 63, 94, 0.3); }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .player-detail-card {
                    background: #0a0a0a;
                    width: 100%;
                    max-width: 800px;
                    border-radius: 24px;
                    border: 1px solid rgba(0, 255, 255, 0.1);
                    position: relative;
                    padding: 3rem;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                }
                .close-modal {
                    position: absolute;
                    top: 20px; right: 20px;
                    background: none; border: none;
                    color: white; font-size: 2rem;
                    cursor: pointer; opacity: 0.5;
                }
                .close-modal:hover { opacity: 1; color: var(--primary); }

                .player-detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; }
                .main-info { display: flex; gap: 2rem; align-items: center; }
                .main-info img { width: 100px; height: 100px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.05); }
                .main-info h2 { font-family: 'Orbitron'; margin: 0; font-size: 2rem; }
                .main-info p { color: var(--primary); opacity: 0.6; margin: 5px 0 15px 0; font-family: 'Inter'; }
                .detail-tags { display: flex; gap: 10px; }
                .tag { font-size: 0.65rem; font-weight: 800; background: rgba(255,255,255,0.03); padding: 5px 12px; border-radius: 4px; color: rgba(255,255,255,0.4); }
                .big-score { text-align: right; }
                .big-score .label { display: block; font-size: 0.7rem; color: var(--gold); font-weight: 800; letter-spacing: 2px; }
                .big-score .val { font-size: 3.5rem; font-weight: 900; font-family: 'Orbitron'; color: var(--gold); line-height: 1; }

                .detail-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; }
                .detail-section h3 { font-family: 'Orbitron'; font-size: 0.9rem; letter-spacing: 2px; color: rgba(255,255,255,0.3); margin-bottom: 1.5rem; }
                
                .mission-scores { display: flex; flex-direction: column; gap: 1rem; }
                .m-card { background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; }
                .m-name { font-weight: 800; font-size: 0.8rem; }
                .m-score { color: white; font-family: 'Orbitron'; font-weight: 700; text-align: center; }
                .m-bonus { color: #00ff88; font-size: 0.75rem; text-align: right; }

                .intel-list { background: rgba(0, 255, 255, 0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(0, 255, 255, 0.05); }
                .intel-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
                .intel-item:last-child { border: none; }
                .intel-item .label { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
                .intel-item .val { font-size: 0.75rem; font-weight: 700; color: white; }

                .modal-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.03); text-align: center; font-size: 0.6rem; color: rgba(255,255,255,0.2); letter-spacing: 2px; }

                /* Site Editor Nodes */
                .site-data-section { height: 50vh; display: flex; align-items: center; justify-content: center; }
                .placeholder-msg { text-align: center; }
                .data-node { background: rgba(255,255,255,0.03); padding: 1.5rem 2.5rem; border-radius: 20px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,255,255,0.05); opacity: 0.6; transition: all 0.3s; }
                .data-node:hover { opacity: 1; background: rgba(0, 255, 255, 0.05); border-color: var(--primary); }

                /* Custom Alert Styles */
                .custom-alert-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(15px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .custom-alert-box {
                    background: #080808;
                    width: 90%;
                    max-width: 450px;
                    padding: 3rem;
                    border-radius: 24px;
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.05);
                    box-shadow: 0 40px 100px rgba(0,0,0,1);
                }
                .custom-alert-box.confirm { border-color: var(--gold); }
                .custom-alert-box.error { border-color: #f43f5e; }
                .custom-alert-box.success { border-color: #00ff88; }

                .alert-icon { font-size: 3rem; margin-bottom: 1.5rem; color: var(--gold); }
                .custom-alert-box.error .alert-icon { color: #f43f5e; animation: shake 0.5s ease-in-out; }
                .custom-alert-box h3 { font-family: 'Orbitron'; letter-spacing: 4px; margin-bottom: 1rem; }
                .custom-alert-box p { opacity: 0.6; line-height: 1.6; font-size: 0.95rem; margin-bottom: 2.5rem; }

                .alert-actions { display: flex; gap: 1rem; }
                .a-btn {
                    flex: 1;
                    padding: 15px;
                    border-radius: 12px;
                    border: none;
                    font-family: 'Orbitron';
                    font-size: 0.75rem;
                    font-weight: 900;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .a-btn.cancel { background: rgba(255,255,255,0.05); color: white; }
                .a-btn.cancel:hover { background: rgba(255,255,255,0.1); }
                .a-btn.confirm { background: var(--gold); color: black; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
                .a-btn.confirm:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(212, 175, 55, 0.5); }
                .a-btn.ok { background: var(--primary); color: black; }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }

                /* --- MOBILE RESPONSIVENESS --- */
                @media (max-width: 1024px) {
                    .admin-side { width: 80px; padding: 1.5rem 0.5rem; align-items: center; }
                    .logo-section h3, .menu-item span, .logout-section span, .status-indicator .info { display: none; }
                    .menu-item { justify-content: center; padding: 15px; }
                    .content-area { padding: 1.5rem; }
                    .sticky-header-container { padding: 1.5rem 2rem; }
                }

                @media (max-width: 768px) {
                    .admin-dashboard-root { flex-direction: column; overflow-y: auto; height: auto; }
                    .admin-side { 
                        width: 100%; 
                        height: auto; 
                        flex-direction: row; 
                        justify-content: space-between; 
                        padding: 1rem 1.5rem; 
                        border-right: none; 
                        border-bottom: 1px solid rgba(0, 255, 255, 0.1);
                        position: sticky;
                        top: 0;
                        z-index: 100;
                    }
                    .logo-section { margin-bottom: 0; }
                    .menu-group { flex-direction: row; flex: none; gap: 5px; }
                    .logout-section { margin-top: 0; }
                    .status-indicator { display: none; }

                    .content-area { padding: 1rem; }
                    .sticky-header-container { 
                        position: relative; 
                        padding: 1rem; 
                        margin-bottom: 1rem;
                        background: none;
                        backdrop-filter: none;
                        border-bottom: none;
                    }
                    .content-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .header-actions { width: 100%; justify-content: space-between; }
                    
                    .stats-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .distribution-container { padding: 1rem; }
                    .dist-header { flex-direction: column; align-items: flex-start; gap: 10px; }
                    
                    .control-bar { flex-direction: column; align-items: stretch; gap: 1rem; padding: 1rem; }
                    .search-box { max-width: none; }
                    .filters { justify-content: space-between; }
                    .filter-item { flex: 1; justify-content: center; }
                    .filter-item select { width: 100%; }

                    /* Table adjustment */
                    .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                    .player-table th, .player-table td { padding: 15px 12px; font-size: 0.8rem; }
                    .avatar-wrapper img { width: 35px; height: 35px; }
                    .agent-name { gap: 10px; font-size: 0.9rem; }
                    .phase-tag { width: 35px; height: 35px; font-size: 0.7rem; }

                    /* Modal adjustments */
                    .player-detail-card { padding: 1.5rem; border-radius: 0; height: 100%; max-height: 100vh; overflow-y: auto; }
                    .player-detail-header { flex-direction: column; align-items: center; text-align: center; gap: 1rem; }
                    .main-info { flex-direction: column; gap: 1rem; }
                    .big-score { text-align: center; }
                    .big-score .val { font-size: 2.5rem; }
                    .detail-grid { grid-template-columns: 1fr; }
                    .m-card { grid-template-columns: 1fr; text-align: center; gap: 5px; }
                    .m-score, .m-bonus { text-align: center; }
                    .power-actions { grid-template-columns: 1fr; }
                    
                    .custom-alert-box { padding: 2rem; width: 95%; }
                }

                @media (max-width: 480px) {
                    .header-title-box h2 { font-size: 1.1rem; }
                    .header-actions .refresh-btn span { display: none; }
                    .header-actions .refresh-btn { padding: 10px; }
                    .header-actions { gap: 10px; }
                    .live-clock .label { display: none; }
                }
                /* Questions Manager Styles */
                .questions-manager-section { padding: 2rem; }
                .questions-control-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 2rem;
                    background: rgba(4, 4, 4, 0.4);
                    padding: 1.2rem 2rem;
                    border-radius: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }
                .stage-selector { display: flex; gap: 10px; }
                .stage-selector button {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 10px 20px;
                    border-radius: 10px;
                    color: rgba(255, 255, 255, 0.5);
                    font-family: 'Orbitron';
                    font-size: 0.7rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .stage-selector button.active {
                    background: rgba(0, 255, 255, 0.1);
                    border-color: var(--primary);
                    color: var(--primary);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
                }
                .q-stats { font-family: 'Orbitron'; font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); }

                .questions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }
                .q-manage-card {
                    background: rgba(4, 4, 4, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 1.5rem;
                    transition: all 0.3s;
                }
                .q-manage-card:hover { border-color: rgba(0, 255, 255, 0.2); background: rgba(0, 255, 255, 0.02); }
                .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .q-num { font-family: 'Orbitron'; color: var(--primary); opacity: 0.5; font-size: 0.8rem; }
                .edit-q-btn {
                    background: rgba(0, 255, 255, 0.1);
                    border: none;
                    color: var(--primary);
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .edit-q-btn:hover { background: var(--primary); color: black; }
                .q-text { font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; color: rgba(255, 255, 255, 0.8); }
                .q-options-preview { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .opt-tag {
                    font-size: 0.7rem;
                    background: rgba(255, 255, 255, 0.02);
                    padding: 6px 10px;
                    border-radius: 6px;
                    color: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .opt-tag.correct {
                    background: rgba(0, 255, 136, 0.05);
                    color: #00ff88;
                    border-color: rgba(0, 255, 136, 0.2);
                }

                /* Form Styles */
                .edit-q-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; gap: 10px; }
                .form-group label { font-size: 0.7rem; font-family: 'Orbitron'; color: rgba(255, 255, 255, 0.3); letter-spacing: 2px; }
                .options-edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .opt-input-group { display: flex; flex-direction: column; gap: 8px; }
                .opt-input-group label { font-size: 0.6rem; font-family: 'Orbitron'; color: rgba(255, 255, 255, 0.2); }
                .correct-toggle {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.2);
                    width: 45px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                .correct-toggle.active {
                    background: #00ff88;
                    color: black;
                    border-color: #00ff88;
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
                }
                .modern-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 12px;
                    border-radius: 10px;
                    color: white;
                    font-family: 'Inter';
                    transition: all 0.3s;
                }
                .modern-input:focus { outline: none; border-color: var(--primary); background: rgba(0, 255, 255, 0.03); }

                /* New Feature Styles */
                .q-search-wrapper { position: relative; flex: 1; max-width: 400px; }
                .q-search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--primary); opacity: 0.5; }
                .q-search-wrapper input { 
                    width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 10px 15px 10px 45px; border-radius: 10px; color: white; font-family: 'Inter'; font-size: 0.85rem;
                }
                .hq-actions .add-btn { padding: 10px 20px; font-size: 0.75rem; }
                
                .difficulty-tag { font-size: 0.6rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; letter-spacing: 1px; }
                .difficulty-tag.hard { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.2); }
                .difficulty-tag.easy { background: rgba(0, 255, 136, 0.1); color: #00ff88; border: 1px solid rgba(0, 255, 136, 0.2); }

                .q-actions-btns { display: flex; gap: 8px; }
                .delete-q-btn { 
                    background: rgba(244, 63, 94, 0.1); border: none; color: #f43f5e; 
                    width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;
                }
                .delete-q-btn:hover { background: #f43f5e; color: white; }

                .q-analytics-mini { display: flex; gap: 15px; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
                .ana-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 800; color: rgba(255, 255, 255, 0.6); }
                .ana-item span { font-size: 0.6rem; opacity: 0.5; font-weight: 600; }
                .ana-item svg { color: var(--primary); font-size: 0.85rem; }

                /* TOP 10 Styles */
                .top-10-section { padding: 3rem; text-align: center; }
                .hall-of-fame-header { margin-bottom: 4rem; }
                .crown-icon { font-size: 4rem; color: var(--gold); margin-bottom: 1rem; filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3)); }
                .hall-of-fame-header h2 { font-family: 'Orbitron'; font-size: 2.5rem; letter-spacing: 5px; margin: 0; }
                .hall-of-fame-header p { font-size: 0.9rem; opacity: 0.5; letter-spacing: 3px; font-weight: 700; }

                .leaders-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 900px; margin: 0 auto; }
                .leader-card { 
                    background: rgba(10, 10, 10, 0.4); border: 1px solid rgba(255, 255, 255, 0.03);
                    padding: 1rem 2rem; border-radius: 20px; display: flex; align-items: center; gap: 2rem;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative; overflow: hidden;
                }
                .leader-card:hover { transform: scale(1.02) translateX(10px); background: rgba(0, 255, 255, 0.03); border-color: rgba(0, 255, 255, 0.2); }
                
                .rank-badge { 
                    font-family: 'Orbitron'; font-size: 1.5rem; font-weight: 900; width: 40px; color: rgba(255, 255, 255, 0.2);
                }
                .rank-1 .rank-badge { color: var(--gold); font-size: 2.2rem; }
                .rank-2 .rank-badge { color: #c0c0c0; font-size: 2rem; }
                .rank-3 .rank-badge { color: #cd7f32; font-size: 1.8rem; }

                .leader-avatar img { width: 60px; height: 60px; border-radius: 15px; border: 2px solid rgba(255, 255, 255, 0.05); }
                .leader-info { flex: 1; text-align: left; }
                .leader-info h3 { margin: 0; font-size: 1.2rem; font-family: 'Orbitron'; }
                .leader-info .branch { font-size: 0.8rem; opacity: 0.4; font-weight: 700; }
                
                .leader-stats { text-align: right; }
                .leader-stats .score { font-family: 'Orbitron'; font-size: 1.4rem; font-weight: 900; color: var(--primary); }
                .leader-stats .phase-indicator { font-size: 0.7rem; font-weight: 800; opacity: 0.5; }

                .rank-1 { background: linear-gradient(90deg, rgba(212, 175, 55, 0.05), rgba(10, 10, 10, 0.4)); border-color: rgba(212, 175, 55, 0.2); }
                .rank-1::after { content: 'TOP OPERATIVE'; position: absolute; right: 20px; top: 10px; font-size: 0.6rem; font-weight: 900; color: var(--gold); letter-spacing: 2px; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
