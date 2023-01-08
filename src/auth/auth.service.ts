import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PayloadToken } from './models/token.model';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailOrUsername(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      status: 'ok',
      user,
    };
  }
}
