import React, { useState, useEffect, useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { auth, googleProvider, db, storage } from '../../config/firebase';
import { signInWithPopup, signInWithRedirect, isSignInWithEmailLink, getRedirectResult } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaGlobe, FaChevronRight, FaImage, FaCheck, FaArrowLeft, FaMedal, FaTrophy, FaCamera, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const characters = [
    { id: 'male1', name: 'Cyber Specialist', icon: '/img/avatars/male1.png', description: 'Hardware expert' },
    { id: 'female1', name: 'Logic Architect', icon: '/img/avatars/female1.png', description: 'System designer' },
    { id: 'male2', name: 'Data Commander', icon: '/img/avatars/male2.png', description: 'Analytics Lead' },
    { id: 'female2', name: 'Security Ghost', icon: '/img/avatars/female2.png', description: 'Encryption Master' }
];

const AuthData = () => {
    const { 
        user, 
        userProfile, 
        setGameState, 
        updateUserProfile, 
        logout, 
        currentStage, 
        setCurrentStage, 
        deleteAccount, 
        showConfirm 
    } = useQuiz();
    const [isEditing, setIsEditing] = useState(!userProfile?.fullName);
    const [formData, setFormData] = useState({
        fullName: '',
        branch: '',
        selectedCharacter: 'male1',
        photoURL: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.fullName || '',
                branch: userProfile.branch || '',
                selectedCharacter: userProfile.selectedCharacter || 'male1',
                photoURL: userProfile.photoURL || ''
            });
            if (userProfile.fullName) setIsEditing(false);
            
            // Sync current stage upon profile load
            const nextStage = userProfile.lastCompletedStage >= 3 ? 3 : (userProfile.lastCompletedStage || 0) + 1;
            setCurrentStage(nextStage);
        }
    }, [userProfile]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // Optimization for Mobile: Check if user is on mobile/tablet
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                // signInWithRedirect is much more reliable on mobile browsers
                await signInWithRedirect(auth, googleProvider);
            } else {
                try {
                    await signInWithPopup(auth, googleProvider);
                } catch (popupError) {
                    // Fallback to redirect if popup is blocked
                    if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
                        await signInWithRedirect(auth, googleProvider);
                    } else {
                        throw popupError;
                    }
                }
            }
        } catch (error) {
            console.error("Login failed", error);
            // Use the global modal for error display
            if (error.code !== 'auth/cancelled-popup-request') {
                alert(`Login failed: ${error.message}. Please try again or check your connection.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Image size should be less than 2MB");
            return;
        }

        setUploading(true);
        try {
            // Delete old photo if exists in storage
            if (formData.photoURL && formData.photoURL.includes('firebasestorage')) {
                try {
                    const oldRef = ref(storage, formData.photoURL);
                    await deleteObject(oldRef);
                } catch (e) {
                    console.log("No old file to delete or error deleting");
                }
            }

            const storageRef = ref(storage, `avatars/${user.email}_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, photoURL: downloadURL }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Make sure you have storage enabled.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!formData.photoURL) return;

        setUploading(true);
        try {
            // Only try to delete from storage if it's our firebase storage link
            if (formData.photoURL.includes('firebasestorage')) {
                const photoRef = ref(storage, formData.photoURL);
                await deleteObject(photoRef);
            }
            
            // Pick a random character as fallback
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            
            setFormData(prev => ({ 
                ...prev, 
                photoURL: '', 
                selectedCharacter: randomChar.id 
            }));
        } catch (error) {
            console.error("Delete failed", error);
            // Even if storage delete fails, reset the UI state
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            setFormData(prev => ({ ...prev, photoURL: '', selectedCharacter: randomChar.id }));
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile({
                ...formData,
                email: user.email,
                lastCompletedStage: userProfile?.lastCompletedStage || 0,
                totalScore: userProfile?.totalScore || 0
            });
            setIsEditing(false);
            if (!userProfile?.fullName) setGameState('rules');
        } catch (error) {
            console.error("Error saving profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ maxWidth: '600px' }}>
                <div style={{ padding: '2rem 1rem' }}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                        <FcGoogle size={80} style={{ marginBottom: '2rem' }} />
                    </motion.div>
                    <h2 className="game-title" style={{ fontSize: '2.5rem' }}>The Arena Awaits</h2>
                    <p className="subtitle">Login to claim your IEEE identity and compete on the global leaderboard.</p>
                    <button className="primary-btn" onClick={handleLogin} disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Scanning...' : 'Sync via Google'} <FaChevronRight />
                    </button>
                </div>
            </motion.div>
        );
    }

    if (!isEditing) {
        return (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ maxWidth: '900px' }}>
                <div className="profile-overview-header">
                    <div className="avatar-large floating-soft">
                        <img 
                            src={formData.photoURL || characters.find(c => c.id === formData.selectedCharacter)?.icon} 
                            alt="Avatar" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    
                    <div className="profile-info-main">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <h2 className="game-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: 0, textAlign: 'left' }}>
                                {userProfile?.fullName || "Recruit"}
                            </h2>
                            <div className="stat-badge" style={{ padding: '6px 16px', fontSize: '0.9rem', background: 'var(--primary-glow)', borderRadius: '12px' }}>
                                PHASE {currentStage}
                            </div>
                        </div>
                        
                        <div style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaGlobe style={{ color: 'var(--primary)' }} /> {userProfile?.branch || "Unassigned Entity"}
                        </div>
                        
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                             <button 
                                className="primary-btn" 
                                onClick={() => {
                                    // CRITICAL: Ensure we are starting the NEXT stage if the current one is finished
                                    const nextStage = userProfile?.lastCompletedStage >= 3 ? 3 : (userProfile?.lastCompletedStage || 0) + 1;
                                    setCurrentStage(nextStage);
                                    setGameState('rules');
                                }} 
                                style={{ flex: 1, minWidth: '220px' }}
                            >
                                {userProfile?.lastCompletedStage > 0 ? 'RESUME MISSION' : 'START MISSION'} <FaChevronRight />
                            </button>
                            <button className="secondary-btn" onClick={() => setIsEditing(true)} style={{ padding: '0.8rem 1.5rem' }}>
                                <FaUserEdit /> EDIT IDENTITY
                            </button>
                        </div>
                    </div>
                </div>

                <div className="profile-badges-grid">
                    <div className="profile-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>TOTAL POINTS</span>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--gold)' }}>{userProfile?.totalScore || 0}</span>
                        <FaTrophy style={{ color: 'var(--gold)', opacity: 0.1, position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '5rem' }} />
                    </div>
                    <div className="profile-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>GLOBAL RANK</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                            <span style={{ fontSize: '2.2rem', fontWeight: 900 }}>#{userProfile?.rank || '---'}</span>
                            <span style={{ fontSize: '1rem', opacity: 0.5, fontWeight: 600 }}>of {userProfile?.totalPlayers || '---'}</span>
                        </div>
                        <FaMedal style={{ color: 'var(--primary)', opacity: 0.1, position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '5rem' }} />
                    </div>
                    <div className="profile-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>STAGES CLEAR</span>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900 }}>{userProfile?.lastCompletedStage || 0}/3</span>
                        <FaCheck style={{ color: 'var(--success)', opacity: 0.1, position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '5rem' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <button className="secondary-btn" onClick={() => setGameState('entry')} style={{ width: '100%', fontSize: '0.9rem', opacity: 0.8 }}>
                        BACK TO ARENA
                    </button>
                    <button className="secondary-btn" style={{ width: '100%', fontSize: '0.9rem', opacity: 0.8 }} onClick={logout}>
                        LOGOUT
                    </button>
                    <button 
                        className="secondary-btn" 
                        style={{ width: '100%', color: 'var(--error)', borderColor: 'rgba(244, 63, 94, 0.2)', fontSize: '0.9rem', opacity: 0.8 }} 
                        onClick={() => { 
                            showConfirm({
                                title: 'CRITICAL WARNING',
                                message: 'This will permanently wipe all your progress and rank from the IEEE MET SB servers. This action is IRREVERSIBLE. Proceed?',
                                type: 'danger',
                                confirmText: 'WIPE IDENTITY',
                                cancelText: 'ABORT',
                                onConfirm: () => deleteAccount()
                            });
                        }}
                    >
                        DELETE IDENTITY
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ maxWidth: '950px' }}>
            <div className="auth-header">
                <button className="secondary-btn back-btn-auth" onClick={() => setIsEditing(false)}>
                    <FaArrowLeft />
                </button>
                <div>
                    <h2 className="game-title main-title-auth">IDENTITY CONFIG</h2>
                    <p className="auth-subtitle">Customize your display and avatar</p>
                </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ textAlign: 'left' }}>
                <div className="auth-form-grid">
                    
                    {/* AVATAR SECTION */}
                    <div className="auth-section">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            <div className="avatar-large auth-avatar-preview">
                                <img 
                                    src={formData.photoURL || characters.find(c => c.id === formData.selectedCharacter)?.icon} 
                                    alt="Preview" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {uploading && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '40px' }}>
                                        <div className="shimmer" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button 
                                    type="button" 
                                    className="primary-btn" 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ padding: '0.8rem 1.5rem', fontSize: '0.85rem' }}
                                    disabled={uploading}
                                >
                                    <FaCamera /> UPLOAD PHOTO
                                </button>
                                {formData.photoURL && (
                                    <button 
                                        type="button" 
                                        className="secondary-btn" 
                                        onClick={handleDeletePhoto}
                                        style={{ padding: '0.8rem', color: 'var(--error)' }}
                                        disabled={uploading}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                            />
                        </div>

                        <div>
                            <label className="subtitle" style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Select Avatar</label>
                            <div className="character-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {characters.map(char => (
                                    <div 
                                        key={char.id} 
                                        className={`char-card ${formData.selectedCharacter === char.id && !formData.photoURL ? 'active' : ''}`}
                                        onClick={() => setFormData({...formData, selectedCharacter: char.id, photoURL: ''})}
                                        style={{ padding: '0.5rem', overflow: 'hidden', borderRadius: '50%' }}
                                    >
                                        <img src={char.icon} alt={char.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DETAILS SECTION */}
                    <div className="auth-section">
                        <div>
                            <label className="subtitle auth-label">Full Designation</label>
                            <div style={{ position: 'relative' }}>
                                <FaUserEdit style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="modern-input"
                                    type="text" 
                                    placeholder="Agent Name" 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    style={{ padding: '16px 16px 16px 45px', width: '75%', borderRadius: '16px' }}
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="subtitle auth-label">IEEE Entity / Branch</label>
                            <div style={{ position: 'relative' }}>
                                <FaGlobe style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="modern-input"
                                    type="text" 
                                    placeholder="Student Branch" 
                                    value={formData.branch} 
                                    onChange={e => setFormData({...formData, branch: e.target.value})}
                                    style={{ padding: '16px 16px 16px 45px', width: '75%', borderRadius: '16px' }}
                                    required 
                                />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}></div>

                        <button type="submit" className="primary-btn" disabled={loading || uploading} style={{ width: '100%', padding: '1.3rem', fontSize: '1.1rem' }}>
                            {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE CHANGES'} <FaCheck />
                        </button>
                    </div>
                </div>
            </form>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
};

export default AuthData;

