// src/config/genesisConfig.js
// Central source of truth for the Genesis competition event

import genesisAssetWebp from "../assets/events/genesis-upcoming.webp";

export const GENESIS_CONFIG = {
  name: "Genesis",
  version: "Version 1",
  tagline: "Build. Solve. Create.",
  edition: "V1.0",
  date: "16 September 2026",
  location: "The Slab",

  // Single source of truth for the registration deadline:
  // Registration is open until the end of 26 August 2026 (Egypt Time / UTC+3)
  registrationDeadline: "2026-08-27T00:00:00+03:00",

  // Official Rule Book
  ruleBookUrl: "https://drive.google.com/drive/folders/16wN2o2YyrGc_GbyCQsbvvWS1EVtGt_Rb?usp=sharing",

  // Official Genesis Tracks (Exactly 6 technical tracks)
  tracks: [
    {
      id: "ai",
      name: "AI",
      description: "Artificial Intelligence, Machine Learning, Computer Vision & Intelligent Systems.",
      icon: "fa-brain",
      color: "#00d4ff",
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      description: "Defensive Security, Threat Detection, Network Defense & Cryptography.",
      icon: "fa-shield-halved",
      color: "#0099ff",
    },
    {
      id: "robotics",
      name: "Robotics",
      description: "Autonomous Hardware, Kinematics, Microcontrollers & Sensor Integration.",
      icon: "fa-robot",
      color: "#38bdf8",
    },
    {
      id: "mobile-app",
      name: "Mobile Application",
      description: "Cross-Platform & Native Mobile Engineering with modern UI/UX workflows.",
      icon: "fa-mobile-screen-button",
      color: "#0284c7",
    },
    {
      id: "iot",
      name: "IoT",
      description: "Smart Embedded Devices, Cloud IoT Integrations, Edge Computing & Sensors.",
      icon: "fa-microchip",
      color: "#06b6d4",
    },
    {
      id: "graduation-projects",
      name: "Graduation Projects",
      description: "Senior & Capstone Engineering Projects across all engineering and technology disciplines.",
      icon: "fa-graduation-cap",
      color: "#0284c7",
    },
  ],

  routes: {
    intro: "/genesis",
    register: "/genesis/register",
  },

  socials: {
    facebook: "https://www.facebook.com/IEEE.METSB",
    instagram: "https://www.instagram.com/ieeemetsb/",
    linkedin: "https://www.linkedin.com/company/ieee-metsb",
  },

  // Centralized asset reference — optimized WebP
  heroImage: genesisAssetWebp,

  description:
    "Genesis is our Version 1 — a technology competition where ideas turn into real, working projects. Participants choose from six Technical Tracks — AI, Cybersecurity, Robotics, Mobile Application, IoT, and Graduation Projects — and work on their projects with mentorship and technical support along the way. On the final competition days, participants present their work in front of a panel of Technical Judges who assess each project's execution and quality. From submission to the final days, every participant goes on a journey of building, learning, and competing for the top spots.",

  importantNotes: [
    "Registration is strictly team-based.",
    "Each team must choose exactly one of the six technical tracks.",
    "Teams will submit their complete team information and member details during registration.",
    "The official Rule Book is the authoritative guide for all competition rules, deliverables, and judging standards.",
    "All team registrations must be submitted before the deadline on 26 August 2026 (23:59:59 Egypt Time).",
  ],
};

export default GENESIS_CONFIG;
