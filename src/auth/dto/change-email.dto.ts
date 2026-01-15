import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeEmailDto {
  @ApiProperty({
    example: "newemail@example.com",
    description: "New email address",
  })
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;

  @ApiProperty({
    example: "password123",
    description: "Current password for verification",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
