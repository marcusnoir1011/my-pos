import jwt from "jsonwebtoken";

import { AppError } from "../../libs/AppError";

class AuthMiddleware {
  #JWT_SECRET;
  constructor(JWT_SECRET) {
    this.#JWT_SECRET = JWT_SECRET;

    if (!this.#JWT_SECRET) throw new Error("JWT_SECRET is not defined.");
  }

  protect = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startWith("Bearer ")) {
        throw new AppError("Authentication required.", 401);
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, this.#JWT_SECRET);

      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token Expired.", 401));
      }
    }
  };

  tokenVerify(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error("No Token provided.");

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, this.#JWT_SECRET);

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: "Unauthorized." });
    }
  }
  roleMiddleware(requiredRole) {
    return (req, res, next) => {
      try {
        if (!req.user || req.user.role !== requiredRole) {
          return res
            .status(403)
            .json({ success: false, message: "Forbidden." });
        }
      } catch (err) {
        next(err);
      }
    };
  }
}

export default new AuthMiddleware(process.env.JWT_SECRET);
