import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Custom guard that checks if the user’s role is authorized for the route.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Fetches the metadata set by `@Roles()` on the route.
  // If no roles were specified, it returns `undefined`.
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() is set on the route, allow all authenticated users by default.
    if (!requiredRoles) return true;

    // Access the `user` object attached by `JwtStrategy` (`req.user`).
    // Check if `user.role` is in the list of allowed roles.
    // If yes → access granted, else 403 Forbidden.
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// Working flow
// JwtAuthGuard validates JWT and sets req.user
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('manager')
// RolesGuard checks if req.user.role === 'manager'
// If yes → continue to controller
// If not → throws 403 Forbidden
