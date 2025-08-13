import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// we are writing this for custom guard message (optional)
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Session expired. Please log in again.',
        );
      }
      throw new UnauthorizedException('Invalid or missing token.');
    }
    return user; // passes req.user to the controller
  }
}

// How they’re works:
// JwtAuthGuard → calls AuthGuard('jwt')
// AuthGuard('jwt') → uses your registered JwtStrategy
// JwtStrategy.validate() → returns user info to JwtAuthGuard
// JwtAuthGuard.handleRequest() → decides what to do with that info (return it or throw error)
