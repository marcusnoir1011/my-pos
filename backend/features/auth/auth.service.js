import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../../libs/prisma";
import { AppError } from "../../libs/AppError";

class AuthService {
  #SALT_ROUND;
  #JWT_SECRET;

  constructor(SALT_ROUND = 10, JWT_SECRET = process.env.JWT_SECRET) {
    this.#SALT_ROUND = SALT_ROUND;
    this.#JWT_SECRET = JWT_SECRET;

    if (!this.#JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
  }

  async register(data) {
    const { name, email, password, role = "cashier" } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError("User already exist.", 409);

    const hashedPassword = await bcrypt.hash(password, this.#SALT_ROUND);
    if (!hashedPassword) {
      throw new AppError("Internal Server Error.", 500);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const accessToken = await this.#generateAccessToken(user);
    const refreshToken = await this.#createRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  }

  async login(data) {
    const { email, password } = data;

    const user = await this.#validateUser(email, password);

    const accessToken = await this.#generateAccessToken(user);
    const refreshToken = await this.#createRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      throw new AppError("newRefresh token required.", 400);
    }

    const token = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      return;
    }

    if (token.isRevoked) {
      return;
    }

    await prisma.refreshToken.update({
      where: {
        token: refreshToken,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  async refreshToken(token) {
    if (!token) throw new AppError("Token missing. Unauthorized.", 401);

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });

    if (!storedToken) throw new AppError("Invalid Token. Unauthorized.", 401);
    if (storedToken.isRevoked === true)
      throw new AppError("Token revoked. Unauthorized.", 403);
    if (storedToken.expiresAt < Date())
      throw new AppError("Token expired. Unauthorized.", 401);

    const user = await prisma.user.findUnique({
      where: {
        id: storedToken.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) throw new AppError("User not found.", 401);

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const newRefreshToken = this.#createRefreshToken(user.id);
    const accessToken = this.#generateAccessToken(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async #getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
    if (!user) throw new AppError("User not found.", 404);
    return user;
  }

  async #validateUser(email, password) {
    const user = await this.#getUserByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid Credentials.", 401);
    }

    return user;
  }
  async #generateAccessToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, this.#JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  }
  async #createRefreshToken(userId) {
    const token = crypto.randomUUID(64).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
    return token;
  }
}

export default new AuthService();
