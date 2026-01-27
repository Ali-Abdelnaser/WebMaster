// src/data/validator.js
import * as yup from "yup";

const schema = yup.object().shape({
  // Personal Info
  fullName: yup.string().required("Full name is required").min(3),
  email: yup.string().email("Invalid email format").required(),
  phone: yup.string().required(),
  nationalId: yup.string().required(),
  university: yup.string().required(),
  faculty: yup.string().required(),
  academicYear: yup.string().required(),
  dateOfBirth: yup.date().required(),
  address: yup.string().required(),
  gender: yup.string().required(),
  linkedin: yup.string().url().required(),
  facebook: yup.string().url().nullable(),

  // General Questions
  introduction: yup.string().required(),
  whyHere: yup.string().required(),
  workPreference: yup.string().required(),
  taskOutsideTrack: yup.string().required(),
  motivationPersistence: yup.string().required(),
  pressureHandling: yup.string().required(),
  limitedResources: yup.string().required(),
  teamValues: yup.string().required(),
  goalsJoining: yup.string().required(),
  creativityVsPerfection: yup.string().required(),

  // Cycle selection
  cycle: yup.string().required("Cycle selection is required"),

  // HR cycle
  hrRole: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required("This question is required") : schema.nullable()
  ),
  hrDifference: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrCommitment: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrGoogleTools: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrSoftSkills: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrStrength: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrWeakness: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrDeadline: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrWillingToLearn: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrProblemSolving: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),
  hrUnknownTask: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "HR" ? schema.required() : schema.nullable()
  ),

  // Logistics cycle
  logWhyJoin: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logExp: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logCommStyle: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logReaction: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logTimeMgmt: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logOnSite: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logStrength: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),
  logSkills: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Logistics" ? schema.required() : schema.nullable()
  ),

  // Media cycle
  mediaDesignProcess: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Media" ? schema.required() : schema.nullable()
  ),
  mediaColorsFonts: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Media" ? schema.required() : schema.nullable()
  ),
  mediaBadDesignExample: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Media" ? schema.required() : schema.nullable()
  ),
  mediaFeedbackResponse: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Media" ? schema.required() : schema.nullable()
  ),
  mediaFavoriteDesigns: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Media" ? schema.required() : schema.nullable()
  ),
  mediaBrandingExperience: yup.string().nullable(),
  mediaRevisions: yup.string().nullable(),
  mediaPortfolioLink: yup.string().url().nullable(),
  mediaTools: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Media" ? schema.required() : schema.nullable()
  ),

  // Video Editing cycle
  videoDesignProcess: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoTools: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoPortfolio: yup.string().url().nullable(),
  videoFeedbackResponse: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoColorAndSound: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoRevisions: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoFavoriteType: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoBrandingExperience: yup.string().nullable(),
  videoProblemSolving: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),
  videoCreativeInspiration: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "VideoEditing" ? schema.required() : schema.nullable()
  ),

  // Marketing cycle
  mktWhyJoin: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktPlatform: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktEngagement: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktNegative: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktProject: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktTrend: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktExtraWork: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktTools: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktFeedback: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktCaption: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),
  mktImpact: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "Marketing" ? schema.required() : schema.nullable()
  ),

  // Event Management cycle
  eventWhyThis: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventUnknowns: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventTimePressure: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventTeamwork: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventShortPrep: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventMotivation: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventAchievement: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventMistake: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventConflict: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),
  eventQuickLearn: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "EventManagement" ? schema.required() : schema.nullable()
  ),

  // FR cycle
  frWhyJoin: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frMeaning: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frSkills: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frStrongSkill: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frEvents: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frPreparation: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frPressure: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frRejection: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frProductCondition: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frCompareSponsors: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),
  frSpecializedSponsor: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "FR" ? schema.required() : schema.nullable()
  ),

  // PR cycle
  prRole: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prWhyJoin: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prLearn: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prComfortZone: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prMeetPeople: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prRepresent: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prBreakIce: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prFaceVsSocial: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prNegativeFeedback: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
  prQualities: yup.string().when("cycle", (cycleValue, schema) =>
    cycleValue === "PR" ? schema.required() : schema.nullable()
  ),
});

export default schema;
