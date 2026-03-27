import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Patch } from '@nestjs/common';
import { type RequestWithUser } from 'src/common/guards/jwt-payload.types';
import { UpdateProfileSchema, type UpdateProfilePayload } from './users.schema';
import { validatePayload } from 'src/common/utils/utils';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMe(@Req() req: RequestWithUser) {
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateMe(@Req() req: RequestWithUser, @Body() body: UpdateProfilePayload) {
    const parsedPayload = validatePayload(UpdateProfileSchema, body);
    return this.usersService.updateProfile(req.user.sub, parsedPayload);
  }
}
