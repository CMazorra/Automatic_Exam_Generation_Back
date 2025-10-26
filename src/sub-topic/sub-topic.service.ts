import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubTopicDto } from './dto/create-sub-topic.dto';
import { UpdateSubTopicDto } from './dto/update-sub-topic.dto';

@Injectable()
export class SubTopicService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateSubTopicDto) {
    return this.prisma.sub_Topic.create({ data });
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
