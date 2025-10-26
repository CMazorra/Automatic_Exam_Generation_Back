import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { CreateParametersDto } from './dto/create-parameters.dto';
import { UpdateParametersDto } from './dto/update-parameters.dto';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Post()
  create(@Body() createParametersDto: CreateParametersDto) {
    return this.parametersService.create(createParametersDto);
  }

  @Get()
  findAll() {
    return this.parametersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parametersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateParametersDto: UpdateParametersDto) {
    return this.parametersService.update(id, updateParametersDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parametersService.remove(id);
  }
}
