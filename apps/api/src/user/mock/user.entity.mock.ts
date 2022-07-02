import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../entity/user.entity';

export const userMock: UserEntity = {
  id: uuidv4(),
  email: 'user@email.com',
  username: 'johndoe',
  password: 'hash',
  isEmailConfirmed: false,
  dateCreated: new Date(),
  dateUpdated: new Date()
};
