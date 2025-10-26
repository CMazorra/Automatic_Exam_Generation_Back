import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ParametersController],
  providers: [ParametersService, PrismaService],
})
export class ParametersModule {}
