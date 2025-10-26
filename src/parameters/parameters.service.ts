import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParametersDto } from './dto/create-parameters.dto';
import { UpdateParametersDto } from './dto/update-parameters.dto';

@Injectable()
export class ParametersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateParametersDto) {
    return this.prisma.parameters.create({ data });
  }

  findAll() {
    return this.prisma.parameters.findMany();
  }

  findOne(id: number) {
    return this.prisma.parameters.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateParametersDto) {
    return this.prisma.parameters.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.parameters.delete({ where: { id } });
  }
}
