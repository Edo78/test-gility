export interface User {
  id: string;
  username: string;
  fullName: string;
}

export interface Users {
  users: { [key: string]: User };
  total: number;
}
