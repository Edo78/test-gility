import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

import { Order, Orders } from './orders.types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(): Promise<Orders> {
    const orders = await this.ordersService.getOrders();
    return orders;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const orders = await this.ordersService.getOrders();
    const result = orders.orders[id];
    if (!result) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
