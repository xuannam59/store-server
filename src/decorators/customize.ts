import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// @Public()
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// @ResponseMessage(<message>)
export const ResponseMessageKey = 'ResponseMessageKey'
export const ResponseMessage = (message: string) => SetMetadata(ResponseMessageKey, message)

// @User()
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);