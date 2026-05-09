import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan("dev"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Import routes
import intakeRoutes from "./routes/intake.route.js";
import "./config/passport.js";
import userRoutes from "./routes/user.route.js";
// Use routes
app.use("/api/v1/intake", intakeRoutes);
app.use("/api/v1/auth", userRoutes);

app.use(errorHandler);

export { app };