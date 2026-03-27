import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (response?.success !== undefined) {
          return response;
        }

        return {
          success: true,
          message: response?.message ?? 'Success',
          data: response?.data ?? response,
        };
      }),
    );
  }
}
