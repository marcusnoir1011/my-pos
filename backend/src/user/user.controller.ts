import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { User as UserModel } from 'generated/prisma/client.js';
import type { UserUpdateInput } from 'generated/prisma/models.js';

import { UserService } from './user.service.js';
import { CreateUserDto } from '../dtos.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModel | null> {
    return this.userService.user({ id: id });
  }

  @Post('')
  async createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.registerUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserUpdateInput,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: id },
      data: data,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.userService.deleteUser({ id: id });
  }
}
