import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.register(createUserDto);
    return user;
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.userService.login(userLoginDto);

    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      { expiresIn: '30m' },
    );

    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      { expiresIn: '7d' },
    );

    return { access_token, refresh_token };
  }

  @Get('refresh-token')
  async refreshToken(@Query('refresh_token') refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(decoded.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        { expiresIn: '30m' },
      );

      const new_refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        { expiresIn: '7d' },
      );

      return { access_token, refresh_token: new_refresh_token };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token, please log in again');
    }
  }
}
