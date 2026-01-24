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
    const token = await this.#generateToken(user);
    return { user, token };
  }

  async login(data) {
    const { email, password } = data;
    const user = await this.#validateUser(email, password);
    const token = await this.#generateToken(user);
    return { user, token };
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
  async #generateToken(user) {
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
}

export default new AuthService();
