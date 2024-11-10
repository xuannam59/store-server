import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lấy token ở Header
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("TOKEN_ACCESS_SECRET"),
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}