import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Body() data: CreateTopicDto) {
    return this.topicService.create(data);
  }

  @Get()
  findAll() {
    return this.topicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicService.findOne(id);
  }
  
  @Get('subject/:id')
getTopicsBySubject(@Param('id') id: string) {
  return this.topicService.getTopicsBySubject(+id);
}

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTopicDto) {
    return this.topicService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicService.remove(id);
  }
}
