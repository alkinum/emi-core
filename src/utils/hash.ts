import * as crypto from 'crypto';

export const hashPassword = (password: string): string => {
  for (let i = 0; i < 32; i++) {
    password = crypto.createHash('sha256').update(password).digest('hex');
  }
  return password;
};
