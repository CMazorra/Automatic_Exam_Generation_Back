import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      tap((data) => {
        // Si el controller devuelve un token, lo agregamos como cookie HttpOnly
        if (data?.token) {
          response.cookie('jwt', data.token, {
            httpOnly: true,                         // ⚡ No accesible desde JS
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en prod
            sameSite: 'strict',                      // Protege contra CSRF
            path: '/',
            maxAge: 1000 * 60 * 60 * 24,            // 1 día
          });

          // Eliminamos token del body si queremos que no se envíe en JSON
          delete data.token;
        }
      }),
    );
  }
}
