import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../entity/user.entity';
import { Role } from '@pagerr/api-interfaces';

export const userMock: UserEntity = {
  id: uuidv4(),
  email: 'user@email.com',
  username: 'johndoe',
  password: 'hash',
  isTwoFactorAuthEnabled: false,
  isEmailConfirmed: false,
  role: Role.USER,
  dateCreated: new Date(),
  dateUpdated: new Date()
};
