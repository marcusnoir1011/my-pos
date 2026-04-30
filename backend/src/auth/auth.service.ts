import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User, Prisma } from 'generated/prisma/client.js';

import { PrismaService } from 'src/prisma.servcie.js';
import { UserService } from 'src/user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private pirsma: PrismaService,
    private readonly userService: UserService,
    SALT_ROUND = 10,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.user({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.);

    return user;
  }

  async register() {}

  async login() {}
}
