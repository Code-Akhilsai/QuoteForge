import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User not found or deactivated" });
    }

    req.userObj = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userObj || !roles.includes(req.userObj.role)) {
      return res.status(403).json({ success: false, message: `Role ${req.userObj?.role} is not authorized to access this route` });
    }
    next();
  };
};
