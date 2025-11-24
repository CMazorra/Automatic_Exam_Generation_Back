import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService){}

  async login(account: string, password: string){
      const user = await this.prisma.user.findUnique({where: { account}, include: {teachers: true, students: true},});
      if(!user || user.isActive == false){
         throw new UnauthorizedException('Cuenta no encontrada');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if(!passwordMatch){
        throw new UnauthorizedException('Contraseña incorrecta');
      }
      const headTeacher = user.role === Role.TEACHER && user.teachers[0]?.isHeadTeacher;
      const payload = { id: user.id_us, account: user.account, role: user.role, headTeacher };
      const token = this.jwtService.sign(payload);


      return { user, headTeacher, token };

  }

  async logout() {
    return { message: 'Sesión cerrada', clearCookie: true };
  }
}