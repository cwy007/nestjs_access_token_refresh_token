import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('require-login')
  @UseGuards(LoginGuard)
  getProtected(): string {
    return 'This is a protected route';
  }

  @Get('not-require-login')
  getUnprotected(): string {
    return 'This is an unprotected route';
  }
}
