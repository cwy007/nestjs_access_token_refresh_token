import { IsNotEmpty, Length } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(4, 50, { message: '用户名长度必须在4到50之间' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 255, { message: '密码长度必须在6到255之间' })
  password: string;
}