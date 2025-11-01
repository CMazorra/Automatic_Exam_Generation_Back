import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SubTopicService } from './sub-topic.service';
import { CreateSubTopicDto } from './dto/create-sub-topic.dto';
import { UpdateSubTopicDto } from './dto/update-sub-topic.dto';

@Controller('subtopics')
export class SubTopicController {
  constructor(private service: SubTopicService) {}

  @Post()
  create(@Body() dto: CreateSubTopicDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/:topic_id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('topic_id', ParseIntPipe) topic_id: number,
  ) {
    return this.service.findOne(id, topic_id);
  }

  @Put(':id/:topic_id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('topic_id', ParseIntPipe) topic_id: number,
    @Body() dto: UpdateSubTopicDto,
  ) {
    return this.service.update(id, topic_id, dto);
  }

  @Delete(':id/:topic_id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('topic_id', ParseIntPipe) topic_id: number,
  ) {
    return this.service.remove(id, topic_id);
  }
}
