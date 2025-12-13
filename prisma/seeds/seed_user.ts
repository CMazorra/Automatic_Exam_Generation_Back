import { PrismaService } from '../../src/prisma/prisma.service';
import { UserService } from '../../src/user/user.service';
import { StudentService } from '../../src/student/student.service';
import { TeacherService } from '../../src/teacher/teacher.service';
import { HeadTeacherService } from '../../src/head_teacher/head_teacher.service';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';

export async function seed_users(prisma: PrismaService) {
  console.log('🌱 Seed: Users');

  const jwt = new JwtService({ secret: 'clave_de_prueba' }); // aunque no se use, no molesta
  const userService = new UserService(prisma);
  const studentService = new StudentService(prisma);
  const teacherService = new TeacherService(prisma);
  const headTeacherService = new HeadTeacherService(prisma);

  const users: CreateUserDto[] = [
    // Estudiantes
    { name: 'Juan Pérez', account: 'juan01', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'María López', account: 'maria02', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Pedro Sánchez', account: 'pedro03', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Lucía Fernández', account: 'lucia04', password: '1234', age: 19, course: '2025-2026', role: Role.STUDENT },
    { name: 'Miguel Torres', account: 'miguel05', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Ana Gómez', account: 'ana06', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'Manuel Ruiz', account: 'manule07', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Elena Martín', account: 'elena08', password: '1234', age: 19, course: '2025-2026', role: Role.STUDENT },
    { name: 'Roberto Díaz', account: 'roberto09', password: '1234', age: 24, course: '2025-2026', role: Role.STUDENT },
    { name: 'Sofía Morales', account: 'sofia10', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Diego Herrera', account: 'diego11', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Valeria Castro', account: 'valeria12', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'Andrés Romero', account: 'andres13', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Camila Vega', account: 'camila14', password: '1234', age: 19, course: '2025-2026', role: Role.STUDENT },
    { name: 'Javier Navarro', account: 'javier15', password: '1234', age: 24, course: '2025-2026', role: Role.STUDENT },
    { name: 'Isabella Ortiz', account: 'isabella16', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Héctor Molina', account: 'hector17', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Paula Serrano', account: 'paula18', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'Fernando Reyes', account: 'fernando19', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Claudia Medina', account: 'claudia20', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Rodrigo Aguilar', account: 'rodrigo21', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Daniela Núñez', account: 'daniela22', password: '1234', age: 19, course: '2025-2026', role: Role.STUDENT },
    { name: 'Sebastián Bravo', account: 'sebastian23', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Ángela Paredes', account: 'angela24', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Mauricio Campos', account: 'mauricio25', password: '1234', age: 24, course: '2025-2026', role: Role.STUDENT },
    { name: 'Patricia León', account: 'patricia26', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'Álvaro Peña', account: 'alvaro27', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Viviana Duarte', account: 'viviana28', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Gabriel Fuentes', account: 'gabriel29', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Leticia Correa', account: 'leticia30', password: '1234', age: 19, course: '2025-2026', role: Role.STUDENT },
    { name: 'Óscar Rivas', account: 'oscar31', password: '1234', age: 24, course: '2025-2026', role: Role.STUDENT },
    { name: 'Natalia Saavedra', account: 'natalia32', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'Hernán Cabrera', account: 'hernan33', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Lorena Pizarro', account: 'lorena34', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },
    { name: 'Tomás Valdés', account: 'tomas35', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Brenda Cifuentes', account: 'brenda36', password: '1234', age: 19, course: '2025-2026', role: Role.STUDENT },
    { name: 'Alan Godoy', account: 'alan37', password: '1234', age: 22, course: '2025-2026', role: Role.STUDENT },
    { name: 'Rocío Toledo', account: 'rocio38', password: '1234', age: 20, course: '2025-2026', role: Role.STUDENT },
    { name: 'Cristóbal Mena', account: 'cristobal39', password: '1234', age: 23, course: '2025-2026', role: Role.STUDENT },
    { name: 'Julia Villarroel', account: 'julia40', password: '1234', age: 21, course: '2025-2026', role: Role.STUDENT },

    // Profesores
    { name: 'Laura Martínez', account: 'laura01', password: '1234', age: 35, course: '2025-2026', role: Role.TEACHER },
    { name: 'Carlos Gómez', account: 'carlos02', password: '1234', age: 40, course: '2025-2026', role: Role.TEACHER },
    { name: 'Ana Rodríguez', account: 'ana03', password: '1234', age: 38, course: '2025-2026', role: Role.TEACHER },
    { name: 'José Ramírez', account: 'jose04', password: '1234', age: 42, course: '2025-2026', role: Role.TEACHER },
    { name: 'Sofía Herrera', account: 'sofia05', password: '1234', age: 37, course: '2025-2026', role: Role.TEACHER },
    { name: 'Héctor Maldonado', account: 'hector06', password: '1234', age: 45, course: '2025-2026', role: Role.TEACHER },
    { name: 'Patricia Cárdenas', account: 'patricia07', password: '1234', age: 39, course: '2025-2026', role: Role.TEACHER },
    { name: 'Luis Figueroa', account: 'luis08', password: '1234', age: 44, course: '2025-2026', role: Role.TEACHER },
    { name: 'Verónica Salinas', account: 'veronica09', password: '1234', age: 36, course: '2025-2026', role: Role.TEACHER },
    { name: 'Ricardo Ponce', account: 'ricardo10', password: '1234', age: 41, course: '2025-2026', role: Role.TEACHER },
    { name: 'Natalia Fuentes', account: 'natalia11', password: '1234', age: 38, course: '2025-2026', role: Role.TEACHER },
    { name: 'Esteban Villalobos', account: 'esteban12', password: '1234', age: 43, course: '2025-2026', role: Role.TEACHER },
    { name: 'Lorena Andrade', account: 'lorena13', password: '1234', age: 37, course: '2025-2026', role: Role.TEACHER },
    { name: 'Guillermo Prado', account: 'guillermo14', password: '1234', age: 46, course: '2025-2026', role: Role.TEACHER },
    { name: 'Teresa Oliva', account: 'teresa15', password: '1234', age: 34, course: '2025-2026', role: Role.TEACHER },


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

    const newUser = await userService.create(userData);
    console.log(`✅ Usuario creado: ${newUser.name} (${newUser.role})`);

    switch (newUser.role) {
      case Role.STUDENT:
        await studentService.create({ id: newUser.id_us });
        break;

      case Role.TEACHER:
        const isHead = ['laura01', 'carlos02', 'ana03', 'jose04', 'sofia05']
          .includes(newUser.account);

        const teacher = await teacherService.create({
          id: newUser.id_us,
          specialty: 'Ingeniería',
          isHeadTeacher: isHead,
        });

        if (isHead) {
          await headTeacherService.create({ id: teacher.id });
        }
        break;

      case Role.ADMIN:
        break;
    }
  }

  console.log('✅ Seed users completado');
}
