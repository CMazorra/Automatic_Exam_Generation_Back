import { Injectable } from '@nestjs/common';
import { CreateHeadTeacherDto } from './dto/create-head_teacher.dto';
import { UpdateHeadTeacherDto } from './dto/update-head_teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HeadTeacherService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(data: CreateHeadTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({where: {id: data.id}});
    if (!teacher || teacher.isHeadTeacher) {
      throw new Error('Teacher not found or is already a head teacher');
    }
    await this.prisma.teacher.update({where: {id: data.id}, data:{isHeadTeacher: true}});
    return this.prisma.head_Teacher.create({data});
  }

  async findAll() {
  return this.prisma.head_Teacher.findMany({where: {teacher: {isHeadTeacher: true, user: {isActive: true}}}, include: {teacher: {include: {user: true}}}});
  }

  async findAllAll() {
    return this.prisma.head_Teacher.findMany({include: {teacher: {include: {user: true}}}});
  }

  async findAllDeleted() {
    return this.prisma.head_Teacher.findMany({where: {teacher: {OR: [{ isHeadTeacher: false },{ user: { isActive: false }}]}}, include: {teacher: {include: {user: true}}}});
  }

  async findOne(id: number) {
    return this.prisma.head_Teacher.findFirst({where: {id, teacher: {isHeadTeacher: true, user: {isActive: true}}},  include: {teacher: {include: {user: true}}}});
  }

  async findOneAll(id: number) {
    return this.prisma.head_Teacher.findUnique({where: {id},  include: {teacher: {include: {user: true}}}});
  }

  async findOneDelete(id: number) {
    return this.prisma.head_Teacher.findFirst({where: {id,teacher: {OR: [{ isHeadTeacher: false },{ user: { isActive: false }}]} },  include: {teacher: {include: {user: true}}}});
  }

  async update(id: number, data: UpdateHeadTeacherDto) {
    return this.prisma.head_Teacher.update({where: {id}, data});
  }

  async remove(id: number) {
    return this.prisma.teacher.update({where: {id}, data:{isHeadTeacher: false}});
  }

  async restore(id: number) {
    return this.prisma.teacher.update({where: {id}, data:{isHeadTeacher: true}});
  }
}
