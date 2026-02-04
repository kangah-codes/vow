export interface WebSocketMessage {
  type: string;
  payload: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
