const { Catch, ExceptionFilter, ArgumentsHost, HttpException } = require('@nestjs/common');

class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    let status = 500;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || message;
        error = exceptionResponse.error || error;
      } else {
        message = exceptionResponse;
      }
    }
    
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message: Array.isArray(message) ? message : [message],
    };
    
    response.status(status).json(responseBody);
  }
}

Catch(HttpException)(HttpExceptionFilter);

exports.HttpExceptionFilter = HttpExceptionFilter;