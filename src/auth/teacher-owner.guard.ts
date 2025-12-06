import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // contiene id_us, role, etc.
    const teacherId = Number(request.params.id);

    console.log('===== TeacherOwnerGuard =====');
    console.log('Usuario logueado:', user);
    console.log('ID profesor solicitado:', teacherId);

    // --- ADMIN tiene acceso total ---
    if (user.role === 'ADMIN') {
      console.log('Permiso concedido: Admin');
      return true;
    }

    // --- TEACHER ---
    if (user.role === 'TEACHER') {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: teacherId },
        include: { user: true },
      });

      console.log('Profesor encontrado en DB:', teacher);

      if (!teacher) {
        console.log('Profesor no encontrado');
        throw new ForbiddenException("Profesor no encontrado");
      }

      console.log('Comparando IDs:', teacher.user.id_us, '===', user.id_us);
      if (teacher.user.id_us !== user.id) {
        console.log('IDs no coinciden. Acceso denegado.');
        throw new ForbiddenException("No puedes acceder a la información de otro profesor");
      }

      console.log('IDs coinciden. Acceso permitido.');
      return true;
    }

    // --- Otros roles no permitidos ---
    console.log('Rol no permitido:', user.role);
    throw new ForbiddenException("No tienes permisos para acceder a este recurso");
  }
}
