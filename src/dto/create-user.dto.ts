// import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  // IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  @IsString()
  readonly password: string;

  // gender;
  //  "email": "sophia.brown@x.dummyjson.com",
  //     "phone": "+81 210-652-2785",
  //     "username": "sophiab",
  //     "password": "sophiabpass",
  //     "birthDate": "1982-11-6",
  //     "image": "https://dummyjson.com/icon/sophiab/128",
  //     "bloodGroup": "O-",
  //     "height": 177.72,
  //     "weight": 52.6,
  //     "eyeColor": "Hazel",
  //     "hair": {
  //       "color": "White",
  //       "type": "Wavy"
  //     },

  @IsEmail()
  readonly email: string;

  // @IsBoolean()
  // @IsString()
  // @Type(() => Boolean)
  // readonly primary: boolean;

  // @IsOptional()
  // @IsBoolean()
  // @Type(() => Boolean) // This helps with type conversion
  // @Transform(({ value }) => {
  //   console.log("hamar ", value);
  //   // Custom transformation logic
  //   if (value === 'true') {
  //     return true;
  //   }
  //   if (value === 'false') {
  //     return false;
  //   }
  //   // Return the original value if it's not 'true' or 'false' string,
  //   // allowing other validation rules to handle it if needed.
  //   return value as boolean;
  // })
  // myBooleanProperty?: boolean;

  @IsInt()
  @IsOptional()
  @Min(18)
  @Max(120)
  readonly age: number;
}
