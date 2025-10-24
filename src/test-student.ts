import { PrismaService } from './prisma/prisma.service';
import { StudentService } from './student/student.service';
import { CreateStudentDto } from './student/dto/create-student.dto';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const studentService = new StudentService(prisma);

  const students: CreateStudentDto[] = [
    { id: 14 }, 
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
  ];

  for (const student of students) {
    const created = await studentService.create(student);
    console.log(`🎓 Estudiante agregado con id de usuario: ${created.id}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
