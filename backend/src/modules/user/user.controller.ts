import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Patch } from '@nestjs/common';
import { type RequestWithUser } from 'src/common/guards/jwt-payload.types';
import { UpdateProfileSchema, type UpdateProfilePayload } from './user.schema';
import { validatePayload } from 'src/common/utils/utils';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  getUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateMe(@Req() req: RequestWithUser, @Body() body: UpdateProfilePayload) {
    const parsedPayload = validatePayload(UpdateProfileSchema, body);
    return this.usersService.updateProfile(req.user.id, parsedPayload);
  }

  @Patch(':id')
  updateUserByAdmin(
    @Param('id') id: string,
    @Body() data: UpdateProfilePayload,
  ) {
    return this.usersService.updateProfile(id, data);
  }
}
