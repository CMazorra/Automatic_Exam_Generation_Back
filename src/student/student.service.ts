import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(data: CreateStudentDto) {
    return this.prisma.student.create({data});
  }

  async findAll() {
    return this.prisma.student.findMany({include: {user:true}});
  }

  async findOne(id: number) {
    return this.prisma.student.findUnique({where: {id}, include: {user: true}});
  }

  async update(id: number, data: UpdateStudentDto) {
    return this.prisma.student.update({where: {id}, data});
  }

  async remove(id: number) {
    return this.prisma.student.delete({where: {id}});
  }
}
