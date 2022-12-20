import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from 'src/items/items.service';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from './orders.service';

import { Order, Orders } from './orders.types';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  @Get()
  async getAllOrders(
    @Query('includeUser') includeUser: boolean,
    @Query('includeItems') includeItems: boolean,
  ): Promise<Orders> {
    const orders = await this.ordersService.getOrders();
    if (((includeUser as unknown) as string) === 'true') {
      const users = await this.usersService.getUsers();
      for (const orderId in orders.orders) {
        if (orders.orders.hasOwnProperty(orderId)) {
          const order = orders.orders[orderId];
          order.user = users.users[order.userId];
          orders.orders[orderId] = order;
        }
      }
    }
    if (((includeItems as unknown) as string) === 'true') {
      const items = await this.itemsService.getItems();
      for (const orderId in orders.orders) {
        if (orders.orders.hasOwnProperty(orderId)) {
          const order = orders.orders[orderId];
          order.items = order.itemIds.map((itemId) => items.items[itemId]);
          orders.orders[orderId] = order;
        }
      }
    }
    return orders;
  }

  @Get(':id')
  async getOrderById(
    @Param('id') id: string,
    @Query('includeUser') includeUser: boolean,
    @Query('includeItems') includeItems: boolean,
  ): Promise<Order> {
    const order = await this.ordersService.getOrderById(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (((includeUser as unknown) as string) === 'true') {
      const user = await this.usersService.getUserById(order.userId);
      order.user = user;
    }
    if (((includeItems as unknown) as string) === 'true') {
      const items = await this.itemsService.getItemsByIds(order.itemIds);
      order.items = items;
    }
    return order;
  }

  @Get('users/:userId')
  async getOrdersByUserId(
    @Param('userId') userId: string,
    @Query('includeUser') includeUser: boolean,
    @Query('includeItems') includeItems: boolean,
  ): Promise<Order[]> {
    const orders = await this.ordersService.getOrdersByUserId(userId);
    if (orders.length === 0) {
      throw new HttpException(
        `Orders not found for User ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (((includeItems as unknown) as string) === 'true') {
      const items = await this.itemsService.getItems();
      for (const order of orders) {
        order.items = order.itemIds.map((itemId) => items.items[itemId]);
      }
    }
    if (((includeUser as unknown) as string) === 'true') {
      const users = await this.usersService.getUsers();
      for (const order of orders) {
        order.user = users.users[order.userId];
      }
    }
    return orders;
  }

  @Get('items/:itemId')
  async getOrdersByItemId(
    @Param('itemId') itemId: string,
    @Query('includeUser') includeUser: boolean,
    @Query('includeItems') includeItems: boolean,
  ): Promise<Order[]> {
    const orders = await this.ordersService.getOrdersByItemId(itemId);
    if (orders.length === 0) {
      throw new HttpException(
        `Orders not found for Item ${itemId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (((includeItems as unknown) as string) === 'true') {
      const items = await this.itemsService.getItems();
      for (const order of orders) {
        order.items = order.itemIds.map((itemId) => items.items[itemId]);
      }
    }
    if (((includeUser as unknown) as string) === 'true') {
      const users = await this.usersService.getUsers();
      for (const order of orders) {
        order.user = users.users[order.userId];
      }
    }
    return orders;
  }
}
