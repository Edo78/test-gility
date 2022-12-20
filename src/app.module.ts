import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ItemsController } from './items/items.controller';
import { OrdersController } from './orders/orders.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, ItemsController, OrdersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
