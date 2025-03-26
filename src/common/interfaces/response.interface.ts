export interface ResponseInterface {
  success: boolean;
  message: string;
  data: unknown | unknown[];
  statusCode: number;
}
