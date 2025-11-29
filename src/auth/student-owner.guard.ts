import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // contiene id_us, role, etc.
    const studentId = Number(request.params.id);

    console.log('===== StudentOwnerGuard =====');
    console.log('Usuario logueado:', user);
    console.log('ID estudiante solicitado:', studentId);

    if (user.role === 'ADMIN' || user.role === 'TEACHER') {
      console.log('Permiso concedido: Admin o Teacher');
      return true;
    }

    if (user.role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      console.log('Estudiante encontrado en DB:', student);

      if (!student) {
        console.log('Estudiante no encontrado');
        throw new ForbiddenException("Estudiante no encontrado");
      }

      console.log('Comparando IDs:', student.user.id_us, '===', user.id_us);
      if (student.user.id_us !== user.id) {
        console.log('IDs no coinciden. Acceso denegado.');
        throw new ForbiddenException("No puedes acceder a la información de otro estudiante");
      }

      console.log('IDs coinciden. Acceso permitido.');
      return true;
    }

    console.log('Rol no permitido');
    return false;
  }
}
