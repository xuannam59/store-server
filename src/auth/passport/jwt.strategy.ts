import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/modules/users/users.inerface';
import { UsersService } from '@/modules/users/users.service';
import { RolesService } from '@/modules/roles/roles.service';
import { permission } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private roleService: RolesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lấy token ở Header
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });
    }

    async validate(payload: IUser) {
        const { _id, email, name, role } = payload;
        const user = await this.usersService.findOne(_id);
        const userRole = user.role as unknown as { _id: string, name: string }
        const term = await this.roleService.findOne(userRole._id);
        return {
            _id,
            email,
            name,
            role,
            avatar: user?.avatar ?? "",
            permissions: term?.permissions ?? []
        }; // req.user
    }
}