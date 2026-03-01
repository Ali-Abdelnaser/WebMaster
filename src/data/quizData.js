import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Helper to shuffle array
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Fetch questions from Firestore
export const getQuestionsForStage = async (stage, count = 20) => {
  try {
    const qRef = collection(db, `questions_s${stage}`);
    const snapshot = await getDocs(qRef);
    
    if (snapshot.empty) {
      console.warn("No questions found in Firestore for stage", stage);
      return generateFallbackQuestions(stage, count);
    }

    let allQuestions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Shuffle and pick 20
    return shuffle(allQuestions).slice(0, count);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return generateFallbackQuestions(stage, count);
  }
};

// Fallback logic for safety
const generateFallbackQuestions = (stage, count) => {
  const pool = [];
  for (let i = 0; i < 50; i++) {
    const num1 = Math.floor(Math.random() * (10 * stage)) + (5 * stage);
    const num2 = Math.floor(Math.random() * (10 * stage)) + 1;
    pool.push({
      question: `Fallback Mode: What is ${num1} + ${num2}?`,
      options: shuffle([String(num1 + num2), String(num1 + num2 + 5), String(num1 + num2 - 3), String(num1 + num2 + 2)]),
      correct: String(num1 + num2)
    });
  }
  return shuffle(pool).slice(0, count);
};
