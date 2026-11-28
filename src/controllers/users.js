// src/controllers/users.js
import User from "../models/schemas/user.js";
import Role from "../models/schemas/role.js";
import { getPaginatedUsers } from "../models/users.js";

const publicUser = (user) => ({
  id: user._id.toString(),
  displayName: user.displayName,
  username: user.username,
  email: user.email,
  role: user.role?.name || "customer",
  createdAt: user.createdAt,
});

const allowedSortFields = ["username", "displayName", "email", "createdAt"];

const parsePositiveInteger = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
};

export const listUsers = async (req, res, next) => {
  try {
    // 1. Validate Pagination
    const page = parsePositiveInteger(req.query.page, 1);
    const requestedLimit = parsePositiveInteger(req.query.limit, 10);

    if (!page || !requestedLimit || requestedLimit > 50) {
      return res.status(400).json({
        errors: [
          {
            field: "pagination",
            message:
              "page and limit must be positive numbers. Maximum limit is 50.",
          },
        ],
      });
    }

    // 2. Validate Sort
    if (req.query.sort && !allowedSortFields.includes(req.query.sort)) {
      return res.status(400).json({
        errors: [{ field: "sort", message: "sort is not supported." }],
      });
    }

    const sort = req.query.sort || "username";
    const order = req.query.order === "desc" ? -1 : 1;

    // 3. Build the Base Filter (Role-based access)
    const filter = req.user.role === "admin" ? {} : { _id: req.user.id };

    // 4. Add Search (q)
    if (req.query.q !== undefined) {
      if (typeof req.query.q !== "string") {
        return res.status(400).json({
          errors: [{ field: "q", message: "Search text must be a string." }],
        });
      }
      const searchText = req.query.q.trim();
      if (!searchText || searchText.length > 100) {
        return res.status(400).json({
          errors: [
            {
              field: "q",
              message: "Search text must be between 1 and 100 characters.",
            },
          ],
        });
      }
      // Use regex for case-insensitive search across three fields
      const regex = new RegExp(searchText, "i");
      filter.$or = [
        { displayName: regex },
        { username: regex },
        { email: regex },
      ];
    }

    // 5. Add Role Filter
    if (req.query.role !== undefined) {
      const allowedRoles = ["customer", "admin"];
      if (!allowedRoles.includes(req.query.role)) {
        return res.status(400).json({
          errors: [
            { field: "role", message: "role must be 'customer' or 'admin'." },
          ],
        });
      }
      const roleDoc = await Role.findOne({ name: req.query.role });
      if (roleDoc) {
        filter.role = roleDoc._id;
      } else {
        // If role doesn't exist in DB, force no results
        filter.role = null;
      }
    }

    // 6. Execute Query
    const { users, totalItems } = await getPaginatedUsers({
      filter,
      page,
      limit: requestedLimit,
      sort,
      order,
    });

    // 7. Return Response
    return res.json({
      data: users.map(publicUser),
      query: {
        q: req.query.q || null,
        role: req.query.role || null,
      },
      pagination: {
        page,
        limit: requestedLimit,
        totalItems,
        totalPages: Math.ceil(totalItems / requestedLimit),
        hasNextPage: page * requestedLimit < totalItems,
        hasPreviousPage: page > 1,
      },
    });
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
        if (typeof req.body[field] !== "string" || !req.body[field].trim()) {
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

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
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
