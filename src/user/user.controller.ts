import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { RequireStudentOwner } from '../auth/require-student-owner.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequireHeadTeacher } from '../auth/require-head-teacher.decorator';
import { Role } from '@prisma/client';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateUserRequestDto) {
    return this.userService.create(body.user, body.teacher);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  findAllAll() {
    return this.userService.findAllAll();
  }

  @Get('deleted/all')
  @Roles(Role.ADMIN)
  findAllDelete() {
    return this.userService.findAllDelete();
  }

  @Get()
  @Roles(Role.ADMIN)
  findAllActive() {
    return this.userService.findAll();
  }

  @Get('all/:id')
  @Roles(Role.ADMIN)
  findOneAll(@Param('id') id: string) {
    return this.userService.findOneAll(+id);
  }

  @Get('deleted/:id')
  @Roles(Role.ADMIN)
  findOneDelete(@Param('id') id: string) {
    return this.userService.findOneDelete(+id);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch('restore/:id')
  @Roles(Role.ADMIN)
  restore(@Param('id') id: string) {
    return this.userService.restore(+id);
  }

}
