import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  verifyPassword,
} from "../models/users.js";

const isDuplicateKeyError = (error) => error?.code === 11000;

/**
 * GET /register — render the registration form.
 */
export const registerPage = (req, res) => {
  res.render("register", {
    title: "Register",
    error: null,
    values: {},
  });
};

/**
 * POST /register — create a user with the customer role, then redirect to login.
 */
export const register = async (req, res, next) => {
  const { displayName, username, email, password, confirmPassword } = req.body;

  if (!displayName || !username || !email || !password) {
    return res.status(400).render("register", {
      title: "Register",
      error: "All fields are required.",
      values: { displayName, username, email },
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render("register", {
      title: "Register",
      error: "Passwords do not match.",
      values: { displayName, username, email },
    });
  }

  try {
    await createUser({ displayName, username, email, password });
    return res.redirect("/login");
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).render("register", {
        title: "Register",
        error: "That email or username is already registered.",
        values: { displayName, username, email },
      });
    }
    return next(error);
  }
};

/**
 * GET /login — render the login form.
 */
export const loginPage = (req, res) => {
  res.render("login", {
    title: "Login",
    error: null,
    values: {},
  });
};

/**
 * POST /login — verify credentials, store user in session, redirect.
 * Accepts email OR username in the "identifier" field.
 */
export const login = async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).render("login", {
      title: "Login",
      error: "Email/username and password are required.",
      values: { identifier },
    });
  }

  try {
    const trimmed = identifier.trim();
    let user = await findUserByEmail(trimmed);
    if (!user) {
      user = await findUserByUsername(trimmed);
    }

    // Use the same generic message for "no user" and "bad password"
    // so attackers can't enumerate accounts.
    const invalidMessage = "Invalid email/username or password.";

    if (!user) {
      return res.status(401).render("login", {
        title: "Login",
        error: invalidMessage,
        values: { identifier },
      });
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).render("login", {
        title: "Login",
        error: invalidMessage,
        values: { identifier },
      });
    }

    // Store minimal, safe data on the session. The role is stored as a
    // NAME string (not an ObjectId) so guards can compare it directly.
    req.session.user = {
      id: user._id.toString(),
      displayName: user.displayName,
      role: user.role?.name || "customer",
    };

    const redirectTo =
      req.session.user.role === "admin" ? "/admin/dashboard" : "/";
    return res.redirect(redirectTo);
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /logout — destroy the session and redirect home.
 */
export const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
};
