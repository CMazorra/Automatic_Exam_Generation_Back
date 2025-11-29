import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubTopicDto } from './dto/create-sub-topic.dto';
import { UpdateSubTopicDto } from './dto/update-sub-topic.dto';

@Injectable()
export class SubTopicService {
  constructor(private prisma: PrismaService) {}

async create(dto: CreateSubTopicDto) {
  // Buscar último id del topic
  const last = await this.prisma.sub_Topic.findFirst({
    where: { topic_id: dto.topic_id },
    orderBy: { id: 'desc' },
  });

  const nextId = last ? last.id + 1 : 1;

  // Crear Sub_Topic
  return this.prisma.sub_Topic.create({
    data: {
      id: nextId,              // calculado manualmente
      name: dto.name,
      topic_id: dto.topic_id,  // importante que no sea undefined
    },
  });
}


  findAll() {
    return this.prisma.sub_Topic.findMany({ include: { topic: true } });
  }

  findOne(id: number, topic_id: number) {
    return this.prisma.sub_Topic.findUnique({
      where: { id_topic_id: { id, topic_id } },
      include: { topic: true },
    });
  }

  update(id: number, topic_id: number, data: UpdateSubTopicDto) {
    return this.prisma.sub_Topic.update({
      where: { id_topic_id: { id, topic_id } },
      data,
    });
  }

  remove(id: number, topic_id: number) {
    return this.prisma.sub_Topic.delete({
      where: { id_topic_id: { id, topic_id } },
    });
  }
}
