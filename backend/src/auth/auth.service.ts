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

  // async validateUser(email: string, password: string) {
  //   const user = await this.userService.user({ email });
  //   if (!user) return null;

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) return null;

  //   return user;
  // }

  async register(email: string, password: string): Promise<User | null> {
    const user = await this.userService.user({ email });
    if (!user) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) return null;
    password = hashedPassword;

    const userData: CreateUserDto = {
      email,
      password,
    };

    const result = await this.userService.registerUser(userData);
    if (!result) return null;

    return result;
  }

  async login() {}
}
