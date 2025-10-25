import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const userService = new UserService(prisma);

  // Datos de prueba para login
  const loginTests = [
    { account: 'juan01', password: '1234' },       // estudiante
    { account: 'laura01', password: '1234' },      // profesor
    { account: 'admin01', password: 'admin123' },  // admin
    { account: 'laura01', password: 'wrongpass' }, // contraseña incorrecta
    { account: 'noexiste', password: '1234' },     // usuario no existe
  ];

  for (const test of loginTests) {
    try {
      const result = await userService.login(test.account, test.password);
      console.log(`✅ Login exitoso: ${test.account}`);
      console.log(result);
    } catch (err) {
      console.log(`❌ Error login para ${test.account}: ${(err as Error).message}`);
    }
    console.log('--------------------------');
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
