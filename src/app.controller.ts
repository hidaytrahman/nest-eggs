import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
// import { AuthGuard } from './guards/auth.guard';
@Controller('api')
// @UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    try {
      return this.appService.getHello();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message from get Hello',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
