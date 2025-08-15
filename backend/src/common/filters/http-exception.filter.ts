import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: any[] = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        
        // Validation error details
        if (Array.isArray(responseObj.message)) {
          details = responseObj.message;
          message = 'Doğrulama hatası';
        }
      } else {
        message = exceptionResponse as string;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'İç sunucu hatası';
    }

    // Log error details
    this.logger.error(
      `HTTP ${status} Error: ${message}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    const errorResponse = new ErrorResponseDto(
      status,
      message,
      exception instanceof Error ? exception.message : 'Unknown error',
      details,
    );

    response.status(status).json(errorResponse);
  }
}