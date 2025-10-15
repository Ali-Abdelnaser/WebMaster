// src/data/validators/joinCSValidator.js
import * as yup from "yup";

const joinCSValidator = yup.object().shape({
  // --- Personal Step ---
  fullName: yup.string().required("Full name is required."),
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Email is required."),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number.")
    .required("Phone number is required."),
  nationalId: yup
    .string()
    .matches(/^[0-9]{14}$/, "National ID must be 14 digits.")
    .required("National ID is required."),
  university: yup.string().required("University is required."),
  faculty: yup.string().required("Faculty is required."),
  academicYear: yup.string().required("Academic year is required."),
  dateOfBirth: yup.string().required("Date of birth is required."),
  address: yup.string().required("Address is required."),
  gender: yup.string().required("Please select your gender."),
  linkedin: yup
    .string()
    .url("Please enter a valid LinkedIn URL.")
    .required("LinkedIn URL is required"),
  facebook: yup.string().url("Please enter a valid Facebook URL."),

  // --- General CS Step ---
  csJourney: yup
    .string()
    .required(
      "Please tell us how your journey with programming or CS started."
    ),
  learningStyle: yup
    .string()
    .required("Please describe how you usually learn or solve new problems."),
  techStack: yup
    .string()
    .required(
      "Please mention the technologies or programming languages you know."
    ),
  projectIdea: yup
    .string()
    .required("Please share a project idea that interests you."),
  teamExperience: yup
    .string()
    .required("Please tell us about any team project experience you’ve had."),
  challengeApproach: yup
    .string()
    .required("Please describe how you handle coding challenges or bugs."),
});

export default joinCSValidator;
