/**
 * Custom convenience types for WAHA API Client
 * 
 * This file contains only custom types that are not part of the OpenAPI schema.
 * For OpenAPI schema types, see schema-types.ts
 */

/**
 * Configuration for WAHA API client
 * 
 * @example
 * ```typescript
 * const config: WAHAConfig = {
 *   baseURL: 'https://waha.devlike.pro',
 *   apiKey: 'your-api-key',
 *   session: 'default',
 * };
 * ```
 */
export interface WAHAConfig {
  /** Base URL of the WAHA API (required) */
  baseURL: string;
  /** API key for authentication (optional) */
  apiKey?: string;
  /** Default session name (default: 'default') */
  session?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Number of retry attempts (default: 3) */
  retryAttempts?: number;
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
}

/**
 * Override configuration for individual API calls
 */
export interface RequestConfig {
  /** Override session for this request */
  session?: string;
  /** Override timeout in milliseconds */
  timeout?: number;
  /** Override retry attempts */
  retryAttempts?: number;
  /** Override retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * Convenience interface for sending text messages
 */
export interface SendTextParams {
  chatId: string;
  text: string;
  reply_to?: string;
  config?: RequestConfig;
}

/**
 * Convenience interface for sending image messages
 */
export interface SendImageParams {
  chatId: string;
  file: string;
  caption?: string;
  reply_to?: string;
  config?: RequestConfig;
}

/**
 * Convenience interface for sending file messages
 */
export interface SendFileParams {
  chatId: string;
  file: string;
  filename?: string;
  caption?: string;
  reply_to?: string;
  config?: RequestConfig;
}

/**
 * API Response wrapper (generic)
 */
export interface APIResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

