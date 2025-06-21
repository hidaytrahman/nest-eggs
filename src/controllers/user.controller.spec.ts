import { Test, TestingModule } from '@nestjs/testing';
import * as USERS_JSON from '../data/users.json';
import { UserController } from './user.controller';
import { UserService } from 'src/services/user.service';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return all users', () => {
      expect(userController.fetchAllUsers()).toBe(USERS_JSON);
    });
  });
});
