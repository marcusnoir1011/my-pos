import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto, LoginUserDto } from '../dtos.js';
import { User } from 'generated/prisma/client.js';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Request() req) {
    return await req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return await req.logout();
  }
}
