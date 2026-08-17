// src/hooks/useEventCountdown.js
// Reusable hook and helper utilities for registration deadline countdown and status

import { useState, useEffect } from "react";
import { GENESIS_CONFIG } from "../config/genesisConfig";

/**
 * Pure calculation helper to determine remaining time and status
 * @param {string|Date} deadline - ISO 8601 string or Date object
 * @returns {object} Calculated time parts, formatted strings, and status flags
 */
export function calculateRemainingTime(deadline = GENESIS_CONFIG.registrationDeadline) {
  const targetDate = new Date(deadline).getTime();
  const now = Date.now();
  const difference = targetDate - now;

  if (isNaN(targetDate) || difference <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOpen: false,
      isClosed: true,
      formattedCompact: "00d 00h 00m 00s",
      formattedHuman: "Registration Closed",
      deadlineLabel: "26 August 2026, 11:59:59 PM (Egypt Time)",
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  const formattedCompact = `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  const formattedHuman =
    days > 0
      ? `${days} day${days > 1 ? "s" : ""}, ${hours} hr${hours > 1 ? "s" : ""} left`
      : `${hours} hr${hours > 1 ? "s" : ""}, ${minutes} min${minutes > 1 ? "s" : ""} left`;

  return {
    totalMs: difference,
    days,
    hours,
    minutes,
    seconds,
    isOpen: true,
    isClosed: false,
    formattedCompact,
    formattedHuman,
    deadlineLabel: "26 August 2026, 11:59:59 PM (Egypt Time)",
  };
}

/**
 * Check if the registration deadline has passed (static check)
 */
export function isRegistrationClosed(deadline = GENESIS_CONFIG.registrationDeadline) {
  return calculateRemainingTime(deadline).isClosed;
}

/**
 * React hook that re-evaluates the countdown every second
 */
export function useEventCountdown(deadline = GENESIS_CONFIG.registrationDeadline) {
  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime(deadline));

  useEffect(() => {
    // Initial evaluation
    setTimeLeft(calculateRemainingTime(deadline));

    const interval = setInterval(() => {
      const updated = calculateRemainingTime(deadline);
      setTimeLeft(updated);

      // If closed, stop interval
      if (updated.isClosed) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return timeLeft;
}

export default useEventCountdown;
