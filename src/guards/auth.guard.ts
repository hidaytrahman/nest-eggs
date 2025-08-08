/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
// import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
// TODO: This guard was initially added only with JWT
// TODO:  currently its not being used
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Invalid token or not exist");
    }

    console.log({ token });

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("You are not authorized");
    }
    return true;
  }

  private extractTokenFromHeader(
    request: Request & {
      headers: {
        authorization: string;
      };
    },
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
