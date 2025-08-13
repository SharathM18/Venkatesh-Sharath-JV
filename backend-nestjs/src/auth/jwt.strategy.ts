import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// this will handle actual token validation part
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extracts the token from Authorization: Bearer <token> header.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // If token is expired, throw error.
      ignoreExpiration: false,
      // Verify the token signature
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  // Runs only if the token is valid.
  // Gets the payload from the decoded JWT.
  // The return value here becomes req.user in all downstream controllers and guards.
  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}

// How they’re works:
// JwtAuthGuard → calls AuthGuard('jwt')
// AuthGuard('jwt') → uses your registered JwtStrategy
// JwtStrategy.validate() → returns user info to JwtAuthGuard
// JwtAuthGuard.handleRequest() → decides what to do with that info (return it or throw error)
