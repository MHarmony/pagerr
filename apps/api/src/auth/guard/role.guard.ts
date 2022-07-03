import { Role } from '@pagerr/api-interfaces';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { JwtGuard } from './jwt.guard';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};
