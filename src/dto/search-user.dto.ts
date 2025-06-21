import { Type } from 'class-transformer';
import { IsEmail, IsInt, Min, Max, IsEnum, IsOptional, IsNumberString, IsAlpha } from 'class-validator';
import { GenderType } from 'src/types/user.types';

export class QuerySearchUserDto {
  @IsEnum(GenderType)
  @IsOptional()
  readonly gender: string;

  @IsAlpha()
  @IsOptional()
  readonly firstName: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(18)
  @Max(120)
  readonly age: number;
}

// just for example for @Param - not in used
export class FindOneParams {
  @IsNumberString()
  id: string;
}
