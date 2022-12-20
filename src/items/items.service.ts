import * as fs from 'fs';
import * as path from 'path';

import { Item, Items } from './items.types';

import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';

@Injectable()
export class ItemsService {
  public async getItems(): Promise<Items> {
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

  public async getItemById(id: string): Promise<Item> {
    const items = await this.getItems();
    const result = items.items[id];
    return result;
  }

  public async getItemsByIds(ids: string[]): Promise<Item[]> {
    const items = await this.getItems();
    const result = ids.map((id) => items.items[id]);
    return result;
  }
}
