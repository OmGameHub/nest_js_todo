import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import ApiResponse from "@/utils/ApiResponse";

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
      "Users registered successfully.",
      { user },
    );
  }
}
