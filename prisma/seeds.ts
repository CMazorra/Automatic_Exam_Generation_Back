// import { PrismaClient } from '@prisma/client';
// import { seeds_Exams } from './seeds/seeds_Exam';
// // import { seedQuestions } from './seeds/seedQuestions';
// // import { seedStudents } from './seeds/seedStudents';
// // import { seedTeachers } from './seeds/seedTeachers';
// // import { seedSubjects } from './seeds/seedSubjects';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Iniciando carga de semillas...');
// //   await seedSubjects(prisma);
// //   await seedTeachers(prisma);
// //   await seedStudents(prisma);
// //   await seedQuestions(prisma);
//   await seeds_Exams(prisma);
//   console.log('✅ Todas las semillas se ejecutaron correctamente.');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Error en la semilla:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
