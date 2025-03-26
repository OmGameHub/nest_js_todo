import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import ApiResponse from "@/utils/ApiResponse";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorators";
import { UserEntity } from "./entities/user.entity";

@Controller({
  version: "1",
  path: "/users",
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.register(registerDto);
    return new ApiResponse(
      HttpStatus.CREATED,
      "User registered successfully.",
      { user },
    );
  }

  @Get("current-user")
  @UseGuards(JwtAuthGuard)
  async getLoggedInUser(@CurrentUser() user: UserEntity) {
    return new ApiResponse(
      HttpStatus.OK,
      "User details fetched successfully.",
      user,
    );
  }
}
