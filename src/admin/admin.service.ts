import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateAdminDto) {
    return this.prisma.admin.create({data});
  }

  async findAll() {
    return this.prisma.admin.findMany({include: {user: true}});
  }

  async findOne(id: number) {
    return this.prisma.admin.findUnique({where: {id}, include:{user:true}});
  }

  async update(id: number, data: UpdateAdminDto) {
    return this.prisma.admin.update({where:{id}, data});
  }

  async remove(id: number) {
    return this.prisma.admin.delete({where: {id}});
  }
}
