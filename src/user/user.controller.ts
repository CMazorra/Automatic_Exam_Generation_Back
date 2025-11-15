import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  findAllAll() {
    return this.userService.findAllAll();
  }

  @Get('deleted/all')
  findAllDelete() {
    return this.userService.findAllDelete();
  }

  @Get()
  findAllActive() {
    return this.userService.findAll();
  }

  @Get('all/:id')
  findOneAll(@Param('id') id: string) {
    return this.userService.findOneAll(+id);
  }

  @Get('deleted/:id')
  findOneDelete(@Param('id') id: string) {
    return this.userService.findOneDelete(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  @UseInterceptors(CookieInterceptor)
  async login(@Body() body: LoginUserDto) {
    const { account, password } = body;
    return this.userService.login(account, password);
  }

  @Post('logout')
  @UseInterceptors(CookieInterceptor)
  async logout() {
    return this.userService.logout();
  }

}
