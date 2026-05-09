import { Router } from "express";
import passport from "passport";
import { googleCallback, adminLogin, getMe } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);
router.post("/admin-login", adminLogin);
router.get("/me", verifyJWT, getMe);

export default router;