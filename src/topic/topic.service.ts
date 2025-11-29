import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTopicDto) {
    return this.prisma.topic.create({ data });
  }

  findAll() {
    return this.prisma.topic.findMany({ include: { sub_topics: true } });
  }
  async findOne(id: number) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: { sub_topics: true },
    });
    if (!topic) throw new NotFoundException('Tema no encontrado');
    return topic;
  }

update(id: number, data: UpdateTopicDto) {
  return this.prisma.topic.update({
    where: { id },
    data: {
      ...(data.subject_id && {
        subjects: {
          connect: { id: data.subject_id }
        }
      }),

      // Además puedes editar lo del create
      ...(data.name && { name: data.name }),
    },
  });
}

  remove(id: number) {
    return this.prisma.topic.delete({ where: { id } });
  }

async getTopicsBySubject(subjectId: number) {
  return this.prisma.topic.findMany({
    where: {
      subjects: {
        some: { id: subjectId }, // 👈 esto filtra los topics que tienen relación con esa asignatura
      },
    },
    include: {
      sub_topics: true, // 👈 opcional: incluye también los subtemas si quieres
    },
  });
}








}
