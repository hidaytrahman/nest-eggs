import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
// import { Roles } from 'src/decorators/roles.decorator';
import { QuerySearchUserDto } from 'src/dto/search-user.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
// import { RolesGuard } from 'src/guards/roles.guard';
import { UserService } from 'src/services/user.service';
import {
  NotPositiveResponse,
  Role,
  User,
  UsersResponseType,
} from 'src/types/user.types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // fetch all users
  @Get()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin) // Only admins can access this route
  fetchAllUsers(): UsersResponseType {
    return this.userService.fetchAllUsers();
  }

  // find user

  @Get('/find/:id')
  @UseGuards(JwtAuthGuard)
  findUser(@Param('id', ParseIntPipe) params): User | NotPositiveResponse {
    return this.userService.findUserById(params);
  }

  // Search users
  //  Can be search with age, email, firstName
  @Get('/search')
  @UseGuards(JwtAuthGuard)
  findUserByQuery(
    @Query(new ValidationPipe({ transform: true })) query: QuerySearchUserDto
  ): UsersResponseType | NotPositiveResponse {
    console.log('query ', query);

    return this.userService.findUsersByQueryParams(query);
  }

  // create a user
  @Post()
  // apply role guards
  @UseGuards(JwtAuthGuard)
  // @Roles(Role.Admin)
  createUser(@Body() createUserDto: CreateUserDto) {
    this.userService.createUser(createUserDto);
  }

  // update a user

  // delete a user
}
