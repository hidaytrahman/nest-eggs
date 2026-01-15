import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "john_doe", description: "Username" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "password123", description: "User password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
