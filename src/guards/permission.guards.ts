import { IUser } from "@/modules/users/users.interface";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class PermissionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();

        const targetMethod = req.method;
        const targetEndpoint = req.route.path;
        const user: IUser = req["user"];
        const permissions = user.permissions;

        const isExist = permissions.find(permission =>
            targetMethod === permission.method
            &&
            targetEndpoint === permission.apiPath);
        if (!isExist)
            throw new ForbiddenException("Permission denied");

        return true;
    }
}