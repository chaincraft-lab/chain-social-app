import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
    /* There are no configuration options, so our constructor simply calls super(), without an options object*/
  }
  async validate(email: string, password: string): Promise<IUser> {
    const user = await this.authService.validateUser(email.toString(), password);
    if (!user) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Email or password is incorrect!'
      });
    }
    return user;
  }
}
