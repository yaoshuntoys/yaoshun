import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AccountSecurityService {
  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }

  createResetToken() {
    const rawToken = randomBytes(32).toString('base64url');
    return {
      rawToken,
      tokenHash: this.hashResetToken(rawToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    };
  }

  hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
