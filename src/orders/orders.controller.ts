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

interface Order {
  id: string;
  userId: string;
  itemIds: string[];
  address: string;
}

interface Orders {
  orders: { [key: string]: Order };
  indexes: {
    users:
      | {
          [key: string]: string[];
        }
      | undefined;
    items:
      | {
          [key: string]: string[];
        }
      | undefined;
  };
  total: number;
}

@Controller('orders')
export class OrdersController {
  private async getOrders(): Promise<Orders> {
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

  @Get()
  async getAllOrders(): Promise<Orders> {
    const orders = await this.getOrders();
    return orders;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const orders = await this.getOrders();
    const result = orders.orders[id];
    if (!result) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
