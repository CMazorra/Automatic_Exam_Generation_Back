import { PrismaService } from '../src/prisma/prisma.service';
import { UserService } from '../src/user/user.service';
import { StudentService } from '../src/student/student.service';
import { TeacherService } from '../src/teacher/teacher.service';
import { HeadTeacherService } from '../src/head_teacher/head_teacher.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const jwt = new JwtService({secret: 'clave_de_prueba'});
  const userService = new UserService(prisma, jwt);
  const studentService = new StudentService(prisma);
  const teacherService = new TeacherService(prisma);
  const headTeacherService = new HeadTeacherService(prisma);

  const users: CreateUserDto[] = [
    // Estudiantes
    { name: 'Juan Pérez', account: 'juan01', password: '1234', age: 20, course: 'Matemáticas', role: Role.STUDENT },
    { name: 'María López', account: 'maria02', password: '1234', age: 21, course: 'Física', role: Role.STUDENT },
    { name: 'Pedro Sánchez', account: 'pedro03', password: '1234', age: 22, course: 'Química', role: Role.STUDENT },
    { name: 'Lucía Fernández', account: 'lucia04', password: '1234', age: 19, course: 'Historia', role: Role.STUDENT },
    { name: 'Miguel Torres', account: 'miguel05', password: '1234', age: 23, course: 'Biología', role: Role.STUDENT },

    // Profesores
    { name: 'Laura Martínez', account: 'laura01', password: '1234', age: 35, course: 'Matemáticas', role: Role.TEACHER },
    { name: 'Carlos Gómez', account: 'carlos02', password: '1234', age: 40, course: 'Física', role: Role.TEACHER },
    { name: 'Ana Rodríguez', account: 'ana03', password: '1234', age: 38, course: 'Química', role: Role.TEACHER },
    { name: 'José Ramírez', account: 'jose04', password: '1234', age: 42, course: 'Historia', role: Role.TEACHER },
    { name: 'Sofía Herrera', account: 'sofia05', password: '1234', age: 37, course: 'Biología', role: Role.TEACHER },

    // Administradores
    { name: 'Diego Vargas', account: 'admin01', password: 'admin123', age: 30, course: '', role: Role.ADMIN },
    { name: 'Mariana Ruiz', account: 'admin02', password: 'admin123', age: 28, course: '', role: Role.ADMIN },
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { account: userData.account },
    });

    if (existingUser) {
      console.log(`⚠️ Usuario ${userData.account} ya existe, se omite.`);
      continue;
    }

    // Crear usuario
    const newUser = await userService.create(userData);
    console.log(`✅ Usuario creado: ${newUser.name} (${newUser.role})`);

    // Crear registro según el rol
    switch (newUser.role) {
      case Role.STUDENT:
        await studentService.create({ id: newUser.id_us });
        console.log(`🎓 Estudiante vinculado al usuario ${newUser.account}`);
        break;

      case Role.TEACHER:
        const isHead = ['laura01', 'carlos02'].includes(newUser.account); // puedes ajustar esto
        const teacher = await teacherService.create({
          id: newUser.id_us,
          specialty: newUser.course || 'General',
          isHeadTeacher: isHead,
        });
        console.log(`👩‍🏫 Profesor ${teacher.id} (${teacher.specialty})`);
        if (isHead) {
          await headTeacherService.create({ id: teacher.id });
          console.log(`🧠 HeadTeacher creado para ${newUser.account}`);
        }
        break;

      case Role.ADMIN:
        console.log(`🧑‍💼 Admin vinculado al usuario ${newUser.account}`);
        break;
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
