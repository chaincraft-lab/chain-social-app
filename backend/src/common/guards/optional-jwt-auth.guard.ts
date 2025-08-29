import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    // If no auth header, just continue without authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true;
    }
    
    // If auth header exists, validate the token
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, just return null instead of throwing
    // This allows the request to proceed without authentication
    return user || null;
  }
}