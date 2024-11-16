export type UserAccount = {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  birth_date?: Date;
  created_at: Date;
  last_login: Date;
};
