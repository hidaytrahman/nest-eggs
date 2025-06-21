import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
  type: 'user' | 'admin';
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      type: 'user',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      type: 'user',
    },
    {
      userId: 3,
      username: 'hidayt',
      password: 'rahman',
      type: 'admin',
    },
  ];

  async findOne(username: string): Promise<any | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
