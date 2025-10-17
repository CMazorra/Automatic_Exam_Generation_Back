import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './modules/users/repositories/user.repository';
import { Prisma } from 'generated/prisma';

async function main() {
  const prisma = new PrismaService();
  const userRepo = new UserRepository(prisma);

  // Crear un nuevo usuario
  const newUser: Prisma.UserCreateInput = {
    name: 'Adriana Boue',
    password: '1234',
    account: 'adriana01',
    age: 25,
    course: 'Math',
  };

  const id = 1

  const deleteUser = await userRepo.delete(id);
  console.log('Usuario eliminado:', deleteUser);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
});
