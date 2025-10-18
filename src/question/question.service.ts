import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateQuestionDto) {
    return this.prisma.question.create({ data });
  }

  findAll() {
    return this.prisma.question.findMany({ include: { subject: true, sub_topic: true } });
  }

  findOne(id: number) {
    return this.prisma.question.findUnique({ where: { id }, include: { subject: true } });
  }

  update(id: number, data: UpdateQuestionDto) {
    return this.prisma.question.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.question.delete({ where: { id } });
  }
}
