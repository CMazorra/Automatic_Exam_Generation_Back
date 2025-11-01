// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule, // Para poder usar UserService
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'miClaveSecreta', // Cambia esto en producción
      signOptions: { expiresIn: '1h' }, // Token válido 1 hora
    }),
  ],
  exports: [JwtModule], // Para poder usar JwtService en UserService
})
export class AuthModule {}
