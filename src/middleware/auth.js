/**
 * Copy the session user to req.user and res.locals.user.
 * This is a loader, not a guard — it never blocks a request.
 * Must run AFTER session middleware and BEFORE any page/API routes.
 */
export const loadSessionUser = (req, res, next) => {
  req.user = req.session?.user || null;
  res.locals.user = req.user;
  return next();
};

const isLoggedIn = (req) => Boolean(req.user);

const hasRole = (req, role) => req.user?.role === role;

/** API: 401 JSON if not signed in. */
export const requireApiLogin = (req, res, next) => {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ message: "Authentication required" });
  }
  return next();
};

/** Page: redirect to /login if not signed in. */
export const requirePageLogin = (req, res, next) => {
  if (!isLoggedIn(req)) {
    return res.redirect("/login");
  }
  return next();
};

/** API: 401 JSON if not signed in, 403 JSON if wrong role. */
export const requireApiRole = (role) => (req, res, next) => {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!hasRole(req, role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

/** Page: redirect to /login if not signed in, render 403 page if wrong role. */
export const requirePageRole = (role) => (req, res, next) => {
  if (!isLoggedIn(req)) {
    return res.redirect("/login");
  }
  if (!hasRole(req, role)) {
    return res.status(403).render("errors/403", {
      title: "Forbidden",
      error: "You do not have permission to view this page.",
      stack: "",
    });
  }
  return next();
};
