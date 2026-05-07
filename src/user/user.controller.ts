import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.userService.login(userLoginDto);
    return user;
  }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.register(createUserDto);
    return user;
  }
}
