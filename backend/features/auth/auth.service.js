import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../../libs/prisma";

class AuthService {
  #SALT_ROUND;
  #JWT_SECRET;
  constructor(SALT_ROUND = 10, JWT_SECRET = process.env.JWT_SECRET) {
    this.#SALT_ROUND = SALT_ROUND;
    this.#JWT_SECRET = JWT_SECRET;
  }
  async register(data) {
    try {
      const { name, email, password, role = "cashier" } = data;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("User already exist.");
      const hashedPassword = await bcrypt.hash(password, this.#SALT_ROUND);
      if (!hashedPassword) {
        throw new Error("Server Error.");
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
    } catch (err) {
      throw err;
    }
  }

  async login(data) {
    try {
      const { email, password } = data;
      const user = await this.#validateUser(email, password);
      const token = await this.#generateToken(user);
      return { user, token };
    } catch (err) {
      throw err;
    }
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
    return user;
  }

  async #validateUser(email, password) {
    try {
      const user = await this.#getUserByEmail(email);
      if (!user) {
        throw new Error("User not found.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid Credentials.");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
  async #generateToken(user) {
    try {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, this.#JWT_SECRET, { expiresIn: "1d" });
      return token;
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
