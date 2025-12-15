import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';
import { StudentService } from '../student/student.service';
import { TeacherService } from '../teacher/teacher.service';
import { HeadTeacherService } from '../head_teacher/head_teacher.service';
import { JwtService } from '@nestjs/jwt';
import { CreateTeacherRequestDto } from '../teacher/dto/create-teacher-request.dto';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,private readonly studentService: StudentService,
    private readonly teacherService: TeacherService){}

  async create(data: CreateUserDto, dato?: CreateTeacherRequestDto) {
    const salt = await bcrypt.genSalt(10);   
    const hashedPassword = await bcrypt.hash(data.password, salt)
    const user = await this.prisma.user.create({data: {...data, password: hashedPassword,},});
    if (data.role === Role.STUDENT) {
      await this.studentService.create({
        id: user.id_us,
      });
    }

    if (data.role === Role.TEACHER && dato) {
      await this.teacherService.create({
        id: user.id_us,
        specialty: dato.specialty, // o el campo que corresponda
        isHeadTeacher: dato.isHeadTeacher,
      });
    }
    return user;
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
  let {specialty,...userData} = data;

  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  const user = await this.prisma.user.findUnique({where: { id_us: id },});

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.role === Role.TEACHER) {
    const teacher = await this.prisma.teacher.findUnique({where: { id }, });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (specialty !== undefined) {
      await this.prisma.teacher.update({
        where: { id: teacher.id },
        data: {
          specialty: specialty,
        },
      });
    }
  }
  return this.prisma.user.update({where: { id_us: id },data: userData,});
}


  async remove(id: number) {
    return this.prisma.user.update({where: {id_us:id}, data: {isActive: false}});
  }

  async restore(id: number) {
    return this.prisma.user.update({where: {id_us:id}, data: {isActive: true}});
  }

}
