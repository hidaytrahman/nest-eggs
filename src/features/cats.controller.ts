import { Body, Controller, Get, Post } from "@nestjs/common";
import { CatsService } from "./cats.service";
// import { Cat } from "./interfaces/cat.interface";

export interface Cat {
  name: string;
  age: number;
  breed: string;
}

@Controller("/api/cats")
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  async create(@Body() cat: Cat): Promise<Cat> {
    console.log("Received cat data:", cat);
    return this.catsService.create(cat);
  }
}
