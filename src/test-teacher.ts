import { PrismaService } from './prisma/prisma.service';
import { TeacherService } from './teacher/teacher.service';
import { CreateTeacherDto } from './teacher/dto/create-teacher.dto';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const teacherService = new TeacherService(prisma);

  const teachers: CreateTeacherDto[] = [
    { id: 19, specialty: 'Mathematics' },
    { id: 20, specialty: 'Physics' },
    { id: 21, specialty: 'Chemistry' },
    { id: 22, specialty: 'Philosophy' },
    { id: 23, specialty: 'Economics' },
  ];

  for (const teacher of teachers) {
    const created = await teacherService.create(teacher);
    console.log(`👩‍🏫 Profesor agregado con id de usuario: ${created.id} (${teacher.specialty})`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
