import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async login(userLoginDto: UserLoginDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: userLoginDto.username,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', 404);
    }

    if (user.password !== userLoginDto.password) {
      throw new HttpException('密码错误', 400);
    }

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.entityManager.findOne(User, {
      where: {
        username: createUserDto.username,
      },
    });

    if (existingUser) {
      throw new HttpException('用户名已存在', 400);
    }

    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    await this.entityManager.save(User, user);

    return user;
  }
}
