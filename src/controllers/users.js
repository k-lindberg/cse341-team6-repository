import User from "../models/schemas/user.js";
import Role from "../models/schemas/role.js";

const publicUser = (user) => ({
  id: user._id.toString(),
  displayName: user.displayName,
  username: user.username,
  email: user.email,
  role: user.role?.name || "customer",
  createdAt: user.createdAt,
});

export const listUsers = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { _id: req.user.id };

    const users = await User.find(filter)
      .select("-passwordHash")
      .populate("role", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ users: users.map(publicUser) });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isSelf = req.user.id === req.params.id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = {};

    for (const field of ["displayName", "username", "email"]) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          !req.body[field].trim()
        ) {
          return res.status(400).json({
            message: `${field} must be a non-empty string.`,
          });
        }

        updates[field] = req.body[field].trim();
      }
    }

    if (req.body.role !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({
          message: "Only admins can change user roles.",
        });
      }

      const role = await Role.findOne({ name: req.body.role });

      if (!role) {
        return res.status(400).json({ message: "Invalid role." });
      }

      updates.role = role._id;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields were provided for updating.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    )
      .select("-passwordHash")
      .populate("role", "name")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "User updated successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "That username or email is already in use.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isSelf = req.user.id === req.params.id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    return next(error);
  }
};