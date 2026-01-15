import { Controller, Get, Post, Put, Delete, Request, UseGuards, Body, Param } from "@nestjs/common";
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
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

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

  @Put("change-password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Change user password" })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "Current password is incorrect" })
  async changePassword(
    @Request() req: { user: UserPayload },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @Put("change-email")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Change user email" })
  @ApiBody({ type: ChangeEmailDto })
  @ApiResponse({
    status: 200,
    description: "Email changed successfully",
    schema: {
      properties: {
        message: { type: "string" },
        email: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  @ApiResponse({ status: 400, description: "Password is incorrect" })
  async changeEmail(
    @Request() req: { user: UserPayload },
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    return this.authService.changeEmail(req.user.userId, changeEmailDto);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Request password reset" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Password reset email sent (if email exists)",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password with token" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Password reset successfully",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 400, description: "Invalid or expired token" })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put("deactivate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Deactivate user account" })
  @ApiResponse({
    status: 200,
    description: "Account deactivated successfully",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deactivateAccount(@Request() req: { user: UserPayload }) {
    return this.authService.deactivateAccount(req.user.userId);
  }

  @Put("reactivate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Reactivate user account" })
  @ApiResponse({
    status: 200,
    description: "Account reactivated successfully",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async reactivateAccount(@Request() req: { user: UserPayload }) {
    return this.authService.reactivateAccount(req.user.userId);
  }

  @Delete("account")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete user account permanently" })
  @ApiResponse({
    status: 200,
    description: "Account deleted successfully",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteAccount(@Request() req: { user: UserPayload }) {
    return this.authService.deleteAccount(req.user.userId);
  }

  @Get("verify-email/:token")
  @ApiOperation({ summary: "Verify email address with token" })
  @ApiResponse({
    status: 200,
    description: "Email verified successfully",
    schema: { properties: { message: { type: "string" } } },
  })
  @ApiResponse({ status: 400, description: "Invalid verification token" })
  async verifyEmail(@Param("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post("resend-verification")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Resend email verification token" })
  @ApiResponse({
    status: 200,
    description: "Verification email sent successfully",
    schema: {
      properties: {
        message: { type: "string" },
        token: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async resendVerificationEmail(@Request() req: { user: UserPayload }) {
    return this.authService.resendVerificationEmail(req.user.userId);
  }
}
