import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountService } from '../account/account.service';

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const account = await this.accountService.findOne(payload.sub);
    if (!account || account.status !== 'active') {
      throw new UnauthorizedException('账号不存在或已停用');
    }

    return {
      userId: account.id,
      username: account.username,
      role: account.role,
      roleName: account.roleName,
      permissions: account.permissions ?? [],
    };
  }
}
