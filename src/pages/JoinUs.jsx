import { useState, useEffect } from "react";
import Instructions from "../components/join/Instructions";
import JoinForm from "../components/join/JoinForm";

export default function JoinUs() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // كل مرة يدخل صفحة JoinUs نخليه يبدأ من التعليمات
    setShowForm(false);
    localStorage.setItem("seenInstructions", "false");
  }, []);

  const handleStart = () => {
    setShowForm(true);
    localStorage.setItem("seenInstructions", "true");
  };

  const handleFormSubmit = () => {
    // بعد الـ Submit نرجع تاني للتعليمات في المرة الجاية
    localStorage.setItem("seenInstructions", "false");
    setShowForm(false);
  };

  return (
    <div className="join-us-page">
      <JoinForm />
      {/* Recruting Instructions */}
      {/* {!showForm ? (
        <Instructions onStart={handleStart} />
      ) : (
        <JoinForm onFormSubmit={handleFormSubmit} />
      )} */}
    </div>
  );
}
