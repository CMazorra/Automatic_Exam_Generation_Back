import { PrismaService } from './prisma/prisma.service';
import { HeadTeacherService } from './head_teacher/head_teacher.service';
import { CreateHeadTeacherDto } from './head_teacher/dto/create-head_teacher.dto';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const headteacherService = new HeadTeacherService(prisma);

  const students: CreateHeadTeacherDto[] = [
    { id: 20 }, 
    { id: 22 },
    { id: 23 },
  ];

  for (const student of students) {
    const created = await headteacherService.create(student);
    console.log(`🎓 HeadTeacher agregado con id de usuario: ${created.id}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
