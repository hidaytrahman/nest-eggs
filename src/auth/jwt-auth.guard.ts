import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserPayload } from "./auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = UserPayload>(
    err: Error,
    user: TUser,
    info: Error,
  ): TUser {
    if (info) {
      throw new UnauthorizedException("Invalid or missing auth token");
    }

    if (err || !user) {
      throw err ?? new UnauthorizedException("Authentication failed");
    }

    return user;
  }
}
