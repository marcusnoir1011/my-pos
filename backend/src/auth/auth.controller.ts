import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto, LoginUserDto } from '../dtos.js';
import { User } from 'generated/prisma/client.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() data: CreateUserDto): Promise<User | null> {
    return this.authService.register();
  }

  @Post('/login')
  async loginUser(@Body() data: LoginUserDto): ProPromise<User | null> {
    return this.authService.login();
  }
}
