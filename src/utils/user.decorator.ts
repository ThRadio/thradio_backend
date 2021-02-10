import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';

export const FirebaseUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().headers.user;
    return user;
  },
);
