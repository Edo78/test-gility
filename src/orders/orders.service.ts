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
        .on('data', async (data: Order) => {
          data.itemIds = JSON.parse((data.itemIds as unknown) as string);

          if (!indexes['users'][data.userId]) {
            indexes['users'][data.userId] = [];
          }
          indexes['users'][data.userId].push(data.id);

          data.itemIds.forEach((itemId) => {
            if (!indexes['items'][itemId]) {
              indexes['items'][itemId] = [];
            }
            indexes['items'][itemId].push(data.id);
          });

          orders[data.id] = data;
          total++;
        })
        .on('end', async () => {
          resolve({ orders, indexes, total });
        })
        .on('error', (err) => reject(err));
    });
  }

  public async getOrderById(id: string): Promise<Order> {
    const orders = await this.getOrders();
    const result = orders.orders[id];
    return result;
  }

  public async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.getOrders();
    const orderIds = orders.indexes.users[userId];
    const result = orderIds
      ? orderIds.map((orderId) => orders.orders[orderId])
      : [];
    return result;
  }

  public async getOrdersByItemId(itemId: string): Promise<Order[]> {
    const orders = await this.getOrders();
    const orderIds = orders.indexes.items[itemId];
    const result = orderIds
      ? orderIds.map((orderId) => orders.orders[orderId])
      : [];
    return result;
  }
}
