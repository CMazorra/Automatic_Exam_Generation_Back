import { applyDecorators, UseGuards } from '@nestjs/common';
import { TeacherOwnerGuard } from './teacher-owner.guard';

export function RequireTeacherOwner() {
  return applyDecorators(
    UseGuards(TeacherOwnerGuard),
  );
}
