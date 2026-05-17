import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Put,
  Request,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Request as ExpressRequest } from 'express';
import { OperationLog } from '../log/decorators/operation-log.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: number;
    username: string;
    role: string;
    permissions: string[];
  };
}

@ApiTags('认证管理')
@Controller('admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @OperationLog({
    module: '认证管理',
    action: '登录',
    details: ({ result }) => {
      const user = (result as { user?: { username?: string } })?.user;
      return `用户登录成功：${user?.username ?? 'unknown'}`;
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: '退出登录' })
  @OperationLog({
    module: '认证管理',
    action: '退出登录',
    details: ({ request }) =>
      `用户退出登录：${String(request.user?.username ?? 'unknown')}`,
  })
  logout() {
    return { message: '退出成功' };
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: '忘记密码' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: '通过重置令牌设置新密码' })
  resetForgottenPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetForgottenPassword(resetPasswordDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @SkipThrottle()
  @ApiOperation({ summary: '获取当前登录用户信息' })
  getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.userId);
  }

  @ApiBearerAuth()
  @Put('profile')
  @ApiOperation({ summary: '更新当前登录用户资料' })
  @OperationLog({
    module: '认证管理',
    action: '更新个人资料',
    details: ({ result }) => {
      const user = result as { username?: string; nickname?: string; name?: string };
      return `更新个人资料：${String(user.nickname ?? user.name ?? user.username ?? 'unknown')}`;
    },
  })
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.userId, updateProfileDto);
  }

  @ApiBearerAuth()
  @Put('password')
  @ApiOperation({ summary: '修改当前登录用户密码' })
  @OperationLog({
    module: '认证管理',
    action: '修改密码',
    details: ({ result }) => {
      const user = result as { username?: string; nickname?: string; name?: string };
      return `修改密码：${String(user.nickname ?? user.name ?? user.username ?? 'unknown')}`;
    },
  })
  changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }
}
