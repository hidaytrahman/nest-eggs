/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types/user.types';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // console.log(' context ', context.getHandler());
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    console.log('requiredRoleser ', requiredRoles);
    // console.log('rewq ', rewq);
    return requiredRoles.some((role) => request?.user?.roles?.includes(role));
    // return true;
  }
}
