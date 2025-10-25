import { PrismaService } from './prisma/prisma.service';
import { TeacherService } from './teacher/teacher.service';
import { CreateTeacherDto } from './teacher/dto/create-teacher.dto';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const teacherService = new TeacherService(prisma);

  const teachers: CreateTeacherDto[] = [
    { id: 6, specialty: 'Matemáticas', isHeadTeacher: true },
    { id: 7, specialty: 'Física', isHeadTeacher: true },
    { id: 8, specialty: 'Química', isHeadTeacher: false },
    { id: 9, specialty: 'Filosofía', isHeadTeacher: false },
    { id: 10, specialty: 'Economía', isHeadTeacher: false },
  ];

  for (const teacher of teachers) {
    const created = await teacherService.create(teacher);
    console.log(`👩‍🏫 Profesor agregado con id de usuario: ${created.id} (${teacher.specialty})${teacher.isHeadTeacher ? ' - Head Teacher' : ''}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
