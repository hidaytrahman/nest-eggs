import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { UserDocument } from "src/users/schemas/user.schema";

export interface UserPayload {
  userId: string;
  username: string;
  email: string;
  type?: "user" | "admin";
}

export interface LoginResponse {
  access_token: string;
}

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }

    // Compare password with hashed password
    const isPasswordValid = await this.usersService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      type: user.type,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    const user = await this.usersService.create({
      username: signUpDto.username,
      password: signUpDto.password,
      email: signUpDto.email,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      age: signUpDto.age,
    });

    return {
      message: "User created successfully",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
      },
    };
  }

  async login(user: UserPayload): Promise<LoginResponse> {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.userId,
      type: user.type,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
