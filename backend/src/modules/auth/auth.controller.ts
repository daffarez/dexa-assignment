import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  type LoginPayload,
  type RegisterPayload,
  RegisterSchema,
  LoginSchema,
} from './auth.schema';
import { validatePayload } from 'src/common/utils/utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterPayload) {
    const parsedBody = validatePayload(RegisterSchema, body);
    return this.authService.register(parsedBody);
  }

  @Post('login')
  login(@Body() body: LoginPayload) {
    const parsedBody = validatePayload(LoginSchema, body);
    return this.authService.login(parsedBody);
  }
}
