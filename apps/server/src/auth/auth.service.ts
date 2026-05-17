import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface UserPayload {
  id: number;
  username: string;
  name?: string;
  nickname?: string;
  email?: string;
  role: string;
  roleName?: string;
  permissions: string[];
  status: string;
}

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserPayload | null> {
    const user = await this.accountService.findByUsername(username);
    // 始终执行 bcrypt.compare 以防止时序攻击
    const passwordValid = user ? await bcrypt.compare(pass, user.password) : false;
    if (!user || !passwordValid) {
      return null;
    }
    if (user.status === 'inactive') {
      throw new UnauthorizedException('Account is disabled');
    }
    if (user.roleConfig.status !== 'active') {
      throw new UnauthorizedException('Role is disabled');
    }
    const { password, roleConfig, ...result } = user;
    void password;
    return {
      ...result,
      roleName: roleConfig.name,
      permissions: roleConfig.permissions.map((item) => item.permission.code),
    } as UserPayload;
  }

  async login(user: UserPayload) {
    await this.accountService.updateLastLogin(user.id);
    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        roleName: user.roleName,
        permissions: user.permissions,
        status: user.status,
      },
    };
  }

  getProfile(userId: number) {
    return this.accountService.findOne(userId);
  }

  updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.accountService.updateProfile(userId, dto);
  }

  changePassword(userId: number, dto: ChangePasswordDto) {
    return this.accountService.changePassword(userId, dto.oldPassword, dto.newPassword);
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return this.accountService.forgotPassword(dto.email);
  }

  resetForgottenPassword(dto: ResetPasswordDto) {
    return this.accountService.resetForgottenPassword(dto.token, dto.newPassword);
  }
}
