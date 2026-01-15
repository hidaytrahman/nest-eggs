import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { User, UserDocument } from "./schemas/user.schema";

export interface UserPayload {
  userId: string;
  username: string;
  email: string;
  type: "user" | "admin";
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username, isActive: true }).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isActive: true }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName?: string;
    age?: number;
    gender?: string;
    phone?: string;
    dateOfBirth?: string;
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
    type?: "user" | "admin";
  }): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });

    if (existingUser) {
      if (existingUser.username === userData.username) {
        throw new ConflictException("Username already exists");
      }
      if (existingUser.email === userData.email) {
        throw new ConflictException("Email already exists");
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Prepare user data
    const userDataToSave: any = {
      ...userData,
      password: hashedPassword,
      type: userData.type || "user",
      isActive: true,
    };

    // Convert dateOfBirth string to Date if provided
    if (userData.dateOfBirth) {
      userDataToSave.dateOfBirth = new Date(userData.dateOfBirth);
    }

    // Create user
    const user = new this.userModel(userDataToSave);

    return user.save();
  }

  async updateProfile(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      age?: number;
      gender?: string;
      phone?: string;
      dateOfBirth?: string;
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
    },
  ): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Convert dateOfBirth string to Date if provided
    const updateDataToSave: any = { ...updateData };
    if (updateData.dateOfBirth) {
      updateDataToSave.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    // Update user
    Object.assign(user, updateDataToSave);
    return user.save();
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await this.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    return user.save();
  }

  async changeEmail(
    userId: string,
    newEmail: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Password is incorrect");
    }

    // Check if new email already exists
    const existingUser = await this.findOneByEmail(newEmail);
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ConflictException("Email already exists");
    }

    user.email = newEmail;
    user.emailVerified = false; // Reset email verification when email changes
    return user.save();
  }

  async generatePasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return null;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token and expiration (1 hour from now)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Return plain token (not hashed) to send via email
    return resetToken;
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<UserDocument> {
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await this.userModel.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return user.save();
  }

  async deactivateAccount(userId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.isActive = false;
    return user.save();
  }

  async reactivateAccount(userId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.isActive = true;
    return user.save();
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.userModel.deleteOne({ _id: userId });
  }

  async verifyEmail(token: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      throw new BadRequestException("Invalid verification token");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    return user.save();
  }

  async generateEmailVerificationToken(userId: string): Promise<string> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = token;
    await user.save();

    return token;
  }
}
