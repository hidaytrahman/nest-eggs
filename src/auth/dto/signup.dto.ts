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
  IsEnum,
  IsDateString,
  IsPhoneNumber,
  ValidateNested,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class AddressDto {
  @ApiPropertyOptional({ example: "123 Main St", description: "Street address" })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: "New York", description: "City" })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: "NY", description: "State" })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: "10001", description: "ZIP code" })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiPropertyOptional({ example: "USA", description: "Country" })
  @IsString()
  @IsOptional()
  country?: string;
}

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

  @ApiPropertyOptional({
    example: "male",
    description: "User gender",
    enum: ["male", "female", "other", "prefer_not_to_say"],
  })
  @IsEnum(["male", "female", "other", "prefer_not_to_say"])
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: "+1234567890", description: "Phone number" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: "1998-01-15", description: "Date of birth (YYYY-MM-DD)" })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ type: AddressDto, description: "User address" })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsObject()
  @IsOptional()
  address?: AddressDto;

  @ApiPropertyOptional({ example: "Software developer passionate about coding", description: "User bio" })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg", description: "Avatar URL" })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: "https://johndoe.com", description: "Personal website" })
  @IsString()
  @IsOptional()
  website?: string;
}
