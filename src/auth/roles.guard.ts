// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from './roles.decorator';
// import { REQUIRE_HEAD_TEACHER_KEY } from './require-head-teacher.decorator';
// import { Role } from '@prisma/client';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     const requireHeadTeacher = this.reflector.getAllAndOverride<boolean>(
//       REQUIRE_HEAD_TEACHER_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     const { user } = context.switchToHttp().getRequest();

//     // Si no hay roles requeridos ni head teacher, cualquiera puede acceder
//     if (!requiredRoles && !requireHeadTeacher) return true;

//     // Validar roles normales
//     if (requiredRoles && !requiredRoles.includes(user.role)) return false;

//     // Validar head teacher
//     if (requireHeadTeacher) {
//       if (user.role === Role.TEACHER && user.headTeacher) {
//         return true;
//       }
//       return false; // denegamos si no es head teacher
//     }

//     return true;
//   }
// }
