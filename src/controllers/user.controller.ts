import { Controller, Get, Param, Query } from "@nestjs/common";
import { UsersService, User } from "../users/users.service";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // Find user by ID
  @Get(":id")
  async findById(@Param("id") id: string): Promise<User | null> {
    const userId = Number(id);
    const users: User[] = await this.usersService.findAll();
    return users.find((user) => user.id === userId) || null;
  }

  // Search users by username or type
  @Get()
  async searchUsers(
    @Query("username") username?: string,
    @Query("type") type?: string,
  ): Promise<User[]> {
    let users: User[] = await this.usersService.findAll();
    if (username) {
      users = users.filter((user) => user.username.includes(username));
    }
    if (type) {
      users = users.filter((user) => user.type === type);
    }
    return users;
  }
}
