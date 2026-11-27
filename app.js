import express from "express";
import session from "express-session";
import Path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import globalMiddleware from "./src/middleware/global.js";
import { loadSessionUser } from "./src/middleware/auth.js";
import routes from "./src/routes/router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const app = express();

// Add version info to res.locals for access in templates.
app.use((req, res, next) => {
  res.locals.appVersion = pkg.version;
  next();
});

// Configure static files and EJS templates.
app.use(express.static(Path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "src/views"));

// Swagger UI (NEW)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Session management — MUST come before routes that use req.session.
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in .env");
}
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour of inactivity
  }),
);

// Load the session user into req.user + res.locals.user.
// MUST come after session and before routes.
app.use(loadSessionUser);

app.use(globalMiddleware);
app.use("/", routes);

// Catch requests that did not match a route.
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Render the appropriate error page.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  return res.status(status).render(`errors/${template}`, context);
});

export default app;
