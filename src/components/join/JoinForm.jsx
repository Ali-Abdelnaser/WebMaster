import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import PersonalStep from "../../components/join/PersonalStep";
import HRStep from "../../components/join/HRStep";
import Commite from "../../components/join/Commite";
import ReviewSubmit from "../../components/join/ReviewSubmit";
import ProgressBar from "../../components/join/ProgressBar";
import AnimatedBackground3D from "../../components/join/AnimatedBackground";
import HiddenAfterCommite from "../../components/join/HiddenAfterCommite";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/JoinUs.css";
import FormClosedNotice from "../../components/join/FormClosedNotice";
import defaultValues from "../../data/formDefaults";
import { supabase } from "../../data/supabaseClient";
import { useNavigate } from "react-router-dom";
import SubmitAlert from "../../components/join/SubmitAlert";
import stepFields from "../../data/stepFields";
import { Helmet } from "react-helmet";

// ✅ Schema validation
import schema from "../../data/validator";

export default function JoinUs() {
  const navigate = useNavigate();

  // 🔹 state للـ alert
  const [alertData, setAlertData] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // 🔹 load saved values
  const saved =
    typeof window !== "undefined" && localStorage.getItem("joinForm")
      ? JSON.parse(localStorage.getItem("joinForm"))
      : {};

  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      ...saved,
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const visibleSteps = ["Personal", "General", "Commite", "Submit"];
  const allSteps = [
    "Personal",
    "General",
    "Commite",
    "HiddenAfterCommite",
    "Submit",
  ];

  const [formStatus, setFormStatus] = useState({ status: null, open: false });

  useEffect(() => {
    fetch("/formStatus.json")
      .then((res) => res.json())
      .then((data) => setFormStatus(data))
      .catch(() => setFormStatus({ status: "off", open: false }));
  }, []);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem("joinForm", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const currentStep = allSteps[stepIndex];

  // ✅ Helmet Section for SEO
  const seoHelmet = (
    <Helmet>
      <title>Join Us | IEEE MET SB</title>
      <meta
        name="description"
        content="Apply now to join IEEE MET Student Branch in Mansoura, Egypt. Become part of a community of passionate students in technology, leadership, and innovation."
      />
      <meta
        name="keywords"
        content="IEEE, MET SB, Join Us, Recruitment, Students, Technology, Innovation, Leadership, Egypt"
      />

      <meta property="og:title" content="Join Us | IEEE MET SB" />
      <meta
        property="og:description"
        content="Be part of IEEE MET SB — apply now to join our student community in Mansoura, Egypt."
      />
      <meta
        property="og:image"
        content="https://opengraph.b-cdn.net/production/images/e9f5d2c5-0dd8-41ac-b993-06d86db20374.png?token=QophnvuIP3FcHxgJ_K21Wnhvx9Kke2drXBWp7bb1v8g&height=1143&width=1200&expires=33294466238"
      />
      <meta property="og:url" content="https://ieeemet.org/join" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Join Us | IEEE MET SB" />
      <meta
        name="twitter:description"
        content="Submit your application to IEEE MET SB and join a network of students passionate about technology and leadership."
      />
      <meta
        name="twitter:image"
        content="https://opengraph.b-cdn.net/production/images/e9f5d2c5-0dd8-41ac-b993-06d86db20374.png?token=QophnvuIP3FcHxgJ_K21Wnhvx9Kke2drXBWp7bb1v8g&height=1143&width=1200&expires=33294466238"
      />
    </Helmet>
  );

  const next = async () => {
    const values = methods.getValues();
    let fieldsToValidate = [];

    if (currentStep === "Commite") {
      const cycleValid = await methods.trigger("cycle");
      if (!cycleValid) return;

      setDirection(1);
      setStepIndex((s) => Math.min(s + 1, allSteps.length - 1));
      return;
    }

    if (currentStep === "HiddenAfterCommite") {
      // تحقق فقط من أسئلة السيكل المختارة
      fieldsToValidate = stepFields[values.cycle] || [];
    } else {
      // باقي الخطوات
      fieldsToValidate = stepFields[currentStep] || [];
    }

    const valid = await methods.trigger(fieldsToValidate);
    if (!valid) return;

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

  async function handleSubmit(data) {
    const values = methods.getValues();
    const cycleFields = stepFields[values.cycle] || [];

    // تحقق ديناميكي على أسئلة السيكل فقط
    const valid = await methods.trigger(cycleFields);
    if (!valid) return; // لو في خطأ ما يكملش Submit

    try {
      const {
        fullName,
        email,
        phone,
        nationalId,
        university,
        faculty,
        academicYear,
        dateOfBirth,
        address,
        gender,
        linkedIn,
        facebook,
        cycle,
        introduction,
        whyHere,
        workPreference,
        taskOutsideTrack,
        motivationPersistence,
        pressureHandling,
        limitedResources,
        teamValues,
        goalsJoining,
        creativityVsPerfection,
        ...committeeAnswers
      } = data;

      const cleanedAnswers = filterEmpty(committeeAnswers);

      const payload = {
        full_name: fullName,
        email,
        phone,
        national_id: nationalId,
        university,
        faculty,
        academic_year: academicYear,
        date_of_birth: dateOfBirth,
        address,
        gender,
        linkedin: linkedIn,
        facebook,
        cycle,
        introduction,
        why_here: whyHere,
        work_preference: workPreference,
        task_outside_track: taskOutsideTrack,
        motivation_persistence: motivationPersistence,
        pressure_handling: pressureHandling,
        limited_resources: limitedResources,
        team_values: teamValues,
        goals_joining: goalsJoining,
        creativity_vs_perfection: creativityVsPerfection,
        committee_answers: cleanedAnswers,
      };

      const { error } = await supabase.from("applications").insert([payload]);

      if (error) {
        setAlertData({
          isOpen: true,
          type: "error",
          message:
            "⚠️ An error occurred while saving your application. Please try again. If the problem persists, feel free to contact the website owner (see footer for details).",
        });
        return;
      }
      methods.reset(defaultValues); // يرجع للفاضي
      localStorage.removeItem("joinForm");
      localStorage.setItem("showInstructions", "true"); // يمسح النسخة اللي كانت متخزنة
      setStepIndex(0); // يرجع لأول step

      setAlertData({
        isOpen: true,
        type: "success",
        message:
          "Thank you for registering with us! Please stay tuned for updates, and we hope you’ll soon become a valued member of our team.",
      });
    } catch (err) {
      setAlertData({
        isOpen: true,
        type: "error",
        message:
          "An error occurred while saving your application. Please try again. If the problem persists, feel free to contact the website owner (see footer for details).",
      });
    }
  }

  const handleAlertClose = () => {
    setAlertData({ ...alertData, isOpen: false });
    if (alertData.type === "success") {
      navigate("/"); // يروح للهوم بعد OK
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25, // كل عنصر يظهر بعد الآخر
        delayChildren: 0.2,
      },
    },
  };

  // تعريف Variants لكل عنصر
  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 50, damping: 20, mass: 1.2 },
    },
  };
  const renderStep = () => {
    switch (currentStep) {
      case "Personal":
        return <PersonalStep />;
      case "General":
        return <HRStep />;
      case "Commite":
        return <Commite />;
      case "HiddenAfterCommite":
        return <HiddenAfterCommite />;
      case "Submit":
        return <ReviewSubmit onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  if (formStatus.status === null) return <div>Loading...</div>;
  const isOpen = formStatus.status === "on" && formStatus.open === true;

  return isOpen ? (
    <FormProvider {...methods}>
      <motion.div className="join-page">
        {seoHelmet}
        <Header />
        <AnimatedBackground3D />
        <motion.div
          className="join-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="join-header">
              <h1 className="join-title">Join Us</h1>
              <div className="logo-circle">
                <img
                  src="/img/logo-1.png"
                  alt="IEEE Logo"
                  className="join-logo"
                />
              </div>
            </div>
            <ProgressBar
              steps={visibleSteps}
              currentIndex={stepIndex}
              totalSteps={allSteps.length}
            />
            <div className="step-content" style={{ position: "relative" }}>
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
            <div className="controls">
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
          </motion.div>
        </motion.div>
      </motion.div>
      <Footer />

      {/* ✅ الـ Alert هنا */}
      <SubmitAlert
        isOpen={alertData.isOpen}
        type={alertData.type}
        message={alertData.message}
        onClose={handleAlertClose}
      />
    </FormProvider>
  ) : (
    <>
      {seoHelmet}
      <Header />
      <AnimatedBackground3D />
      <FormClosedNotice />
      <Footer />
    </>
  );
}
