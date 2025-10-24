import { Injectable } from '@nestjs/common';
import { CreateHeadTeacherDto } from './dto/create-head_teacher.dto';
import { UpdateHeadTeacherDto } from './dto/update-head_teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HeadTeacherService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(data: CreateHeadTeacherDto) {
    return this.prisma.head_Teacher.create({data});
  }

  async findAll() {
    return this.prisma.head_Teacher.findMany({include: {teacher: true}});
  }

  async findOne(id: number) {
    return this.prisma.head_Teacher.findUnique({where: {id}, include: {teacher: true}});
  }

  async update(id: number, data: UpdateHeadTeacherDto) {
    return this.prisma.head_Teacher.update({where: {id}, data});
  }

  async remove(id: number) {
    return this.prisma.head_Teacher.delete({where: {id}});
  }
}
