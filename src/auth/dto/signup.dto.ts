import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({ example: "john_doe", description: "Unique username" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "password123", description: "User password (6-50 characters)" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User email address" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "John", description: "User first name" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: "Doe", description: "User last name" })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 25, description: "User age" })
  @IsInt()
  @IsOptional()
  @Min(18)
  @Max(120)
  age?: number;
}
