import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';

import { Item, Items } from './items.types';

@ApiTags('Items')
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
    const item = await this.itemsService.getItemById(id);
    if (!item) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    return item;
  }
}
