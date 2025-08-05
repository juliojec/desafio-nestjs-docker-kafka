import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
  path: string;
  status: number;
}

@Injectable()
export class HttpExceptionInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map(data => ({
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
        status: response.statusCode,
      })),
      catchError(error => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erro interno do servidor';

        if (error instanceof HttpException) {
          status = error.getStatus();
          const errorResponse = error.getResponse() as any;
          message = errorResponse?.message || error.message;
        } else if (error.code === 'ECONNREFUSED') {
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Serviço temporariamente indisponível';
        } else if (error.code === 'ETIMEDOUT') {
          status = HttpStatus.REQUEST_TIMEOUT;
          message = 'Timeout na requisição';
        }

        const errorResponse = {
          error: {
            message,
            status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(error.getResponse && typeof error.getResponse() === 'object' ? error.getResponse() : {}),
          },
        };

        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
} 