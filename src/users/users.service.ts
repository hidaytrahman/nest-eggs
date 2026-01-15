import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
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
}
