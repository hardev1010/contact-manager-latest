import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'https://contact-manager-2268.onrender.com',  // Replace with your frontend origin
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'dist' directory (replace with your build folder)
app.use(express.static(path.join(__dirname, "dist")));

app.use(express.static("src/dist"));  // Adjust this path based on where your dist folder is

app.use(express.static("dist"));


// Catch-all route to serve frontend for any route not matching API
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// User routes import
import userRouter from "./routes/user.routes.js";

// User routes
app.use("/users", userRouter);

// Contact routes import
import contactRouter from "./routes/contact.routes.js";

// Contact routes
app.use("/contacts", contactRouter);

export default app;
