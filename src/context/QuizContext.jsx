import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment, serverTimestamp, collection, query, where, getCountFromServer, deleteDoc } from "firebase/firestore";

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Game State
  const [gameState, setGameState] = useState("entry"); // entry, rules, playing, interStage, final
  const [currentStage, setCurrentStage] = useState(1);
  const [stageScore, setStageScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [confidenceBonus, setConfidenceBonus] = useState(0);
  const [lifelines, setLifelines] = useState({}); // { removeTwo: true, skip: true, hint: true }

  // Global Modal/Alert State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // info, warning, danger, success
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: null,
    showCancel: false
  });

  // Analytics Tracking Helper
  const trackActivity = async (activityType, metadata = {}) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        [`analytics.${activityType}`]: arrayUnion({
          timestamp: new Date().toISOString(),
          ...metadata
        }),
        [`analytics.${activityType}Count`]: increment(1),
        lastActivity: serverTimestamp()
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile from Firestore
        const docRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Calculate Rank and Total Players
            const playersRef = collection(db, "users");
            const qRank = query(playersRef, where("totalScore", ">", data.totalScore || 0));
            const [rankSnap, totalSnap] = await Promise.all([
                getCountFromServer(qRank),
                getCountFromServer(playersRef)
            ]);
            
            const rank = rankSnap.data().count + 1;
            const totalPlayers = totalSnap.data().count;
            
            setUserProfile({ ...data, rank, totalPlayers });
            
            // Track login session
            await updateDoc(docRef, {
              'analytics.loginSessions': arrayUnion({
                timestamp: new Date().toISOString(),
                device: navigator.userAgent
              }),
              'analytics.totalLogins': increment(1),
              lastLogin: serverTimestamp()
            });
            
            // Pre-load progress data and advance to the NEXT stage if available
            if (data.lastCompletedStage !== undefined) {
                const lastStage = data.lastCompletedStage;
                // If they finished stage X, the next stage to play is X + 1 (max 3)
                const nextStage = lastStage >= 3 ? 3 : lastStage + 1;
                setCurrentStage(nextStage);
            } else {
                setCurrentStage(1);
            }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
      try {
          await signOut(auth);
          setUser(null);
          setUserProfile(null);
          setGameState("entry");
          setCurrentStage(1);
      } catch (error) {
          console.error("Logout failed", error);
      }
  };

  const resetGame = () => {
      setCurrentStage(1);
      setStageScore(0);
      setTotalScore(0);
      setConfidenceBonus(0);
      setGameState("auth");
  };

  const saveProgress = async (stage, score, bonus) => {
      if (!user) return;
      
      const newStageScore = score;
      const newStageBonus = bonus;
      
      // Calculate new total score based on the update
      const updatedProfile = {
          ...userProfile,
          [`stage${stage}Score`]: newStageScore,
          [`stage${stage}Bonus`]: newStageBonus,
          lastCompletedStage: Math.max(userProfile?.lastCompletedStage || 0, stage)
      };

      const total = 
          (updatedProfile.stage1Score || 0) + (updatedProfile.stage1Bonus || 0) +
          (updatedProfile.stage2Score || 0) + (updatedProfile.stage2Bonus || 0) +
          (updatedProfile.stage3Score || 0) + (updatedProfile.stage3Bonus || 0);

      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
          [`stage${stage}Score`]: newStageScore,
          [`stage${stage}Bonus`]: newStageBonus,
          lastCompletedStage: updatedProfile.lastCompletedStage,
          totalScore: total
      });

      // Track stage completion
      await trackActivity('stageCompletions', { 
        stage, 
        score: newStageScore, 
        bonus: newStageBonus,
        total: newStageScore + newStageBonus
      });

      setUserProfile({ ...updatedProfile, totalScore: total });
  };

  const updateUserProfile = async (newData) => {
      if (!user) return;
      const userRef = doc(db, "users", user.email);
      await setDoc(userRef, newData, { merge: true });
      
      // Track profile edits
      await trackActivity('profileEdits', { 
        fields: Object.keys(newData)
      });
      
      setUserProfile(prev => ({ ...prev, ...newData }));
  };

  const startGame = async () => {
      // Track stage retry/start
      if (user) {
        const userRef = doc(db, "users", user.email);
        await updateDoc(userRef, {
          [`analytics.stage${currentStage}Attempts`]: increment(1)
        });
        await trackActivity('stageStarts', { stage: currentStage });
      }
      
      // Reset stage specific state
      setStageScore(0);
      setConfidenceBonus(0);
      setLifelines({ removeTwo: true, skip: true, hint: true, pause: true });
      setGameState("playing");
  };

  const startMarathon = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.email);
    const resetData = {
      stage1Score: 0, stage1Bonus: 0,
      stage2Score: 0, stage2Bonus: 0,
      stage3Score: 0, stage3Bonus: 0,
      totalScore: 0,
      lastCompletedStage: 0
    };
    try {
      await updateDoc(userRef, resetData);
      setUserProfile(prev => ({ ...prev, ...resetData, rank: '---' }));
      setCurrentStage(1);
      startGame();
    } catch (error) {
      console.error("Marathon failed", error);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.email);
      await deleteDoc(userRef);
      await logout();
    } catch (error) {
      console.error("Critical: Identity deletion failed", error);
    }
  };

  const quitStage = async () => {
    // Track game exit
    await trackActivity('gameExits', { 
      stage: currentStage, 
      score: stageScore,
      reason: 'userQuit'
    });
    
    // Sync current stage back to what is actually saved in DB
    if (userProfile?.lastCompletedStage) {
        setCurrentStage(userProfile.lastCompletedStage);
        setStageScore(userProfile[`stage${userProfile.lastCompletedStage}Score`] || 0);
        setConfidenceBonus(userProfile[`stage${userProfile.lastCompletedStage}Bonus`] || 0);
    } else {
        setCurrentStage(1);
        setStageScore(0);
        setConfidenceBonus(0);
    }
    
    setGameState("auth");
  };

  const showConfirm = (options) => {
    setModalConfig({
        isOpen: true,
        title: options.title || 'Attention',
        message: options.message || '',
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'No',
        onConfirm: options.onConfirm,
        showCancel: true
    });
  };

  const showAlert = (options) => {
    setModalConfig({
        isOpen: true,
        title: options.title || 'Notice',
        message: options.message || '',
        type: options.type || 'info',
        confirmText: options.confirmText || 'Got it',
        cancelText: '',
        onConfirm: options.onConfirm || null,
        showCancel: false
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const value = {
    user,
    userProfile,
    loading,
    gameState,
    setGameState,
    currentStage,
    setCurrentStage,
    stageScore,
    setStageScore,
    confidenceBonus,
    setConfidenceBonus,
    lifelines,
    setLifelines,
    saveProgress,
    startGame,
    logout,
    resetGame,
    startMarathon,
    deleteAccount,
    quitStage,
    updateUserProfile,
    setUserProfile,
    trackActivity,
    modalConfig,
    showConfirm,
    showAlert,
    closeModal,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
