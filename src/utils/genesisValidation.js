// src/utils/genesisValidation.js
// Validation rules and formatting utilities for Genesis registration

import { GENESIS_CONFIG } from "../config/genesisConfig";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
];

export const MIME_TO_EXTENSION = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};

export const EXTENSION_FALLBACKS = {
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  heic: "heic",
  heif: "heif",
  pdf: "pdf",
};

/**
 * Safely extract normalized extension for upload session specs
 */
export function getFileExtension(file) {
  if (!file) {
    throw new Error("INVALID_FILE");
  }

  // 1. Check validated MIME type first
  if (file.type && MIME_TO_EXTENSION[file.type.toLowerCase()]) {
    return MIME_TO_EXTENSION[file.type.toLowerCase()];
  }

  // 2. Fallback to filename extension
  if (file.name && typeof file.name === "string") {
    const rawExt = file.name.split(".").pop()?.toLowerCase();
    if (rawExt && EXTENSION_FALLBACKS[rawExt]) {
      return EXTENSION_FALLBACKS[rawExt];
    }
  }

  throw new Error("UNSUPPORTED_FILE_TYPE");
}

const VALID_TRACKS = GENESIS_CONFIG.tracks.map((t) => t.name);
const VALID_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

/**
 * Validate Step 1: Team Details
 */
export function validateTeamDetails(team) {
  const errors = {};

  if (!team.team_name?.trim()) {
    errors.team_name = "Team name is required";
  }

  if (!team.project_idea?.trim()) {
    errors.project_idea = "Project description is required";
  }

  if (!team.track || !VALID_TRACKS.includes(team.track)) {
    errors.track = "Please select a valid technical track";
  }

  const size = Number(team.team_size);
  if (!size || size < 1 || size > 5) {
    errors.team_size = "Team size must be between 1 and 5";
  }

  const videoUrl = team.demo_video_url?.trim() || "";
  if (!videoUrl) {
    errors.demo_video_url = "Project explanation video link is required.";
  } else {
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(videoUrl)) {
      errors.demo_video_url = "Please enter a valid public video URL.";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Validate an individual member record
 */
export function validateMember(member, index) {
  const errors = {};

  // Full Name
  if (!member.full_name?.trim()) {
    errors.full_name = "Full name is required";
  }

  // National ID (14 digits)
  const nationalId = member.national_id?.trim() || "";
  if (!nationalId) {
    errors.national_id = "National ID is required";
  } else if (!/^\d{14}$/.test(nationalId)) {
    errors.national_id = "National ID must be exactly 14 digits";
  }

  // Mobile Phone (11 digits)
  const phone = member.phone?.trim() || "";
  if (!phone) {
    errors.phone = "Mobile number is required";
  } else if (!/^\d{11}$/.test(phone)) {
    errors.phone = "Mobile number must be exactly 11 digits";
  }

  // Email
  const email = member.email?.trim() || "";
  if (!email) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  // Discord Link
  if (!member.discord_link?.trim()) {
    errors.discord_link = "Discord link or handle is required";
  }

  // University & Faculty
  if (!member.university?.trim()) {
    errors.university = "University is required";
  }
  if (!member.faculty?.trim()) {
    errors.faculty = "Faculty is required";
  }

  // Academic Year
  if (!member.academic_year || !VALID_YEARS.includes(member.academic_year)) {
    errors.academic_year = "Please select an academic year";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Validate all active members in the team
 */
export function validateAllMembers(members, teamSize) {
  const memberErrors = [];
  let hasErrors = false;
  const seenIds = new Map();

  for (let i = 0; i < teamSize; i++) {
    const member = members[i] || {};
    const { errors, isValid } = validateMember(member, i);

    // Intra-team duplicate national ID check
    const rawId = member.national_id?.trim();
    if (rawId && /^\d{14}$/.test(rawId)) {
      if (seenIds.has(rawId)) {
        errors.national_id = `Duplicate National ID with ${seenIds.get(rawId)}`;
        hasErrors = true;
      } else {
        seenIds.set(rawId, i === 0 ? "Team Leader" : `Member #${i + 1}`);
      }
    }

    if (!isValid || Object.keys(errors).length > 0) {
      hasErrors = true;
    }
    memberErrors.push(errors);
  }

  return {
    memberErrors,
    hasErrors,
  };
}

/**
 * Mask National ID for privacy during Review
 * e.g. 29901011234567 -> **********4567
 */
export function maskNationalId(id) {
  if (!id || typeof id !== "string") return "";
  const cleaned = id.trim();
  if (cleaned.length <= 4) return cleaned;
  const lastFour = cleaned.slice(-4);
  return "*".repeat(cleaned.length - 4) + lastFour;
}
