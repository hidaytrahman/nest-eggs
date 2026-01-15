import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
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

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  age?: number;
  gender?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  bio?: string;
  avatar?: string;
  website?: string;
  type: "user" | "admin";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

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
      gender: signUpDto.gender,
      phone: signUpDto.phone,
      dateOfBirth: signUpDto.dateOfBirth,
      address: signUpDto.address,
      bio: signUpDto.bio,
      avatar: signUpDto.avatar,
      website: signUpDto.website,
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

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    const user = await this.usersService.updateProfile(userId, updateProfileDto);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.mapUserToProfileResponse(user);
  }

  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.mapUserToProfileResponse(user);
  }

  private mapUserToProfileResponse(user: UserDocument): ProfileResponse {
    const userObj = user.toObject();
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      bio: user.bio,
      avatar: user.avatar,
      website: user.website,
      type: user.type,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: (userObj as any).createdAt || new Date(),
      updatedAt: (userObj as any).updatedAt || new Date(),
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

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: "Password changed successfully" };
  }

  async changeEmail(
    userId: string,
    changeEmailDto: ChangeEmailDto,
  ): Promise<{ message: string; email: string }> {
    const user = await this.usersService.changeEmail(
      userId,
      changeEmailDto.newEmail,
      changeEmailDto.password,
    );
    return {
      message: "Email changed successfully. Please verify your new email.",
      email: user.email,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const resetToken = await this.usersService.generatePasswordResetToken(
      forgotPasswordDto.email,
    );

    // In production, send email with reset token
    // For now, we'll just return success message
    // TODO: Implement email service to send reset link
    if (resetToken) {
      // Log token for development (remove in production)
      console.log(`Password reset token for ${forgotPasswordDto.email}: ${resetToken}`);
    }

    // Always return success message for security (don't reveal if email exists)
    return {
      message:
        "If the email exists, a password reset link has been sent to your email.",
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return { message: "Password reset successfully" };
  }

  async deactivateAccount(userId: string): Promise<{ message: string }> {
    await this.usersService.deactivateAccount(userId);
    return { message: "Account deactivated successfully" };
  }

  async reactivateAccount(userId: string): Promise<{ message: string }> {
    await this.usersService.reactivateAccount(userId);
    return { message: "Account reactivated successfully" };
  }

  async deleteAccount(userId: string): Promise<{ message: string }> {
    await this.usersService.deleteAccount(userId);
    return { message: "Account deleted successfully" };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    await this.usersService.verifyEmail(token);
    return { message: "Email verified successfully" };
  }

  async resendVerificationEmail(
    userId: string,
  ): Promise<{ message: string; token: string }> {
    const token = await this.usersService.generateEmailVerificationToken(userId);

    // In production, send email with verification token
    // TODO: Implement email service to send verification link
    console.log(`Email verification token for user ${userId}: ${token}`);

    return {
      message: "Verification email sent successfully",
      token, // Remove token from response in production
    };
  }
}
