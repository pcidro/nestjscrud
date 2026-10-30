import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { response } from 'express';

@Catch(BadRequestException, HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    const req = context.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    console.log('passando no filter');

    response.status(status).json({
      statusCode: status,
      message: errorResponse !== '' ? errorResponse : 'Erro interno',
    });
  }
}
