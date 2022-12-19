import * as fs from 'fs';
import * as path from 'path';

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { parse } from 'csv-parse';

interface User {
  id: string;
  username: string;
  fullName: string;
}

interface Users {
  users: { [key: string]: User };
  total: number;
}

@Controller('users')
export class UsersController {
  private async getUsers(): Promise<Users> {
    const csvFilePath = path.join(__dirname, '../../data', 'users.csv');
    const readStream = fs.createReadStream(csvFilePath);
    const parser = parse({
      columns: true,
      delimiter: ',',
      skip_empty_lines: true,
    });
    const users = {};
    let total = 0;
    return new Promise((resolve, reject) => {
      readStream
        .pipe(parser)
        .on('data', (data: User) => {
          users[data.id] = data;
          total++;
        })
        .on('end', () => resolve({ users, total }))
        .on('error', (err) => reject(err));
    });
  }

  @Get()
  async getAllUsers(): Promise<Users> {
    const users = await this.getUsers();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const users = await this.getUsers();
    const result = users.users[id];
    if (!result) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
