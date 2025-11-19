// types/user.ts

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password_hash: string;
  created_at: string; // ISO 8601 date string
}
