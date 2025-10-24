import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const userService = new UserService(prisma);

  const users: CreateUserDto[] = [
    { name: 'Carlos Pérez', account: 'carlos01', password: 'abc123', age: 30, course: 'Physics' },
    { name: 'Lucía Gómez', account: 'lucia02', password: 'pass123', age: 22, course: 'Chemistry' },
    { name: 'Mario Torres', account: 'mario03', password: 'm1234', age: 28, course: 'History' },
    { name: 'Ana Rodríguez', account: 'ana04', password: 'qwerty', age: 27, course: 'Literature' },
    { name: 'David Sánchez', account: 'david05', password: 'admin', age: 24, course: 'Biology' },
    { name: 'Laura Fernández', account: 'laura06', password: 'test123', age: 21, course: 'Engineering' },
    { name: 'Pedro Castillo', account: 'pedro07', password: 'password', age: 29, course: 'Math' },
    { name: 'Sofía Herrera', account: 'sofia08', password: 'sofia8', age: 26, course: 'Philosophy' },
    { name: 'Andrés Vargas', account: 'andres09', password: 'andres9', age: 23, course: 'Computer Science' },
    { name: 'Camila Ruiz', account: 'camila10', password: 'cruiz10', age: 22, course: 'Economics' },
    { name: 'Miguel Torres', account: 'miguel11', password: 'mto11', age: 25, course: 'Art' },
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

