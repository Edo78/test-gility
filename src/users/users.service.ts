import * as fs from 'fs';
import * as path from 'path';

import { User, Users } from './users.types';

import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';

@Injectable()
export class UsersService {
  public async getUsers(): Promise<Users> {
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
}
