export interface IUser {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface IUserAuth {
  email: string;
  password: string;
}

export interface IUserUpdate {
  first_name: string;
  last_name: string;
}
