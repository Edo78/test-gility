import { Item } from '../items/items.types';
import { User } from '../users/users.types';

export interface Order {
  id: string;
  userId: string;
  user: User;
  itemIds: string[];
  items: Item[];
  address: string;
}

export interface Orders {
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
