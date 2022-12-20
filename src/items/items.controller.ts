import * as fs from 'fs';
import * as path from 'path';

import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { parse } from 'csv-parse';

interface Item {
  id: string;
  code: string;
  description: string;
}

interface Items {
  items: { [key: string]: Item };
  total: number;
}

@Controller('items')
export class ItemsController {
  private async getItems(): Promise<Items> {
    const csvFilePath = path.join(__dirname, '../../data', 'items.csv');
    const readStream = fs.createReadStream(csvFilePath);
    const parser = parse({
      columns: true,
      delimiter: ',',
      skip_empty_lines: true,
    });
    const items = {};
    let total = 0;
    return new Promise((resolve, reject) => {
      readStream
        .pipe(parser)
        .on('data', (data: Item) => {
          items[data.id] = data;
          total++;
        })
        .on('end', () => resolve({ items, total }))
        .on('error', (err) => reject(err));
    });
  }

  @Get()
  async getAllItems(): Promise<Items> {
    const items = await this.getItems();
    return items;
  }

  @Get(':id')
  async getItemById(@Param('id') id: string): Promise<Item> {
    const items = await this.getItems();
    const result = items.items[id];
    if (!result) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
