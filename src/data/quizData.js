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

// Generate simple math questions for now (Addition & Subtraction)
export const getQuestionsForStage = (stage, count = 20) => {
  const pool = [];
  
  // Create a pool of 100 questions per stage
  for (let i = 0; i < 100; i++) {
    const num1 = Math.floor(Math.random() * (10 * stage)) + (5 * stage);
    const num2 = Math.floor(Math.random() * (10 * stage)) + 1;
    const isAddition = Math.random() > 0.5;
    
    const questionText = isAddition ? `${num1} + ${num2}` : `${num1} - ${num2}`;
    const correctAnswer = isAddition ? num1 + num2 : num1 - num2;
    
    // Generate 6 incorrect answers
    const incorrectAnswers = new Set();
    while (incorrectAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrong = correctAnswer + offset;
      if (wrong !== correctAnswer && !incorrectAnswers.has(wrong)) {
        incorrectAnswers.add(wrong);
      }
    }
    
    pool.push({
      question: `What is ${questionText}?`,
      options: shuffle([correctAnswer, ...Array.from(incorrectAnswers)]),
      correct: correctAnswer
    });
  }

  // Shuffle and pick 20
  const selectedQuestions = shuffle([...pool]).slice(0, count);

  return selectedQuestions.map(q => ({
    ...q,
    options: q.options.map(String),
    correct: String(q.correct)
  }));
};
