// src/pages/GenesisRegistration.jsx
// Complete Genesis Team Registration Flow (Multi-Step Form with Pre-Authorized Upload Sessions & Database RPC)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

import Header from "../components/Header";
import Footer from "../components/Footer";
import GenesisCubeBackground from "../components/genesis/GenesisCubeBackground";
import { GENESIS_CONFIG } from "../config/genesisConfig";
import { useEventCountdown } from "../hooks/useEventCountdown";
import { supabase } from "../config/supabase";

import GenesisTeamDetails from "../components/genesis/GenesisTeamDetails";
import GenesisMembersSection from "../components/genesis/GenesisMembersSection";
import GenesisReview from "../components/genesis/GenesisReview";
import GenesisRegistrationSuccess from "../components/genesis/GenesisRegistrationSuccess";
import GenesisRegistrationClosed from "../components/genesis/GenesisRegistrationClosed";

import {
  validateTeamDetails,
  validateAllMembers,
} from "../utils/genesisValidation";

import "../styles/GenesisRegistration.css";

// Helper to create an empty member object
function createEmptyMember() {
  return {
    full_name: "",
    national_id: "",
    phone: "",
    email: "",
    discord_link: "",
    university: "",
    faculty: "",
    academic_year: "",
  };
}

export default function GenesisRegistration() {
  const countdown = useEventCountdown(GENESIS_CONFIG.registrationDeadline);

  // Multi-step form step index (1: Team, 2: Members, 3: Review, 4: Success)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [team, setTeam] = useState({
    team_name: "",
    project_idea: "",
    demo_video_url: "",
    track: "",
    team_size: 1,
  });

  const [members, setMembers] = useState([
    createEmptyMember(), // Member 1 (Leader)
  ]);

  // Validation States
  const [teamErrors, setTeamErrors] = useState({});
  const [memberErrors, setMemberErrors] = useState([]);

  // Submission States
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);

  // ─── Step 1 Handlers ──────────────────────────────────────────
  const handleTeamChange = (field, value) => {
    setTeam((prev) => ({ ...prev, [field]: value }));
    if (teamErrors[field]) {
      setTeamErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTrackSelect = (trackName) => {
    setTeam((prev) => ({ ...prev, track: trackName }));
    if (teamErrors.track) {
      setTeamErrors((prev) => ({ ...prev, track: "" }));
    }
  };

  // Dynamic resizing: preserves existing member data when expanding, cleanly slices when reducing
  const handleTeamSizeChange = (newSize) => {
    const size = Number(newSize);
    setTeam((prev) => ({ ...prev, team_size: size }));
    if (teamErrors.team_size) {
      setTeamErrors((prev) => ({ ...prev, team_size: "" }));
    }

    setMembers((prevMembers) => {
      if (size > prevMembers.length) {
        // Expand
        const additional = Array.from(
          { length: size - prevMembers.length },
          () => createEmptyMember()
        );
        return [...prevMembers, ...additional];
      } else {
        // Shrink (keeps first `size` members)
        return prevMembers.slice(0, size);
      }
    });

    setMemberErrors((prevErrors) => prevErrors.slice(0, size));
  };

  const handleContinueToMembers = () => {
    const { errors, isValid } = validateTeamDetails(team);
    setTeamErrors(errors);

    if (isValid) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ─── Step 2 Handlers ──────────────────────────────────────────
  const handleMemberChange = (index, field, value) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (memberErrors[index]?.[field]) {
      setMemberErrors((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: "" };
        return updated;
      });
    }
  };

  const handleContinueToReview = () => {
    const { memberErrors: errorsList, hasErrors } = validateAllMembers(
      members,
      team.team_size
    );
    setMemberErrors(errorsList);

    if (!hasErrors) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ─── Final Submit Handler ─────────────────────────────────────
  const handleSubmitRegistration = async () => {
    // 1. Client-side deadline verification (>= boundary)
    if (countdown.isClosed) {
      setSubmitError("Genesis registration is now closed.");
      return;
    }

    // 2. Comprehensive validation
    const teamCheck = validateTeamDetails(team);
    const membersCheck = validateAllMembers(members, team.team_size);

    if (!teamCheck.isValid) {
      setTeamErrors(teamCheck.errors);
      setCurrentStep(1);
      return;
    }

    if (membersCheck.hasErrors) {
      setMemberErrors(membersCheck.memberErrors);
      setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const activeMembers = members.slice(0, team.team_size);
      setUploadProgressText("Saving team registration...");

      // 3. Prepare payload for direct atomic RPC
      const preparedMembers = activeMembers.map((member, i) => ({
        member_order: i + 1,
        role: i === 0 ? "leader" : "member",
        full_name: member.full_name.trim(),
        national_id: member.national_id.trim(),
        phone: member.phone.trim(),
        email: member.email.trim().toLowerCase(),
        discord_link: member.discord_link.trim(),
        university: member.university.trim(),
        faculty: member.faculty.trim(),
        academic_year: member.academic_year,
      }));

      const teamPayload = {
        team_name: team.team_name.trim(),
        project_idea: team.project_idea.trim(),
        demo_video_url: team.demo_video_url?.trim() || "",
        track: team.track,
        team_size: Number(team.team_size),
      };

      const { data, error: rpcError } = await supabase.rpc(
        "register_genesis_team",
        {
          p_team: teamPayload,
          p_members: preparedMembers,
        }
      );

      if (rpcError) {
        console.error("[Genesis Submit] register_genesis_team error:", rpcError);
        throw rpcError;
      }

      // 4. Success!
      setSubmissionResult(data);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[Genesis Submit Failure]", {
        errorName: err?.name,
        errorMessage: err?.message,
        status: err?.status || err?.statusCode,
      });

      let userFriendlyMessage =
        "Something went wrong while submitting your registration. Please verify your data and try again.";

      const msg = err?.message || "";
      if (
        msg.includes("DUPLICATE_PARTICIPANT") ||
        msg.includes("idx_genesis_member_national_id")
      ) {
        userFriendlyMessage =
          "This participant is already registered in another Genesis team.";
      } else if (msg.includes("DUPLICATE_NATIONAL_ID_IN_TEAM")) {
        userFriendlyMessage =
          "Duplicate National IDs were entered within your team. Each member must have a unique National ID.";
      } else if (msg.includes("GENESIS_REGISTRATION_CLOSED")) {
        userFriendlyMessage =
          "Genesis registration is now closed.";
      } else if (msg.includes("VIDEO_REQUIRED")) {
        userFriendlyMessage =
          "Project explanation video link is required.";
      } else if (msg.includes("INVALID_VIDEO_URL")) {
        userFriendlyMessage =
          "Please enter a valid public video URL (starting with http:// or https://).";
      } else if (
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("timeout")
      ) {
        userFriendlyMessage =
          "Connection problem. Please check your internet connection and try again.";
      }

      setSubmitError(userFriendlyMessage);
    } finally {
      setSubmitting(false);
      setUploadProgressText("");
    }
  };

  return (
    <div className="genesis-reg-page">
      <Helmet>
        <title>Team Registration | Genesis — IEEE MET SB</title>
        <meta
          name="description"
          content="Register your team for Genesis (Version 1). Choose your track: AI, Cybersecurity, Robotics, Mobile App, or IoT."
        />
      </Helmet>

      <Header />
      <GenesisCubeBackground />

      <main className="genesis-reg-main">
        {/* If Deadline is Closed, Display Closed Screen directly */}
        {countdown.isClosed && currentStep !== 4 ? (
          <GenesisRegistrationClosed />
        ) : currentStep === 4 && submissionResult ? (
          <GenesisRegistrationSuccess
            result={submissionResult}
            onReset={() => {
              setCurrentStep(1);
              setTeam({
                team_name: "",
                project_idea: "",
                demo_video_url: "",
                track: "",
                team_size: 1,
              });
              setMembers([createEmptyMember()]);
              setSubmissionResult(null);
            }}
          />
        ) : (
          <div className="genesis-reg-card">
            {/* Registration Page Header */}
            <div className="genesis-reg-header">
              <span className="genesis-reg-badge">Genesis V1.0</span>
              <h1 className="genesis-reg-page-title">Team Registration</h1>
              <p className="genesis-reg-page-subtitle">
                Build. Solve. Create. Complete your team submission below.
              </p>

                  {/* Multi-Step Progress Indicator */}
                  <div className="genesis-progress-bar">
                    <div
                      className={`progress-step ${
                        currentStep >= 1 ? "active" : ""
                      } ${currentStep > 1 ? "completed" : ""}`}
                    >
                      <div className="step-circle">
                        {currentStep > 1 ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          "1"
                        )}
                      </div>
                      <span className="step-text">Team Details</span>
                    </div>

                    <div
                      className={`progress-line ${
                        currentStep >= 2 ? "active" : ""
                      }`}
                    ></div>

                    <div
                      className={`progress-step ${
                        currentStep >= 2 ? "active" : ""
                      } ${currentStep > 2 ? "completed" : ""}`}
                    >
                      <div className="step-circle">
                        {currentStep > 2 ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          "2"
                        )}
                      </div>
                      <span className="step-text">Team Members</span>
                    </div>

                    <div
                      className={`progress-line ${
                        currentStep >= 3 ? "active" : ""
                      }`}
                    ></div>

                    <div
                      className={`progress-step ${
                        currentStep === 3 ? "active" : ""
                      }`}
                    >
                      <div className="step-circle">3</div>
                      <span className="step-text">Review & Submit</span>
                    </div>
                  </div>
                </div>

                {/* Step Switcher */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GenesisTeamDetails
                        team={team}
                        errors={teamErrors}
                        onChange={handleTeamChange}
                        onTrackSelect={handleTrackSelect}
                        onSizeChange={handleTeamSizeChange}
                        onContinue={handleContinueToMembers}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GenesisMembersSection
                        members={members}
                        teamSize={team.team_size}
                        memberErrors={memberErrors}
                        onMemberChange={handleMemberChange}
                        onBack={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onContinue={handleContinueToReview}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GenesisReview
                        team={team}
                        members={members}
                        teamSize={team.team_size}
                        onBack={() => {
                          setCurrentStep(2);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onSubmit={handleSubmitRegistration}
                        submitting={submitting}
                        uploadProgressText={uploadProgressText}
                        submitError={submitError}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
