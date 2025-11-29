import { SetMetadata } from '@nestjs/common';

export const REQUIRE_HEAD_TEACHER_KEY = 'requireHeadTeacher';
export const RequireHeadTeacher = () => SetMetadata(REQUIRE_HEAD_TEACHER_KEY, true);
