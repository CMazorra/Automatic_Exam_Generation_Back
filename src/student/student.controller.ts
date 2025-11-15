import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';


@Controller('student')
//@UseGuards(RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  //@Roles(Role.ADMIN)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
 // @Roles(Role.ADMIN, Role.TEACHER)
  findAllActive() {
    return this.studentService.findAll();
  }

  @Get('all')
  findAllAll() {
    return this.studentService.findAllAll();
  }

  @Get('deleted/all')
  findAllDeleted() {
    return this.studentService.findAllDeleted();
  }

  @Get(':id')
  //@Roles(Role.ADMIN, Role.TEACHER)
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Get('all/:id')
  findOneAll(@Param('id') id: string) {
    return this.studentService.findOneAll(+id);
  }

  @Get('deleted/:id')
  findOneDeleted(@Param('id') id: string) {
    return this.studentService.findOneDeleted(+id);
  }

  @Patch(':id')
  //@Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  //@Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
