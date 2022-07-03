import { User } from '../user/user.interface';

export interface Message {
  id: string;
  content: string;
  author: User;
}
