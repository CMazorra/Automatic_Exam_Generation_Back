import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import {Role} from '@prisma/client';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const userService = new UserService(prisma);

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

  for (const user of users) {
    const created = await userService.create(user);
    console.log(`✅ Usuario agregado: ${created.name} (${created.account})`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});