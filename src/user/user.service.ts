import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService){}

  async create(data: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);   
    const hashedPassword = await bcrypt.hash(data.password, salt)
    return this.prisma.user.create({data: {...data, password: hashedPassword,},});
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: {id_us: id}});
  }

  async update(id: number, data: UpdateUserDto) {
    let updatedData = {...data};
    if(data.password){
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(data.password, salt);
    }
    return this.prisma.user.update({where: {id_us: id}, data: updatedData,});
  }

  async remove(id: number) {
    return this.prisma.user.delete({where: {id_us: id}})
  }

  async login(account: string, password: string){
      const user = await this.prisma.user.findUnique({where: { account}, include: {teachers: true, students: true, admins:true},});
      if(!user){
         throw new UnauthorizedException('Cuenta no encontrada');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if(!passwordMatch){
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const payload = { id: user.id_us, account: user.account, role: user.role };
      const token = this.jwtService.sign(payload);

      const headTeacher = user.role === Role.TEACHER && user.teachers[0]?.isHeadTeacher;

      return { user, headTeacher, token };

  }
}
