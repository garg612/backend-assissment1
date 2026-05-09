import Intake from "../models/intake.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import intakeValidationSchema from "../validation/validation.js";
import { sanitizeInput } from "../utils/sanitize.js";

const createIntake = asyncHandler(async (req, res) => {
    
  const existingIntake = await Intake.findOne({ user: req.user._id });
  if (existingIntake) {
    return res.status(409).json({
      success: false,
      message: "You have already submitted an intake form.",
    });
  }

  const data = req.body;
  const sanitizedData = {
    fullName: sanitizeInput(data.fullName || ""),
    email: sanitizeInput(data.email || ""),
    phone: sanitizeInput(data.phone || ""),
    serviceType: sanitizeInput(data.serviceType || ""),
    budget: sanitizeInput(data.budget || ""),
    projectDescription: sanitizeInput(data.projectDescription || ""),
    user: req.user._id.toString(), // Associate intake with the logged-in user
  };

  const { error } = intakeValidationSchema.validate(sanitizedData);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error: " + error.details[0].message,
    });
  }

  const intake = await Intake.create(sanitizedData);

  res.status(201).json({
    success: true,
    message: "Intake created successfully",
    data: intake,
  });
});

const getMyresponse = asyncHandler(async (req, res) => {
  const intakes = await Intake.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    message: "Intakes retrieved successfully",
    data: intakes,
  });
});

const getAllIntakes = asyncHandler(async (req, res) => {
  const intakes = await Intake.find();
  res.status(200).json({
    success: true,
    message: "Intakes retrieved successfully",
    data: intakes,
  });
});

export { createIntake, getMyresponse, getAllIntakes };