// This is a custom decorator called @Roles().
// How it works:
// It attaches metadata to a route handler.
// That metadata contains the list of allowed roles.
// Key is "roles", value is an array like ['super admin', 'manager'].
// eg: @Roles('super admin', 'manager', 'ta')

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
