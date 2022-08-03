import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { AuthEntity } from '../models/auth.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private authRepository: Repository<AuthEntity>,
    private readonly authService: AuthService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');

    await this.validateRequest(token);

    return true;
  }

  async validateRequest(token: string) {
    const result = await this.authService.validateUser(token);

    if (result === null) {
      throw new UnauthorizedException();
    }
  }
}
