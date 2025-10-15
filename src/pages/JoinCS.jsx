// src/pages/JoinCS.jsx
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import HeaderCS from "../components/CS/HeaderCS";
import FooterCS from "../components/CS/FooterCS";
import AnimatedBackgroundCS from "../components/CS/AnimatedBackgroundCS";

import PersonalStepCS from "../components/joinCS/PersonalStepCS";
import GeneralStepCS from "../components/joinCS/GeneralStepCS";
import CommiteCS from "../components/joinCS/CommiteCS";
import HiddenAfterCommiteCS from "../components/joinCS/HiddenAfterCommiteCS";
import ReviewSubmitCS from "../components/joinCS/ReviewSubmitCS";
import ProgressBarCS from "../components/joinCS/ProgressBarCS";
import SubmitAlert from "../components/join/SubmitAlert";

import committeeQuestions from "../data/committeeQuestions_CS.json";
import defaultValues from "../data/formDefaults";
import joinCSValidator from "../data/joinCSValidator";
import stepFields from "../data/stepFields_CS";
import { supabase } from "../data/supabaseClient";

import "../styles/JoinCS.css";

export default function JoinCS() {
  const navigate = useNavigate();

  const saved =
    typeof window !== "undefined" && localStorage.getItem("joinFormCS")
      ? JSON.parse(localStorage.getItem("joinFormCS"))
      : {};

  const methods = useForm({
    defaultValues: { ...defaultValues, ...saved },
    resolver: yupResolver(joinCSValidator),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [alertData, setAlertData] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Steps: we keep HiddenAfterCommite in allSteps (hidden in progress)
  const visibleSteps = ["Personal", "General", "Commite", "Submit"];
  const allSteps = [
    "Personal",
    "General",
    "Commite",
    "HiddenAfterCommite",
    "Submit",
  ];

  useEffect(() => {
    const subscription = methods.watch((v) =>
      localStorage.setItem("joinFormCS", JSON.stringify(v))
    );
    return () => subscription.unsubscribe();
  }, [methods]);

  const currentStep = allSteps[stepIndex];

  // SEO helmet (copy of JoinUs but for CS)
  const seoHelmet = (
    <Helmet>
      <title>Join CS | IEEE MET SB</title>
      <meta
        name="description"
        content="Apply to CS tracks — Frontend, Backend, AI, Cybersecurity, Flutter and more."
      />
    </Helmet>
  );

  const next = async () => {
    const values = methods.getValues();
    let fieldsToValidate = [];

    // في حالة إن الستيب هي committee
    if (currentStep === "Commite") {
      const cycleValid = await methods.trigger("cycle");
      if (!cycleValid) return;

      setDirection(1);
      setStepIndex((s) => Math.min(s + 1, allSteps.length - 1));
      return;
    }

    // لو الستيب فيها أسئلة خاصة بالـ cycle
    if (currentStep === "HiddenAfterCommite") {
      const cycle = values.cycle;
      fieldsToValidate = (committeeQuestions[cycle] || []).map((q) => q.name);
    }
    // ✅ أي استيب تانية (Personal / General / غيرها)
    else {
      fieldsToValidate =
        stepFields[currentStep] || stepFields[allSteps[stepIndex]] || [];
    }

    // هنا نعمل الفاليديشن على الأسئلة الخاصة بالستيب الحالية
    const valid = await methods.trigger(fieldsToValidate, {
      shouldFocus: true,
    });
    if (!valid) return; // لو فيه خطأ، متكملش

    setDirection(1);
    setStepIndex((s) => Math.min(s + 1, allSteps.length - 1));
  };

  const back = () => {
    setDirection(-1);
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  function filterEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );
  }
  const handleSubmit = async (data) => {
    try {
      const values = methods.getValues();
      const cycle = values.cycle; // اختيار المستخدم للـ cycle
      const cycleQuestions = committeeQuestions[cycle] || [];
      const cycleAnswers = {};
      cycleQuestions.forEach((q) => {
        if (data[q.name] !== undefined) cycleAnswers[q.name] = data[q.name];
      });
      // Mapping من أسماء الفورم (CamelCase) لأسماء الأعمدة في الجدول (snake_case)
      const payload = {
        fullname: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        nationalid: data.nationalId || "",
        university: data.university || "",
        faculty: data.faculty || "",
        academicyear: data.academicYear || "",
        dateofbirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : null,
        address: data.address || "",
        gender: data.gender || "",
        facebook: data.facebook || "",
        linkedin: data.linkedin || "",
        cycle: data.cycle || "",
        projectidea: data.projectIdea || "",
        csjourney: data.csJourney || "",
        learningstyle: data.learningStyle || "",
        techstack: data.techStack || "",
        teamexperience: data.teamExperience || "",
        challengeapproach: data.challengeApproach || "",
        usercomment: data.userComment || "",
        committee_answers: Object.keys(cycleAnswers).length
          ? cycleAnswers
          : null,

        // حنحط الإجابات الخاصة بالـ cycle هنا
      };

      // جمع إجابات الـ cycle داخل JSON

      // إدخال البيانات في Supabase
      const { error } = await supabase
        .from("cs_applications")
        .insert([payload]);
      if (error) throw error;

      methods.reset(defaultValues);
      localStorage.removeItem("joinFormCS");
      setStepIndex(0);
      setAlertData({
        isOpen: true,
        type: "success",
        message:
          "Success! Your application is in, and our team will review it shortly. We can't wait to connect with you!",
      });
    } catch (err) {
      console.error(err);
      setAlertData({
        isOpen: true,
        type: "error",
        message:
          "Oops! Something went wrong while saving your application. Please try again. If the problem persists, reach out to us via the contact info in the footer.",
      });
    }
  };

  const handleAlertClose = () => {
    setAlertData({ ...alertData, isOpen: false });
    if (alertData.type === "success") {
      navigate("/");
    }
  };

  const stepVariants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case "Personal":
        return <PersonalStepCS />;
      case "General":
        return <GeneralStepCS />;
      case "Commite":
        return <CommiteCS />;
      case "HiddenAfterCommite":
        return <HiddenAfterCommiteCS />;
      case "Submit":
        return <ReviewSubmitCS onSubmit={methods.handleSubmit(handleSubmit)} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="joincs-page">
        {seoHelmet}
        <HeaderCS />
        <AnimatedBackgroundCS />
        <motion.div
          className="joincs-container"
          initial="hidden"
          animate="visible"
        >
          <div className="cs-logo-wrapper">
            <img
              src="/img/CS/CsOrange.webp"
              // src="/img/CS/CsBlack.webp"
              alt="CS Logo"
              className="cs-logo-img"
            />
          </div>

          <ProgressBarCS
            steps={visibleSteps}
            currentIndex={Math.min(stepIndex, visibleSteps.length - 1)}
            totalSteps={allSteps.length}
          />

          <div className="joincs-step">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="joincs-controls">
            {stepIndex > 0 && (
              <button className="btn secondary" onClick={back}>
                Back
              </button>
            )}

            {currentStep !== "Submit" ? (
              <button className="btn primary" onClick={next}>
                Next
              </button>
            ) : (
              <button
                className="btn primary"
                onClick={methods.handleSubmit(handleSubmit)}
              >
                Submit
              </button>
            )}
          </div>

          <SubmitAlert
            isOpen={alertData.isOpen}
            type={alertData.type}
            message={alertData.message}
            onClose={handleAlertClose}
          />
        </motion.div>
        <FooterCS />
      </div>
    </FormProvider>
  );
}
