export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  hashedRefreshToken?: string;
  isEmailConfirmed: boolean;
  twoFactorAuthSecret?: string;
  isTwoFactorAuthEnabled: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
