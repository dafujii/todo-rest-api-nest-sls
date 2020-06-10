import { Controller, Get, Request, UseGuards, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './users/dto/login-user.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({
    description: 'ログイン成功。JWT返却。',
    //TODO: type: AccessToken,
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
