import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User, Users } from './users.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<Users> {
    const users = await this.usersService.getUsers();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const users = await this.usersService.getUsers();
    const result = users.users[id];
    if (!result) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
