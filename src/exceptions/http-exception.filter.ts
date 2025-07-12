import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

// Transform the error response
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionMsg = exception["response"]["message"];

    // console.log(" is array or not ", typeof )

    // custom error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // reading message if its string error or from getting the first error message from the array
      message:
        typeof exceptionMsg === "string"
          ? exceptionMsg
          : (exception["response"]["message"][0] as string),
      details: {
        author: "hidayt",
        name: exception.name,
        ...exception["response"],
      },
    });
  }
}
