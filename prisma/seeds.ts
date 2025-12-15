import { PrismaService } from '../src/prisma/prisma.service';
import { seed_users } from './seeds/seed_user';
import { seed_subjects_questions } from './seeds/seed_d';
import { seed_exams } from './seeds/seeds_Exam';
import { StudentService } from '../src/student/student.service';
import { TeacherService } from '../src/teacher/teacher.service';

const prisma = new PrismaService(); // ✅ Crear PrismaService directamente

async function main() {
  console.log('🌱 Ejecutando todas las semillas...');
  const studentService = new StudentService(prisma);
  const teacherService = new TeacherService(prisma);
  await seed_users(prisma, studentService, teacherService);                 // usuarios
  await seed_subjects_questions(prisma);    // materias y preguntas
  await seed_exams(prisma);                 // exámenes

  console.log('🎉 Seed COMPLETO ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
