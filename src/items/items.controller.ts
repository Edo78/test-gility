import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ItemsService } from './items.service';

import { Item, Items } from './items.types';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async getAllItems(): Promise<Items> {
    const items = await this.itemsService.getItems();
    return items;
  }

  @Get(':id')
  async getItemById(@Param('id') id: string): Promise<Item> {
    const items = await this.itemsService.getItems();
    const result = items.items[id];
    if (!result) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
