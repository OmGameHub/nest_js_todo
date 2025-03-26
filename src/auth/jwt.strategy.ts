import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Check Authorization Bearer token
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Check cookies
        (req: Request) => {
          const token = req.cookies?.["access_token"];
          if (!token) return null;

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, email: payload.email };
  }
}
