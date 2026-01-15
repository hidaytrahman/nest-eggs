import { Controller, Get, Post, Put, Request, UseGuards, Body } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import {
  AuthService,
  LoginResponse,
  UserPayload,
  SignUpResponse,
  ProfileResponse,
} from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: Object,
  })
  @ApiResponse({ status: 409, description: "Username or email already exists" })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    schema: { properties: { access_token: { type: "string" } } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Request() req: { user: UserPayload }): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Profile retrieved successfully",
    type: Object,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getProfile(
    @Request() req: { user: UserPayload },
  ): Promise<ProfileResponse> {
    return this.authService.getProfile(req.user.userId);
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update user profile" })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: Object,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  async updateProfile(
    @Request() req: { user: UserPayload },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    return this.authService.updateProfile(req.user.userId, updateProfileDto);
  }
}
