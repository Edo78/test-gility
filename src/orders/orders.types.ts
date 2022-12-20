export interface Order {
  id: string;
  userId: string;
  itemIds: string[];
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
