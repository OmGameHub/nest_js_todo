import { Controller, Post, Body, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import ApiResponse from "@/utils/ApiResponse";
import Helpers from "@/utils/helper";

@Controller({
  version: "1",
  path: "auth",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginDto);

    Helpers.setCookies(res, "access_token", data.access_token);
    return new ApiResponse(HttpStatus.OK, "Login successful", data);
  }
}
