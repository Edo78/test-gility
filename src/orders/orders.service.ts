import * as fs from 'fs';
import * as path from 'path';

import { Order, Orders } from './orders.types';

import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';

@Injectable()
export class OrdersService {
  public async getOrders(): Promise<Orders> {
    const csvFilePath = path.join(__dirname, '../../data', 'orders.csv');
    const readStream = fs.createReadStream(csvFilePath);
    const parser = parse({
      columns: true,
      delimiter: ',',
      skip_empty_lines: true,
    });
    const orders = {};
    const indexes = {
      users: {},
      items: {},
    };
    let total = 0;
    return new Promise((resolve, reject) => {
      readStream
        .pipe(parser)
        .on('data', (data: Order) => {
          data.itemIds = JSON.parse((data.itemIds as unknown) as string);
          orders[data.id] = data;
          // add index for userId so that we can quickly find orders by userId
          if (!indexes['users'][data.userId]) {
            indexes['users'][data.userId] = [];
          }
          indexes['users'][data.userId].push(data.id);
          // add index for itemIds so that we can quickly find orders by itemId
          data.itemIds.forEach((itemId) => {
            if (!indexes['items'][itemId]) {
              indexes['items'][itemId] = [];
            }
            indexes['items'][itemId].push(data.id);
          });
          total++;
        })
        .on('end', () => resolve({ orders, indexes, total }))
        .on('error', (err) => reject(err));
    });
  }
}
