import { Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);   
    const hashedPassword = await bcrypt.hash(data.password, salt)
    return this.prisma.user.create({data: {...data, password: hashedPassword,},});
  }

  async findAll() {
    return this.prisma.user.findMany({where: {isActive: true}});
  }

  async findAllAll() {
    return this.prisma.user.findMany();
  }
  async findAllDelete() {
    return this.prisma.user.findMany({where: {isActive: false}});
  }

  async findOne(id: number) {
    return this.prisma.user.findFirst({ where: {id_us: id, isActive:true}});
  }
 
  async findOneAll(id: number) {
    return this.prisma.user.findUnique({ where: {id_us: id}});
  }

  async findOneDelete(id: number) {
    return this.prisma.user.findFirst({ where: {id_us: id, isActive:false}});
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
    return this.prisma.user.update({where: {id_us:id}, data: {isActive: false}});
  }

}
