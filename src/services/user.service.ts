import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as USERS_JSON from "../data/users.json";
import {
  NotPositiveResponse,
  User,
  UsersResponseType,
} from "src/types/user.types";
import { QuerySearchUserDto } from "src/dto/search-user.dto";

@Injectable()
export class UserService {
  fetchAllUsers(): UsersResponseType {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return USERS_JSON;
  }

  //   find user by id
  findUserById(param: number): User | NotPositiveResponse {
    const users: User | undefined = USERS_JSON.users.find(
      (user) => user.id == param,
    );
    if (users) return users;

    return {
      message: "No user found",
    };
  }

  //   find by query params
  findUsersByQueryParams(
    params: QuerySearchUserDto,
  ): UsersResponseType | NotPositiveResponse {
    const users: User[] | [] = USERS_JSON.users.filter(
      (user) =>
        params?.firstName?.toLowerCase() === user.firstName.toLowerCase() ||
        params.gender === user.gender ||
        params.age === user.age ||
        params.email === user.email,
    );

    if (users?.length === 0) {
      return {
        message: "No user found!!!",
      };
    }

    return {
      users,
      total: users.length,
    };
  }

  createUser(createUserDto) {
    console.log(createUserDto);
    // const saltOrRounds = 10;
    // const password = 'random_password';
    // const hash = await bcrypt.hash(password, saltOrRounds);
    // console.log(" hash ", hash)

    return {
      message: "User created",
    };
  }
}
