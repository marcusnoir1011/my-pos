import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { User as UserModel } from 'generated/prisma/client.js';
import { AuthService } from './auth.service.js';
import type { UserUpdateInput } from 'generated/prisma/models.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.authService.user({ id: Number(id) });
  }

  @Post('user')
  async reigsterUser(
    @Body() userData: { email: string; password: string },
  ): Promise<UserModel> {
    return this.authService.registerUser(userData);
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UserUpdateInput,
  ): Promise<UserModel> {
    return this.authService.updateUser({
      where: { id: Number(id) },
      data: data,
    });
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.authService.deleteUser({ id: Number(id) });
  }
}
