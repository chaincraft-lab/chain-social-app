import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponseDto<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode || 200;
        
        // Determine success message based on HTTP method
        let message = 'İşlem başarıyla tamamlandı';
        
        switch (request.method) {
          case 'POST':
            message = 'Kayıt başarıyla oluşturuldu';
            break;
          case 'PUT':
          case 'PATCH':
            message = 'Kayıt başarıyla güncellendi';
            break;
          case 'DELETE':
            message = 'Kayıt başarıyla silindi';
            break;
          case 'GET':
            message = 'Veriler başarıyla getirildi';
            break;
        }

        return new SuccessResponseDto(statusCode, message, data);
      }),
    );
  }
}