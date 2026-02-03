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

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token.", 401));
      }

      next(err);
    }
  };

  role(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AppError("Authentication required.", 401));
      }
      if (!roles.includes(req.user.role)) {
        return next(new AppError("Forbidden.", 403));
      }

      next();
    };
  }
}

export default new AuthMiddleware(process.env.JWT_SECRET);
