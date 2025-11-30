import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Leer token desde cookie
          (req) => {
    return req?.cookies?.jwt;
  },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Lo que devuelvas aquí estará en req.user
    return { 
      id: payload.id, 
      account: payload.account, 
      role: payload.role,
      headTeacher: payload.headTeacher
    };
  }
}
