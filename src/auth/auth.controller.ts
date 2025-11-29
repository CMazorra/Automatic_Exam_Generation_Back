import { Controller, Post, Get, Body,Req, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthService} from './auth.service';
import { CookieInterceptor } from './cookie.interceptor';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
@UseInterceptors(CookieInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(CookieInterceptor)
  async login(@Body() body: LoginAuthDto) {
    const { account, password } = body;
    return this.authService.login(account, password);
  }

  @Post('logout')
  @UseInterceptors(CookieInterceptor)
  async logout() {
    return this.authService.logout();
  }
  
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;  // ← Esto devuelve Darío u otro usuario logueado
  }

}
