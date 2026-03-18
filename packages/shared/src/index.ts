export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  path: string;
  timestamp: string;
  success: boolean;
}
