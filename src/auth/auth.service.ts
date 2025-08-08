/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // this is without passport
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    // TODO: Generate a JWT and return it here
    const payload = {
      sub: user.id,
      username: user.username,
      type: user.type,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // these are with passport
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { username: string }) {
    // Ensure user comes from the new JSON DB
    const dbUser = await this.usersService.findOne(user.username);
    if (!dbUser) {
      throw new UnauthorizedException("User not found");
    }
    const payload = {
      sub: dbUser.id,
      username: dbUser.username,
      type: dbUser.type,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
