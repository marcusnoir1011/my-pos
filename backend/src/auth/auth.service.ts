import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from 'generated/prisma/client.js';
import { CreateUserDto } from 'src/dtos.js';

import { PrismaService } from 'src/prisma.servcie.js';
import { UserService } from 'src/user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // for login
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.user({ email });
    if (user && user.password === password) {
      //const { password, ...result } = user;

      return user;
    }
    return null;
  }

  async register(email: string, password: string): Promise<User | null> {
    const existingUser = await this.userService.user({ email });
    if (existingUser) {
      throw new Error('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: CreateUserDto = {
      email,
      password: hashedPassword,
    };

    const result = await this.userService.registerUser(userData);
    if (!result) {
      throw new Error('Registration failed.');
    }

    return result;
  }

  async login(email: string, password: string): Promise<User | null> {
    const existingUser = await this.userService.user({ email });
    if (!existingUser) {
      throw new Error('User does not exist.');
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched) {
      throw new Error('Wrong Credentials.');
    }

    return existingUser;
  }
}
