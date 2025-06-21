import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, UserController, AuthController],
  providers: [
    AppService,
    UserService,
    AuthService,
    
    /* Global-scoped filters are used across the whole application, 
    for every controller and every route handler. 
    In terms of dependency injection, global filters registered from 
    outside of any module (with useGlobalFilters() as in
     the example above) cannot inject dependencies since this 
     is done outside the context of any module. In order to solve 
     this issue, you can register a global-scoped filter directly 
     from any module using the following construction: */
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
