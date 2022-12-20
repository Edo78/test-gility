export interface Item {
  id: string;
  code: string;
  description: string;
}

export interface Items {
  items: { [key: string]: Item };
  total: number;
}
