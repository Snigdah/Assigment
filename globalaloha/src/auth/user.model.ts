export default class User {
  fullName?: string;
  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }
}

export class UserModel {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  emailConfirmed: boolean;
  phoneNumber: number;
  imageUrl: string;

  constructor(init: Partial<UserModel>) {
    Object.assign(this, init);
  }
}

export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: number;
}
