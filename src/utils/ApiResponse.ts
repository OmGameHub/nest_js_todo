/**
 * Represents a standard API response.
 */
class ApiResponse {
  public statusCode: number;
  public data: any;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, message: string = "Success", data?: any) {
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.statusCode = statusCode;
  }
}

export default ApiResponse;
