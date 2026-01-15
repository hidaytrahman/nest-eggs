import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QuerySearchUserDto } from 'src/dto/search-user.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from 'src/services/user.service';
import { NotPositiveResponse, User, UsersResponseType } from 'src/types/user.types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  fetchAllUsers(): UsersResponseType {
    return this.userService.fetchAllUsers();
  }

  @Get('/find/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findUser(@Param('id', ParseIntPipe) id: number): User | NotPositiveResponse {
    return this.userService.findUserById(id);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search users by query parameters' })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'age', required: false, type: Number })
  @ApiQuery({ name: 'gender', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Users found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No users found' })
  findUserByQuery(@Query() query: QuerySearchUserDto): UsersResponseType | NotPositiveResponse {
    return this.userService.findUsersByQueryParams(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
