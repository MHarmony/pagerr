import { DatabaseFile } from '../database-file/database-file.interface';
import { Role } from './enum/role.enum';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  avatar?: DatabaseFile;
  avatarId?: string;
  hashedRefreshToken?: string;
  isEmailConfirmed: boolean;
  twoFactorAuthSecret?: string;
  isTwoFactorAuthEnabled: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
