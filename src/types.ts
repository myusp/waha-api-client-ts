/**
 * Configuration for WAHA API client
 */
export interface WAHAConfig {
  /**
   * Base URL of the WAHA API (e.g., "https://waha.devlike.pro")
   */
  baseURL: string;

  /**
   * API key for authentication
   */
  apiKey?: string;

  /**
   * Default session name to use
   */
  session?: string;

  /**
   * Default request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Number of retry attempts on failure
   */
  retryAttempts?: number;

  /**
   * Delay between retry attempts in milliseconds
   */
  retryDelay?: number;
}

/**
 * Override configuration for individual API calls
 */
export interface RequestConfig {
  /**
   * Override the session for this specific request
   */
  session?: string;

  /**
   * Override timeout for this specific request (in milliseconds)
   */
  timeout?: number;

  /**
   * Override retry attempts for this specific request
   */
  retryAttempts?: number;

  /**
   * Override retry delay for this specific request (in milliseconds)
   */
  retryDelay?: number;
}

/**
 * Text message parameters
 */
export interface SendTextParams {
  /**
   * Chat ID to send message to
   */
  chatId: string;

  /**
   * Text content of the message
   */
  text: string;

  /**
   * Message ID to reply to
   */
  reply_to?: string;

  /**
   * Optional request configuration override
   */
  config?: RequestConfig;
}

/**
 * Image message parameters
 */
export interface SendImageParams {
  /**
   * Chat ID to send message to
   */
  chatId: string;

  /**
   * Image file data (base64 or URL)
   */
  file: string;

  /**
   * Caption for the image
   */
  caption?: string;

  /**
   * Message ID to reply to
   */
  reply_to?: string;

  /**
   * Optional request configuration override
   */
  config?: RequestConfig;
}

/**
 * File message parameters
 */
export interface SendFileParams {
  /**
   * Chat ID to send message to
   */
  chatId: string;

  /**
   * File data (base64 or URL)
   */
  file: string;

  /**
   * Filename
   */
  filename?: string;

  /**
   * Caption for the file
   */
  caption?: string;

  /**
   * Message ID to reply to
   */
  reply_to?: string;

  /**
   * Optional request configuration override
   */
  config?: RequestConfig;
}

/**
 * Session info
 */
export interface SessionInfo {
  name: string;
  status: string;
  config?: Record<string, unknown>;
  me?: Record<string, unknown>;
}

/**
 * Chat info
 */
export interface ChatInfo {
  id: string;
  name?: string;
  isGroup?: boolean;
  participants?: Array<Record<string, unknown>>;
}

/**
 * Message info
 */
export interface MessageInfo {
  id: string;
  from?: string;
  body?: string;
  timestamp?: number;
  type?: string;
}

/**
 * API Response wrapper
 */
export interface APIResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}
