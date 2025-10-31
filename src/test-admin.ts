import { PrismaService } from './prisma/prisma.service';
import { AdminService } from './admin/admin.service';
import { CreateAdminDto } from './admin/dto/create-admin.dto';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaService();
  const adminService = new AdminService(prisma);

  const students: CreateAdminDto[] = [
    { id: 11 }, 
    { id: 12 },
  ];

  for (const student of students) {
    const created = await adminService.create(student);
    console.log(`🎓 Admin agregado con id de usuario: ${created.id}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
