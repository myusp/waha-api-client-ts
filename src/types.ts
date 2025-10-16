/**
 * Configuration for WAHA API client
 * 
 * Used to initialize the WAHAClient with default settings for all API requests.
 * 
 * @example
 * ```typescript
 * const config: WAHAConfig = {
 *   baseURL: 'https://waha.devlike.pro',
 *   apiKey: 'your-api-key',
 *   session: 'default',
 *   timeout: 30000,
 *   retryAttempts: 3,
 *   retryDelay: 1000,
 * };
 * 
 * const client = new WAHAClient(config);
 * ```
 */
export interface WAHAConfig {
  /**
   * Base URL of the WAHA API (e.g., "https://waha.devlike.pro")
   * This is the only required field.
   */
  baseURL: string;

  /**
   * API key for authentication (optional)
   * If your WAHA instance requires API key authentication, provide it here.
   */
  apiKey?: string;

  /**
   * Default session name to use for all requests (default: 'default')
   * Can be overridden per request using the config parameter.
   */
  session?: string;

  /**
   * Default request timeout in milliseconds (default: 30000)
   * Requests will fail if they take longer than this duration.
   */
  timeout?: number;

  /**
   * Number of retry attempts on failure (default: 3)
   * The client will automatically retry failed requests this many times.
   */
  retryAttempts?: number;

  /**
   * Delay between retry attempts in milliseconds (default: 1000)
   * Time to wait before retrying a failed request.
   */
  retryDelay?: number;
}

/**
 * Override configuration for individual API calls
 * 
 * Allows you to override the default WAHAConfig settings for specific API requests.
 * Useful when you need different settings for particular operations.
 * 
 * @example
 * ```typescript
 * // Use a different session for one request
 * await client.sendText({
 *   chatId: '1234567890@c.us',
 *   text: 'Hello!',
 *   config: {
 *     session: 'other-session',
 *   },
 * });
 * 
 * // Increase timeout for a slow operation
 * await client.sendFile({
 *   chatId: '1234567890@c.us',
 *   file: 'large-file.pdf',
 *   config: {
 *     timeout: 60000,
 *   },
 * });
 * 
 * // Increase retries for critical message
 * await client.sendText({
 *   chatId: '1234567890@c.us',
 *   text: 'Important notification',
 *   config: {
 *     retryAttempts: 10,
 *     retryDelay: 2000,
 *   },
 * });
 * ```
 */
export interface RequestConfig {
  /**
   * Override the session for this specific request
   * Useful when working with multiple WhatsApp sessions.
   */
  session?: string;

  /**
   * Override timeout for this specific request (in milliseconds)
   * Use higher values for operations that may take longer (e.g., large file uploads).
   */
  timeout?: number;

  /**
   * Override retry attempts for this specific request
   * Set higher for critical operations, lower for non-essential ones.
   */
  retryAttempts?: number;

  /**
   * Override retry delay for this specific request (in milliseconds)
   * Time to wait between retry attempts.
   */
  retryDelay?: number;
}

/**
 * Text message parameters
 * 
 * Parameters for sending a text message using sendText() or safeSendText().
 * 
 * @example
 * ```typescript
 * const params: SendTextParams = {
 *   chatId: '1234567890@c.us',
 *   text: 'Hello, World!',
 *   reply_to: 'message-id-to-reply-to', // optional
 *   config: { session: 'custom-session' }, // optional
 * };
 * 
 * await client.sendText(params);
 * ```
 */
export interface SendTextParams {
  /**
   * Chat ID to send message to
   * Format: phone@c.us for individual chats, groupId@g.us for groups
   */
  chatId: string;

  /**
   * Text content of the message
   * Plain text or text with WhatsApp formatting (e.g., *bold*, _italic_, ~strikethrough~)
   */
  text: string;

  /**
   * Message ID to reply to (optional)
   * If provided, the message will be sent as a reply to the specified message
   */
  reply_to?: string;

  /**
   * Optional request configuration override
   * Allows overriding session, timeout, retry settings for this specific request
   */
  config?: RequestConfig;
}

/**
 * Image message parameters
 * 
 * Parameters for sending an image message using sendImage() or safeSendImage().
 * 
 * @example
 * ```typescript
 * // Send image from URL
 * const params: SendImageParams = {
 *   chatId: '1234567890@c.us',
 *   file: 'https://example.com/image.jpg',
 *   caption: 'Check out this image!',
 * };
 * 
 * // Send image from base64
 * const base64Params: SendImageParams = {
 *   chatId: '1234567890@c.us',
 *   file: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
 *   caption: 'Image from base64',
 * };
 * 
 * await client.sendImage(params);
 * ```
 */
export interface SendImageParams {
  /**
   * Chat ID to send message to
   * Format: phone@c.us for individual chats, groupId@g.us for groups
   */
  chatId: string;

  /**
   * Image file data (base64 or URL)
   * Can be a URL (http/https) or base64-encoded image data with data URI scheme
   */
  file: string;

  /**
   * Caption for the image (optional)
   * Text that will be displayed with the image
   */
  caption?: string;

  /**
   * Message ID to reply to (optional)
   * If provided, the image will be sent as a reply to the specified message
   */
  reply_to?: string;

  /**
   * Optional request configuration override
   * Allows overriding session, timeout, retry settings for this specific request
   */
  config?: RequestConfig;
}

/**
 * File message parameters
 * 
 * Parameters for sending a file/document using sendFile() or safeSendFile().
 * 
 * @example
 * ```typescript
 * // Send PDF from URL
 * const params: SendFileParams = {
 *   chatId: '1234567890@c.us',
 *   file: 'https://example.com/document.pdf',
 *   filename: 'report.pdf',
 *   caption: 'Monthly report',
 * };
 * 
 * // Send file from base64
 * const base64Params: SendFileParams = {
 *   chatId: '1234567890@c.us',
 *   file: 'data:application/pdf;base64,JVBERi0xLjcKC...',
 *   filename: 'document.pdf',
 * };
 * 
 * await client.sendFile(params);
 * ```
 */
export interface SendFileParams {
  /**
   * Chat ID to send message to
   * Format: phone@c.us for individual chats, groupId@g.us for groups
   */
  chatId: string;

  /**
   * File data (base64 or URL)
   * Can be a URL (http/https) or base64-encoded file data with data URI scheme
   */
  file: string;

  /**
   * Filename (optional)
   * The name that will be shown for the file in WhatsApp
   */
  filename?: string;

  /**
   * Caption for the file (optional)
   * Text that will be displayed with the file
   */
  caption?: string;

  /**
   * Message ID to reply to (optional)
   * If provided, the file will be sent as a reply to the specified message
   */
  reply_to?: string;

  /**
   * Optional request configuration override
   * Allows overriding session, timeout, retry settings for this specific request
   */
  config?: RequestConfig;
}

/**
 * Session information
 * 
 * Represents a WhatsApp session with its current state and configuration.
 * 
 * @example
 * ```typescript
 * const session: SessionInfo = {
 *   name: 'default',
 *   status: 'WORKING',
 *   config: { webhooks: [...] },
 *   me: { id: '1234567890@c.us', pushname: 'My Name' },
 * };
 * ```
 */
export interface SessionInfo {
  /**
   * Name of the session
   */
  name: string;

  /**
   * Current status of the session
   * Common values: 'STARTING', 'SCAN_QR_CODE', 'WORKING', 'FAILED', 'STOPPED'
   */
  status: string;

  /**
   * Session configuration (optional)
   * Contains webhooks, settings, and other session-specific configuration
   */
  config?: Record<string, unknown>;

  /**
   * Information about the authenticated WhatsApp account (optional)
   * Available when session is authenticated
   */
  me?: Record<string, unknown>;
}

/**
 * Chat information
 * 
 * Represents a WhatsApp chat (conversation), either individual or group.
 * 
 * @example
 * ```typescript
 * const chat: ChatInfo = {
 *   id: '1234567890@c.us',
 *   name: 'John Doe',
 *   isGroup: false,
 * };
 * 
 * const group: ChatInfo = {
 *   id: 'group-id@g.us',
 *   name: 'My Group',
 *   isGroup: true,
 *   participants: [...],
 * };
 * ```
 */
export interface ChatInfo {
  /**
   * Chat ID
   * Format: phone@c.us for individual chats, groupId@g.us for groups
   */
  id: string;

  /**
   * Display name of the chat (optional)
   * Contact name for individuals, group subject for groups
   */
  name?: string;

  /**
   * Whether this is a group chat (optional)
   * true for groups, false or undefined for individual chats
   */
  isGroup?: boolean;

  /**
   * Group participants (optional)
   * Array of participant information, only present for group chats
   */
  participants?: Array<Record<string, unknown>>;
}

/**
 * Message information
 * 
 * Represents a WhatsApp message with its metadata.
 * 
 * @example
 * ```typescript
 * const message: MessageInfo = {
 *   id: 'message-id',
 *   from: '1234567890@c.us',
 *   body: 'Hello, World!',
 *   timestamp: 1234567890,
 *   type: 'chat',
 * };
 * ```
 */
export interface MessageInfo {
  /**
   * Unique message ID
   */
  id: string;

  /**
   * Sender's chat ID (optional)
   * Format: phone@c.us
   */
  from?: string;

  /**
   * Message text content (optional)
   * Present for text messages, may be undefined for media messages
   */
  body?: string;

  /**
   * Message timestamp (optional)
   * Unix timestamp in seconds
   */
  timestamp?: number;

  /**
   * Message type (optional)
   * Examples: 'chat', 'image', 'video', 'audio', 'document', 'ptt' (voice), etc.
   */
  type?: string;
}

/**
 * API Response wrapper
 * 
 * Generic wrapper for API responses from WAHA.
 * 
 * @template T - Type of the data payload
 * 
 * @example
 * ```typescript
 * const response: APIResponse<MessageInfo> = {
 *   success: true,
 *   data: {
 *     id: 'message-id',
 *     from: '1234567890@c.us',
 *     body: 'Hello!',
 *   },
 * };
 * 
 * const errorResponse: APIResponse = {
 *   success: false,
 *   error: 'Session not found',
 *   message: 'The specified session does not exist',
 * };
 * ```
 */
export interface APIResponse<T = any> {
  /**
   * Whether the request was successful (optional)
   */
  success?: boolean;

  /**
   * Response data payload (optional)
   * Contains the actual response data when successful
   */
  data?: T;

  /**
   * Error code or type (optional)
   * Present when the request failed
   */
  error?: string;

  /**
   * Human-readable message (optional)
   * Additional information about success or failure
   */
  message?: string;
}
