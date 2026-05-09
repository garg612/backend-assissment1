import express from "express";
import {
  createIntake,
  getAllIntakes,
  getMyresponse,
} from "../controllers/intake.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/intake", verifyJWT, upload.none(), createIntake);
router.get("/intakes", verifyJWT, isAdmin, getAllIntakes);
router.get("/my-response", verifyJWT, getMyresponse);

export default router;