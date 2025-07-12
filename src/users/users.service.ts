import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";

export type User = {
  id: number;
  username: string;
  password: string;
  type: "admin" | "user"; // Example field to differentiate user types
  // ...other fields as needed
};

function resolveUsersDbPath() {
  const distPath = path.join(__dirname, "../data/users.db.json");
  const srcPath = path.join(__dirname, "../../src/data/users.db.json");
  return fs
    .access(distPath)
    .then(() => distPath)
    .catch(() => srcPath);
}

@Injectable()
export class UsersService {
  private async getUsersJsonPath(): Promise<string> {
    return await resolveUsersDbPath();
  }

  private async readUsers(): Promise<User[]> {
    const USERS_JSON_PATH = await this.getUsersJsonPath();
    const data = await fs.readFile(USERS_JSON_PATH, "utf-8");
    const json = JSON.parse(data) as { users: User[] };
    return Array.isArray(json.users) ? json.users : [];
  }

  private async writeUsers(users: User[]): Promise<void> {
    const USERS_JSON_PATH = await this.getUsersJsonPath();
    await fs.writeFile(USERS_JSON_PATH, JSON.stringify({ users }, null, 2));
  }

  async findAll(): Promise<User[]> {
    return this.readUsers();
  }

  async findOne(username: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find((user) => user.username === username);
  }

  async createUser(newUser: Omit<User, "id">): Promise<User> {
    const users = await this.readUsers();
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user: User = { id, ...newUser };
    users.push(user);
    await this.writeUsers(users);
    return user;
  }

  async updateUser(
    id: number,
    update: Partial<User>,
  ): Promise<User | undefined> {
    const users = await this.readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    users[idx] = { ...users[idx], ...update };
    await this.writeUsers(users);
    return users[idx];
  }

  async deleteUser(id: number): Promise<boolean> {
    const users = await this.readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    users.splice(idx, 1);
    await this.writeUsers(users);
    return true;
  }
}
