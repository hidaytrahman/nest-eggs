import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

// get user json fron the data folder
import * as usersData from "../data/users.json";
import { UsersService } from "src/users/users.service";

@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // signIn(@Body() signInDto: Record<string, any>) {
  //   return this.authService.signIn(signInDto.username, signInDto.password);
  // }

  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/logout")
  async logout(@Request() req) {
    return req.logout(() => "logout");
  }

  @Get("profile")
  // @UseGuards(AuthGuard)
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    // get the user profile from the db
    //  need to use proper user service to fetch user data
    // return usersData.users.find((user) => user.id === req.user.id) || null;
    return this.usersService.findOne(req.user.username) || null;
  }
}
