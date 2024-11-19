import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        if (err) {
          // Handle different types of errors
          if (info && info.message === 'jwt expired') {
            throw new UnauthorizedException('Authorization token has expired.');
          }
          throw new UnauthorizedException('Authorization error.');
        }
      
        if (!user) {
          throw new UnauthorizedException('Authorization token is missing or invalid.');
        }
      
        return user;
      }
      
}
