import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import ApiResponse from "@/utils/ApiResponse";

@Controller({
  version: "1",
  path: "/health-check",
})
export class HealthCheckController {
  /** API endpoint to server health.
   * @returns a response body containing status.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return new ApiResponse(HttpStatus.OK, "Health check passed.");
  }
}
