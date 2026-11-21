import bcrypt from "bcrypt";
import User from "./schemas/user.js";
import Role from "./schemas/role.js";

const SALT_ROUNDS = 12;

/**
 * Create a new user with a hashed password and the customer role.
 * Throws if the email/username already exists or role missing.
 */
export async function createUser({ displayName, username, email, password }) {
  if (!displayName || !username || !email || !password) {
    throw new Error("displayName, username, email, and password are required.");
  }

  const customerRole = await Role.findOne({ name: "customer" }).lean();
  if (!customerRole) {
    throw new Error("Customer role not found. Run npm run db:import first.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return User.create({
    displayName,
    username,
    email,
    passwordHash,
    role: customerRole._id,
  });
}

/**
 * Find a user by email and populate the role name.
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase() })
    .populate("role", "name")
    .lean();
}

/**
 * Find a user by username and populate the role name.
 */
export async function findUserByUsername(username) {
  if (!username) return null;
  return User.findOne({ username: username.toLowerCase() })
    .populate("role", "name")
    .lean();
}

/**
 * Verify a plain password against a stored bcrypt hash.
 */
export async function verifyPassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) return false;
  return bcrypt.compare(plainPassword, passwordHash);
}
