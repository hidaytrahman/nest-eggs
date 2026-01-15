import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    example: "reset_token_here",
    description: "Password reset token received via email",
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: "newPassword123",
    description: "New password (6-50 characters)",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  newPassword: string;
}
