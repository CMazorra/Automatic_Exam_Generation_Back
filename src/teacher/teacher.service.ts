import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService ){}
  
  async create(data: CreateTeacherDto) {
    return this.prisma.teacher.create({data});
  }

  async findAll() {
    return this.prisma.teacher.findMany({include: {user:true}});
  }

  async findOne(id: number) {
    return this.prisma.teacher.findUnique({where: {id}, include: {user: true},});
  }

  async update(id: number, data: UpdateTeacherDto) {
    return this.prisma.teacher.update({where: {id}, data});
  }

  async remove(id: number) {
    return this.prisma.teacher.delete({where: {id}});
  }
}
