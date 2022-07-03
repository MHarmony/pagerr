import { DatabaseFile } from '../database-file/database-file.interface';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar?: DatabaseFile;
  avatarId?: string;
  hashedRefreshToken?: string;
  isEmailConfirmed: boolean;
  twoFactorAuthSecret?: string;
  isTwoFactorAuthEnabled: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
