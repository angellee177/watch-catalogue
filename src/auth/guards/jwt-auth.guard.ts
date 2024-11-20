import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
      // Handle specific JWT-related errors
      if (err || !user) {
        if (info) {
          switch (info.message) {
            case 'jwt expired':
              throw new UnauthorizedException('Authorization token has expired.');
            case 'jwt malformed':
              throw new UnauthorizedException('Malformed authorization token.');
            case 'invalid token':
              throw new UnauthorizedException('Invalid authorization token.');
            case 'No auth token':
              throw new UnauthorizedException('Authorization token is missing.');
            default:
              throw new UnauthorizedException(`Authorization error: ${info.message}`);
          }
        }
        throw new UnauthorizedException('Authorization error.');
      }

    // If user is valid, return it
    return user;
  }
}
