import { applyDecorators, UseGuards } from '@nestjs/common';
import { StudentOwnerGuard } from './student-owner.guard';

export function RequireStudentOwner() {
  return applyDecorators(
    UseGuards(StudentOwnerGuard),
  );
}
