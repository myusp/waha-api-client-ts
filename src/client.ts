import {
  WAHAConfig,
  RequestConfig,
  SendTextParams,
  SendImageParams,
  SendFileParams,
  APIResponse,
} from './types';

import {
  SessionInfoSchema as SessionInfo,
  ChatSummarySchema as ChatSummary,
  ChatPictureResponseSchema as ChatPictureResponse,
  MeInfoSchema as MeInfo,
  WAMessageSchema as WAMessage,
  SessionDTOSchema as SessionDTO,
  WANumberExistResultSchema as WANumberExistResult,
  Base64FileSchema as Base64File,
  QRCodeValueSchema as QRCodeValue,
  MyProfileSchema as MyProfileSchema,
  MessageVoiceRequestSchema as MessageVoiceRequest,
  MessageVideoRequestSchema as MessageVideoRequest,
  MessageLocationRequestSchema as MessageLocationRequest,
  MessageContactVcardRequestSchema as MessageContactVcardRequest,
  MessageLinkCustomPreviewRequestSchema as MessageLinkCustomPreviewRequest,
  MessageLinkPreviewRequestSchema as MessageLinkPreviewRequest,
  ChannelSchema as Channel,
  LabelSchema as Label,
  SendButtonsRequestSchema as SendButtonsRequest,
  SendListRequestSchema as SendListRequest,
  MessagePollRequestSchema as MessagePollRequest,
  MessagePollVoteRequestSchema as MessagePollVoteRequest,
  MessageFileRequestSchema as MessageFileRequest,
  MessageImageRequestSchema as MessageImageRequest,
  MessageForwardRequestSchema as MessageForwardRequest,
  MessageReplyRequestSchema as MessageReplyRequest,
  MessageStarRequestSchema as MessageStarRequest,
  RequestCodeRequestSchema as RequestCodeRequest,
  SessionCreateRequestSchema as SessionCreateRequest,
  SessionUpdateRequestSchema as SessionUpdateRequest,
  MessageButtonReplySchema as MessageButtonReply,
  ResultSchema as ResultSchema,
} from './schema-types';

// Type aliases for convenience
type ChatInfo = ChatSummary;
type MessageInfo = WAMessage;

/**
 * WAHA API Client
 * Provides methods to interact with the WAHA WhatsApp API
 */
export class WAHAClient {
  private config: {
    baseURL: string;
    apiKey?: string;
    session: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };

  /**
   * Create a new WAHA API client
   * @param config - Configuration options
   */
  constructor(config: WAHAConfig) {
    // Set defaults
    this.config = {
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      session: config.session || 'default',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  /**
   * Merge default config with request-specific overrides
   */
  private mergeConfig(override?: RequestConfig): { session: string; timeout: number; retryAttempts: number; retryDelay: number } {
    return {
      session: override?.session || this.config.session,
      timeout: override?.timeout || this.config.timeout,
      retryAttempts: override?.retryAttempts || this.config.retryAttempts,
      retryDelay: override?.retryDelay || this.config.retryDelay,
    };
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    config: { retryAttempts: number; retryDelay: number }
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= config.retryAttempts; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on last attempt
        if (attempt < config.retryAttempts) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Make HTTP request with retry logic using native fetch API
   */
  private async request<T>(
    method: string,
    path: string,
    data?: any,
    requestConfig?: RequestConfig,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    const mergedConfig = this.mergeConfig(requestConfig);
    
    // Build URL with query parameters
    let url = `${this.config.baseURL}${path}`;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        params.append(key, String(value));
      }
      url += `?${params.toString()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);

    return this.executeWithRetry(
      async () => {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          
          if (this.config.apiKey) {
            headers['X-Api-Key'] = this.config.apiKey;
          }

          const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            signal: controller.signal,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          // Check if response has content
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          }
          
          // For non-JSON responses (like images), return the response itself
          return response as any;
        } finally {
          clearTimeout(timeoutId);
        }
      },
      {
        retryAttempts: mergedConfig.retryAttempts,
        retryDelay: mergedConfig.retryDelay,
      }
    );
  }

  /**
   * Send a text message
   * 
   * Sends a plain text message to a chat. For better anti-spam protection, consider using `safeSendText()` instead.
   * 
   * @param params - Message parameters including chatId, text, and optional reply_to
   * @param params.chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param params.text - Text content of the message
   * @param params.reply_to - Optional message ID to reply to
   * @param params.config - Optional request configuration to override defaults
   * @returns API response with message information
   * 
   * @example
   * ```typescript
   * // Send a simple text message
   * const response = await client.sendText({
   *   chatId: '1234567890@c.us',
   *   text: 'Hello, World!',
   * });
   * 
   * // Send a reply to a specific message
   * const reply = await client.sendText({
   *   chatId: '1234567890@c.us',
   *   text: 'Thanks for your message!',
   *   reply_to: 'message-id-here',
   * });
   * ```
   */
  async sendText(params: SendTextParams): Promise<WAMessage> {
    const { chatId, text, reply_to, config } = params;
    const mergedConfig = this.mergeConfig(config);

    // Use canonical OpenAPI endpoint: POST /api/sendText
    // MessageTextRequest requires chatId, text and session in the body.
    return this.request<WAMessage>(
      'POST',
      '/api/sendText',
      {
        chatId,
        text,
        session: mergedConfig.session,
        ...(reply_to && { reply_to }),
      },
      config
    );
  }

  /**
   * Send an image message
   * 
   * Sends an image to a chat. The image can be provided as a URL or base64-encoded data.
   * For better anti-spam protection, consider using `safeSendImage()` instead.
   * 
   * @param params - Message parameters including chatId, file, and optional caption
   * @param params.chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param params.file - Image file as URL or base64 data
   * @param params.caption - Optional caption for the image
   * @param params.reply_to - Optional message ID to reply to
   * @param params.config - Optional request configuration to override defaults
   * @returns API response with message information
   * 
   * @example
   * ```typescript
   * // Send image from URL
   * const response = await client.sendImage({
   *   chatId: '1234567890@c.us',
   *   file: 'https://example.com/image.jpg',
   *   caption: 'Check out this image!',
   * });
   * 
   * // Send image from base64
   * const base64Response = await client.sendImage({
   *   chatId: '1234567890@c.us',
   *   file: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
   *   caption: 'Image from base64',
   * });
   * ```
   */
  async sendImage(params: SendImageParams): Promise<WAMessage> {
    const { chatId, file, caption, reply_to, config } = params;
    const mergedConfig = this.mergeConfig(config);

    // Use canonical OpenAPI endpoint: POST /api/sendImage
    // MessageImageRequest requires chatId, file and session in the body.
    return this.request<WAMessage>(
      'POST',
      '/api/sendImage',
      {
        chatId,
        file,
        session: mergedConfig.session,
        ...(caption && { caption }),
        ...(reply_to && { reply_to }),
      },
      config
    );
  }

  /**
   * Send a file message
   * 
   * Sends a file/document to a chat. The file can be provided as a URL or base64-encoded data.
   * For better anti-spam protection, consider using `safeSendFile()` instead.
   * 
   * @param params - Message parameters including chatId, file, and optional filename/caption
   * @param params.chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param params.file - File as URL or base64 data
   * @param params.filename - Optional filename for the file
   * @param params.caption - Optional caption for the file
   * @param params.reply_to - Optional message ID to reply to
   * @param params.config - Optional request configuration to override defaults
   * @returns API response with message information
   * 
   * @example
   * ```typescript
   * // Send PDF file from URL
   * const response = await client.sendFile({
   *   chatId: '1234567890@c.us',
   *   file: 'https://example.com/document.pdf',
   *   filename: 'report.pdf',
   *   caption: 'Monthly report',
   * });
   * 
   * // Send file from base64
   * const base64Response = await client.sendFile({
   *   chatId: '1234567890@c.us',
   *   file: 'data:application/pdf;base64,JVBERi0xLjcKC...',
   *   filename: 'document.pdf',
   * });
   * ```
   */
  async sendFile(params: SendFileParams): Promise<WAMessage> {
    const { chatId, file, filename, caption, reply_to, config } = params;
    const mergedConfig = this.mergeConfig(config);

    // Use canonical OpenAPI endpoint: POST /api/sendFile
    // MessageFileRequest requires chatId, file and session in the body.
    return this.request<WAMessage>(
      'POST',
      '/api/sendFile',
      {
        chatId,
        file,
        session: mergedConfig.session,
        ...(filename && { filename }),
        ...(caption && { caption }),
        ...(reply_to && { reply_to }),
      },
      config
    );
  }

  /**
   * Get session information
   * 
   * Retrieves detailed information about a specific session including its status, configuration, and WhatsApp account details.
   * 
   * @param config - Optional request configuration to override defaults (including session name)
   * @returns Session information including name, status, config, and me object
   * 
   * @example
   * ```typescript
   * // Get info for default session
   * const session = await client.getSession();
   * console.log('Session status:', session.status);
   * console.log('My number:', session.me);
   * 
   * // Get info for a specific session
   * const customSession = await client.getSession({
   *   session: 'my-custom-session',
   * });
   * ```
   */
  async getSession(config?: RequestConfig): Promise<SessionInfo> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<SessionInfo>(
      'GET',
      `/api/sessions/${mergedConfig.session}`,
      undefined,
      config
    );
  }

  /**
   * Start a session
   * 
   * Starts a WhatsApp session. The session will begin the authentication process (QR code or pairing code).
   * 
   * @param config - Optional request configuration to override defaults (including session name)
   * @returns Session information with updated status
   * 
   * @example
   * ```typescript
   * // Start default session
   * const session = await client.startSession();
   * 
   * // Start a specific session
   * const customSession = await client.startSession({
   *   session: 'my-custom-session',
   * });
   * 
   * // After starting, get QR code to authenticate
   * const qr = await client.getQR();
   * ```
   */
  async startSession(config?: RequestConfig): Promise<SessionDTO> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<SessionDTO>(
      'POST',
      `/api/sessions/start`,
      {
        name: mergedConfig.session,
      },
      config
    );
  }

  /**
   * Stop a session
   * 
   * Stops a running WhatsApp session. This will disconnect the session but preserve its data for future use.
   * 
   * @param config - Optional request configuration to override defaults (including session name)
   * @returns API response confirming the session was stopped
   * 
   * @example
   * ```typescript
   * // Stop default session
   * await client.stopSession();
   * 
   * // Stop a specific session
   * await client.stopSession({
   *   session: 'my-custom-session',
   * });
   * ```
   */
  async stopSession(config?: RequestConfig): Promise<SessionDTO> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<SessionDTO>(
      'POST',
      `/api/sessions/stop`,
      {
        name: mergedConfig.session,
      },
      config
    );
  }

  /**
   * Get all sessions
   * 
   * Lists all WhatsApp sessions configured on the WAHA server, including their current status.
   * 
   * @param config - Optional request configuration to override defaults
   * @returns Array of session information objects
   * 
   * @example
   * ```typescript
   * // Get all sessions
   * const sessions = await client.getSessions();
   * 
   * sessions.forEach(session => {
   *   console.log(`Session: ${session.name}, Status: ${session.status}`);
   * });
   * 
   * // Filter for active sessions
   * const activeSessions = sessions.filter(s => s.status === 'WORKING');
   * ```
   */
  async getSessions(config?: RequestConfig): Promise<SessionDTO[]> {
    return this.request<SessionDTO[]>(
      'GET',
      `/api/sessions`,
      undefined,
      config
    );
  }

  /**
   * Get chats
   * 
   * Retrieves all chats (conversations) for the session, including individual chats and groups.
   * 
   * @param config - Optional request configuration to override defaults
   * @returns Array of chat information objects
   * 
   * @example
   * ```typescript
   * // Get all chats
   * const chats = await client.getChats();
   * 
   * // Filter for group chats
   * const groups = chats.filter(chat => chat.isGroup);
   * 
   * // Filter for individual chats
   * const individuals = chats.filter(chat => !chat.isGroup);
   * ```
   */
  async getChats(config?: RequestConfig): Promise<ChatInfo[]> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<ChatInfo[]>(
      'GET',
      `/api/${mergedConfig.session}/chats`,
      undefined,
      config
    );
  }

  /**
   * Get messages from a chat
   * 
   * Retrieves message history from a specific chat conversation.
   * 
   * @param chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param config - Optional request configuration to override defaults
   * @returns Array of message information objects
   * 
   * @example
   * ```typescript
   * // Get messages from a chat
   * const messages = await client.getMessages('1234567890@c.us');
   * 
   * console.log(`Found ${messages.length} messages`);
   * messages.forEach(msg => {
   *   console.log(`${msg.from}: ${msg.body}`);
   * });
   * 
   * // Get messages from a group
   * const groupMessages = await client.getMessages('groupId@g.us');
   * ```
   */
  async getMessages(chatId: string, config?: RequestConfig): Promise<WAMessage[]> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<WAMessage[]>(
      'GET',
      `/api/${mergedConfig.session}/chats/${chatId}/messages`,
      undefined,
      config
    );
  }

  /**
   * Check if a number is registered on WhatsApp
   * 
   * Verifies whether a phone number is registered on WhatsApp. This is essential for avoiding
   * spam flags when sending messages to new contacts. Use this before sending messages to
   * unknown numbers, or use the safe send methods which call this automatically.
   * 
   * @param phone - Phone number to check (with or without country code)
   * @param config - Optional request configuration to override defaults
   * @returns Object with exists or numberExists boolean indicating if the number is on WhatsApp
   * 
   * @example
   * ```typescript
   * // Check if a number exists on WhatsApp
   * const status = await client.checkNumberStatus('1234567890');
   * 
   * if (status.exists || status.numberExists) {
   *   console.log('Number is registered on WhatsApp');
   *   await client.sendText({
   *     chatId: '1234567890@c.us',
   *     text: 'Hello!',
   *   });
   * } else {
   *   console.log('Number is NOT on WhatsApp');
   * }
   * 
   * // Or use safe send methods which check automatically
   * const result = await client.safeSendText({
   *   chatId: '1234567890@c.us',
   *   text: 'Hello!',
   * });
   * 
   * if (result === null) {
   *   console.log('Number not found - message not sent');
   * }
   * ```
   */
  async checkNumberStatus(
    phone: string,
    config?: RequestConfig
  ): Promise<WANumberExistResult> {
    const mergedConfig = this.mergeConfig(config);

    // Newer endpoint is /contacts/check-exists; keep calling the older endpoint if present
    // Use canonical endpoint: /api/contacts/check-exists (GET) per OpenAPI
    return this.request<WANumberExistResult>(
      'GET',
      '/api/contacts/check-exists',
      undefined,
      config,
      { phone, session: mergedConfig.session }
    );
  }

  /**
   * Helper method to extract phone number from chatId
   * @param chatId - Chat ID (e.g., "1234567890@c.us" or "1234567890@g.us")
   * @returns Phone number without suffix
   */
  private extractPhoneFromChatId(chatId: string): string {
    // Extract phone number before @ symbol
    return chatId.split('@')[0];
  }

  // ==================== 🛡️ Safe Send Methods (Auto-check number status) ====================

  /**
   * Helper to calculate typing delay based on message length
   * Returns a delay in milliseconds that simulates human typing speed
   * @param textLength - Length of the text message
   * @returns Random delay between 1-3 seconds for short messages, up to 5 seconds for longer ones
   */
  private calculateTypingDelay(textLength: number): number {
    // Base delay: 1-3 seconds
    const baseDelay = 1000 + Math.random() * 2000;
    // Add extra time for longer messages (roughly 50-100ms per character, capped)
    const extraDelay = Math.min(textLength * (50 + Math.random() * 50), 2000);
    return Math.floor(baseDelay + extraDelay);
  }

  /**
   * Helper to add random delay to simulate human behavior
   * @param minMs - Minimum delay in milliseconds
   * @param maxMs - Maximum delay in milliseconds
   * @returns Promise that resolves after the delay
   */
  private async randomDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = minMs + Math.random() * (maxMs - minMs);
    await new Promise(resolve => setTimeout(resolve, Math.floor(delay)));
  }

  /**
   * Safely send a text message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines:
   * 1. Checks if the number exists on WhatsApp before sending
   * 2. Sends "seen" indicator to appear more human-like
   * 3. Shows typing indicator with realistic delay based on message length
   * 4. Sends the actual message
   * 
   * Following these steps helps avoid being flagged as spam by WhatsApp.
   * 
   * @param params - Message parameters including chatId and text
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendText({
   *   chatId: '1234567890@c.us',
   *   text: 'Hello! How are you?',
   * });
   * 
   * if (result === null) {
   *   console.log('Number does not exist on WhatsApp');
   * } else {
   *   console.log('Message sent:', result);
   * }
   * ```
   */
  async safeSendText(params: SendTextParams): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(params.chatId);
    const statusResult = await this.checkNumberStatus(phone, params.config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    // Step 1: Send "seen" to appear more natural
    try {
      await this.sendSeen({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in sendSeen, it's optional for the main flow
    }
    
    // Small delay after seen
    await this.randomDelay(500, 1000);
    
    // Step 2: Start typing
    try {
      await this.startTyping({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in startTyping
    }
    
    // Step 3: Wait based on message length (simulate human typing)
    const typingDelay = this.calculateTypingDelay(params.text.length);
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    // Step 4: Stop typing
    try {
      await this.stopTyping({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in stopTyping
    }
    
    // Small delay before sending
    await this.randomDelay(200, 500);
    
    // Step 5: Send the actual message
    return this.sendText(params);
  }

  /**
   * Safely send an image message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines:
   * 1. Checks if the number exists on WhatsApp before sending
   * 2. Sends "seen" indicator to appear more human-like
   * 3. Shows typing indicator with realistic delay
   * 4. Sends the actual image
   * 
   * @param params - Message parameters including chatId, file, and optional caption
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendImage({
   *   chatId: '1234567890@c.us',
   *   file: 'https://example.com/image.jpg',
   *   caption: 'Check this out!',
   * });
   * 
   * if (result === null) {
   *   console.log('Number does not exist on WhatsApp');
   * } else {
   *   console.log('Image sent:', result);
   * }
   * ```
   */
  async safeSendImage(params: SendImageParams): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(params.chatId);
    const statusResult = await this.checkNumberStatus(phone, params.config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    // Step 1: Send "seen" to appear more natural
    try {
      await this.sendSeen({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in sendSeen
    }
    
    await this.randomDelay(500, 1000);
    
    // Step 2: Start typing
    try {
      await this.startTyping({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in startTyping
    }
    
    // Step 3: Wait to simulate human behavior (images take time to select/upload)
    await this.randomDelay(2000, 4000);
    
    // Step 4: Stop typing
    try {
      await this.stopTyping({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in stopTyping
    }
    
    await this.randomDelay(200, 500);
    
    // Step 5: Send the image
    return this.sendImage(params);
  }

  /**
   * Safely send a file message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines:
   * 1. Checks if the number exists on WhatsApp before sending
   * 2. Sends "seen" indicator to appear more human-like
   * 3. Shows typing indicator with realistic delay
   * 4. Sends the actual file
   * 
   * @param params - Message parameters including chatId, file, optional filename and caption
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendFile({
   *   chatId: '1234567890@c.us',
   *   file: 'https://example.com/document.pdf',
   *   filename: 'report.pdf',
   *   caption: 'Here is the report',
   * });
   * 
   * if (result === null) {
   *   console.log('Number does not exist on WhatsApp');
   * } else {
   *   console.log('File sent:', result);
   * }
   * ```
   */
  async safeSendFile(params: SendFileParams): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(params.chatId);
    const statusResult = await this.checkNumberStatus(phone, params.config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    // Step 1: Send "seen" to appear more natural
    try {
      await this.sendSeen({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in sendSeen
    }
    
    await this.randomDelay(500, 1000);
    
    // Step 2: Start typing
    try {
      await this.startTyping({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in startTyping
    }
    
    // Step 3: Wait to simulate human behavior (files take time to select/upload)
    await this.randomDelay(2000, 5000);
    
    // Step 4: Stop typing
    try {
      await this.stopTyping({ chatId: params.chatId }, params.config);
    } catch (error) {
      // Ignore errors in stopTyping
    }
    
    await this.randomDelay(200, 500);
    
    // Step 5: Send the file
    return this.sendFile(params);
  }

  /**
   * Safely send a voice message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines:
   * 1. Checks if the number exists on WhatsApp before sending
   * 2. Sends "seen" indicator to appear more human-like
   * 3. Shows typing indicator with realistic delay
   * 4. Sends the actual voice message
   * 
   * @param data - Message data including chatId and voice file
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendVoice({
   *   chatId: '1234567890@c.us',
   *   file: 'https://example.com/voice.ogg',
   * });
   * 
   * if (result === null) {
   *   console.log('Number does not exist on WhatsApp');
   * }
   * ```
   */
  async safeSendVoice(data: Omit<MessageVoiceRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(2000, 4000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendVoice(data, config);
  }

  /**
   * Safely send a video message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId and video file
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendVideo({
   *   chatId: '1234567890@c.us',
   *   file: 'https://example.com/video.mp4',
   *   caption: 'Check out this video',
   * });
   * ```
   */
  async safeSendVideo(data: Omit<MessageVideoRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(3000, 6000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendVideo(data, config);
  }

  /**
   * Safely send a location message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId, latitude, and longitude
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendLocation({
   *   chatId: '1234567890@c.us',
   *   latitude: 37.7749,
   *   longitude: -122.4194,
   *   title: 'San Francisco',
   * });
   * ```
   */
  async safeSendLocation(data: Omit<MessageLocationRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(1500, 3000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendLocation(data, config);
  }

  /**
   * Safely send a contact vCard with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId and contact information
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendContactVcard({
   *   chatId: '1234567890@c.us',
   *   contactId: '0987654321@c.us',
   *   name: 'John Doe',
   * });
   * ```
   */
  async safeSendContactVcard(data: Omit<MessageContactVcardRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(1500, 3000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendContactVcard(data, config);
  }

  /**
   * Safely send a link preview with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId and URL
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendLinkPreview({
   *   chatId: '1234567890@c.us',
   *   url: 'https://example.com',
   *   title: 'Example Website',
   * });
   * ```
   */
  async safeSendLinkPreview(data: Omit<MessageLinkPreviewRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(1500, 3000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    const mergedConfig = this.mergeConfig(config);
    return this.sendLinkPreview({ ...data, session: mergedConfig.session }, config);
  }

  /**
   * Safely send buttons with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId, text, and buttons
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendButtons({
   *   chatId: '1234567890@c.us',
   *   text: 'Choose an option',
   *   buttons: [
   *     { id: '1', text: 'Option 1' },
   *     { id: '2', text: 'Option 2' },
   *   ],
   * });
   * ```
   */
  async safeSendButtons(data: Omit<SendButtonsRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(1500, 3000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendButtons(data, config);
  }

  /**
   * Safely send a list message with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId, title, and list sections
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendList({
   *   chatId: '1234567890@c.us',
   *   title: 'Menu',
   *   sections: [
   *     {
   *       title: 'Main Dishes',
   *       rows: [
   *         { id: '1', title: 'Pizza', description: 'Delicious pizza' },
   *       ],
   *     },
   *   ],
   * });
   * ```
   */
  async safeSendList(data: Omit<SendListRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(2000, 4000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendList(data, config);
  }

  /**
   * Safely send a poll with anti-blocking measures
   * 
   * This method implements WhatsApp's recommended anti-blocking guidelines by checking
   * if the number exists and using typing indicators before sending.
   * 
   * @param data - Message data including chatId, poll name, and options
   * @param config - Optional request configuration
   * @returns API response with message info, or null if number doesn't exist on WhatsApp
   * 
   * @example
   * ```typescript
   * const result = await client.safeSendPoll({
   *   chatId: '1234567890@c.us',
   *   name: 'What's your favorite color?',
   *   options: ['Red', 'Blue', 'Green'],
   * });
   * ```
   */
  async safeSendPoll(data: Omit<MessagePollRequest, 'session'>, config?: RequestConfig): Promise<WAMessage | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.numberExists) {
      return null;
    }
    
    try {
      await this.sendSeen({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(500, 1000);
    
    try {
      await this.startTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(2000, 4000);
    
    try {
      await this.stopTyping({ chatId: data.chatId }, config);
    } catch (error) {
      // Ignore errors
    }
    
    await this.randomDelay(200, 500);
    
    return this.sendPoll(data, config);
  }

  // ==================== 🔑 Auth Methods ====================

  /**
   * Get QR code for pairing WhatsApp API
   * 
   * Retrieves the QR code that can be scanned with WhatsApp mobile app to authenticate the session.
   * 
   * @param format - Format of the QR code: 'image' returns a PNG image, 'raw' returns the raw QR code data
   * @param config - Optional request configuration to override defaults
   * @returns QR code in the specified format
   * 
   * @example
   * ```typescript
   * // Get QR code as image
   * const qrImage = await client.getQR('image');
   * 
   * // Get raw QR code data
   * const qrData = await client.getQR('raw');
   * ```
   */
  async getQR(format: 'image' | 'raw' = 'image', config?: RequestConfig): Promise<Uint8Array | Base64File | QRCodeValue> {
    const mergedConfig = this.mergeConfig(config);

    // If the caller wants an image, fetch the binary and return as Buffer
    if (format === 'image') {
      const url = `${this.config.baseURL}/api/${mergedConfig.session}/auth/qr?format=image`;
      const headers: Record<string, string> = {};
      if (this.config.apiKey) headers['X-Api-Key'] = this.config.apiKey;

      const res = await fetch(url, { method: 'GET', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching QR image`);

      const arrayBuf = await res.arrayBuffer();
      return new Uint8Array(arrayBuf);
    }

    // For raw format, return the JSON which is oneOf Base64File | QRCodeValue
    return this.request<Base64File | QRCodeValue>(
      'GET',
      `/api/${mergedConfig.session}/auth/qr`,
      undefined,
      config,
      { format: 'raw' }
    );
  }

  /**
   * Request authentication code
   * 
   * Requests an authentication code to be sent via SMS or voice call for phone number-based authentication.
   * 
   * @param data - Object containing phoneNumber and optional method ('sms' or 'voice')
   * @param config - Optional request configuration to override defaults
   * @returns Response indicating the code was sent
   * 
   * @example
   * ```typescript
   * // Request code via SMS
   * await client.requestCode({
   *   phoneNumber: '+1234567890',
   *   method: 'sms',
   * });
   * 
   * // Request code via voice call
   * await client.requestCode({
   *   phoneNumber: '+1234567890',
   *   method: 'voice',
   * });
   * ```
   */
  async requestCode(data: RequestCodeRequest, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>(
      'POST',
      `/api/${mergedConfig.session}/auth/request-code`,
      data,
      config
    );
  }

  // ==================== 🖥️ Sessions Management ====================

  /**
   * Create a new session
   * 
   * Creates a new WhatsApp session with the specified configuration. The session can be started
   * immediately or configured for later use.
   * 
   * @param data - Session configuration data including name and optional settings
   * @param config - Optional request configuration to override defaults
   * @returns Created session information
   * 
   * @example
   * ```typescript
   * // Create a new session
   * const session = await client.createSession({
   *   name: 'my-new-session',
   *   config: {
   *     // Session-specific configuration
   *   },
   * });
   * 
   * console.log('Session created:', session.name);
   * ```
   */
  async createSession(data: Omit<SessionCreateRequest, 'session'>, config?: RequestConfig): Promise<SessionInfo> {
    return this.request<SessionInfo>('POST', '/api/sessions', data, config);
  }

  /**
   * Update session configuration
   * 
   * Updates the configuration of an existing session. The session must be stopped before updating.
   * 
   * @param data - Updated session configuration data
   * @param config - Optional request configuration to override defaults (including session name)
   * @returns Updated session information
   * 
   * @example
   * ```typescript
   * // Update session configuration
   * const updated = await client.updateSession({
   *   webhooks: [
   *     {
   *       url: 'https://example.com/webhook',
   *       events: ['message'],
   *     },
   *   ],
   * });
   * ```
   */
  async updateSession(data: Omit<SessionUpdateRequest, 'session'>, config?: RequestConfig): Promise<SessionInfo> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<SessionInfo>(
      'PUT',
      `/api/sessions/${mergedConfig.session}`,
      data,
      config
    );
  }

  /**
   * Delete a session
   * 
   * Permanently deletes a session and all its data. This action cannot be undone.
   * 
   * @param config - Optional request configuration to override defaults (including session name)
   * @returns API response confirming deletion
   * 
   * @example
   * ```typescript
   * // Delete default session
   * await client.deleteSession();
   * 
   * // Delete a specific session
   * await client.deleteSession({
   *   session: 'session-to-delete',
   * });
   * ```
   */
  async deleteSession(config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>('DELETE', `/api/sessions/${mergedConfig.session}`, undefined, config);
  }

  /**
   * Get session "me" info
   * 
   * Retrieves information about the authenticated WhatsApp account for this session,
   * including phone number, profile name, and other account details.
   * 
   * @param config - Optional request configuration to override defaults (including session name)
   * @returns Account information for the authenticated session
   * 
   * @example
   * ```typescript
   * // Get my account info
   * const me = await client.getSessionMe();
   * console.log('My number:', me.id);
   * console.log('My name:', me.pushname);
   * ```
   */
  async getSessionMe(config?: RequestConfig): Promise<MeInfo> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<MeInfo>('GET', `/api/sessions/${mergedConfig.session}/me`, undefined, config);
  }

  /**
   * Start a session (alternative endpoint)
   */
  async startSessionAlt(config?: RequestConfig): Promise<SessionInfo> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<SessionInfo>(
      'POST',
      `/api/sessions/${mergedConfig.session}/start`,
      undefined,
      config
    );
  }

  /**
   * Stop a session (alternative endpoint)
   */
  async stopSessionAlt(config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>(
      'POST',
      `/api/sessions/${mergedConfig.session}/stop`,
      undefined,
      config
    );
  }

  /**
   * Logout from a session
   */
  async logoutSession(config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>(
      'POST',
      `/api/sessions/${mergedConfig.session}/logout`,
      undefined,
      config
    );
  }

  /**
   * Logout from a session (bulk operation)
   */
  async logoutSessionBulk(data: { name: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    return this.request<APIResponse<ResultSchema>>('POST', '/api/sessions/logout', data, config);
  }

  /**
   * Restart a session
   */
  async restartSession(config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>(
      'POST',
      `/api/sessions/${mergedConfig.session}/restart`,
      undefined,
      config
    );
  }

  // ==================== 🆔 Profile Management ====================

  /**
   * Get my profile
   */
  async getProfile(config?: RequestConfig): Promise<APIResponse<MyProfileSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<MyProfileSchema>>('GET', `/api/${mergedConfig.session}/profile`, undefined, config);
  }

  /**
   * Set profile name
   */
  async setProfileName(data: { name: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>('PUT', `/api/${mergedConfig.session}/profile/name`, data, config);
  }

  /**
   * Set profile status (About)
   */
  async setProfileStatus(data: { status: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>('PUT', `/api/${mergedConfig.session}/profile/status`, data, config);
  }

  /**
   * Set profile picture
   */
  async setProfilePicture(data: { file: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>('PUT', `/api/${mergedConfig.session}/profile/picture`, data, config);
  }

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<APIResponse<ResultSchema>>('DELETE', `/api/${mergedConfig.session}/profile/picture`, undefined, config);
  }

  // ==================== 📤 Chatting - Extended Methods ====================

  /**
   * Send text message (alternative endpoint)
   */
  /**
   * Send text message (alternative endpoint)
   * @deprecated Prefer `sendText({ chatId, text })` which calls the canonical POST /api/sendText
   */
  async sendTextAlt(data: { chatId: string; text: string; session?: string }, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendText', data, config);
  }

  /**
   * Send text message via GET (alternative endpoint)
   */
  /**
   * Send text message via GET (alternative endpoint)
   * @deprecated GET /api/sendText is deprecated by the API; prefer `sendText` (POST /api/sendText)
   */
  async sendTextGet(chatId: string, text: string, config?: RequestConfig): Promise<WAMessage> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<WAMessage>(
      'GET',
      '/api/sendText',
      undefined,
      config,
      { chatId, text, session: mergedConfig.session }
    );
  }

  /**
   * Send image (alternative endpoint)
   */
  async sendImageAlt(data: Omit<MessageImageRequest, 'session'> | MessageImageRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendImage', data, config);
  }

  /**
   * Send file (alternative endpoint)
   */
  async sendFileAlt(data: Omit<MessageFileRequest, 'session'> | MessageFileRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendFile', data, config);
  }

  /**
   * Send voice message
   */
  async sendVoice(data: Omit<MessageVoiceRequest, 'session'> | MessageVoiceRequest, config?: RequestConfig): Promise<WAMessage> {
    // Ensure session is included if caller didn't provide it in body
    const mergedConfig = this.mergeConfig(config);
    return this.request<WAMessage>('POST', '/api/sendVoice', { session: mergedConfig.session, ...data }, config);
  }

  /**
   * Send video message
   */
  async sendVideo(data: Omit<MessageVideoRequest, 'session'> | MessageVideoRequest, config?: RequestConfig): Promise<WAMessage> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<WAMessage>('POST', '/api/sendVideo', { session: mergedConfig.session, ...data }, config);
  }

  /**
   * Send link with custom preview
   */
  async sendLinkCustomPreview(data: Omit<MessageLinkCustomPreviewRequest, 'session'> | MessageLinkCustomPreviewRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/send/link-custom-preview', data, config);
  }

  /**
   * Send buttons
   */
  async sendButtons(data: Omit<SendButtonsRequest, 'session'> | SendButtonsRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendButtons', data, config);
  }

  /**
   * Send list message
   */
  async sendList(data: Omit<SendListRequest, 'session'> | SendListRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendList', data, config);
  }

  /**
   * Forward message
   */
  async forwardMessage(data: Omit<MessageForwardRequest, 'session'> | MessageForwardRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/forwardMessage', data, config);
  }

  /**
   * Mark message as seen
   * 
   * Sends a "seen" receipt for a message or chat. This helps your bot appear more human-like
   * and is recommended by WhatsApp's anti-blocking guidelines. The safe send methods call this automatically.
   * 
   * @param data - Object containing chatId and optional messageId
   * @param data.chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param data.messageId - Optional specific message ID to mark as seen
   * @param config - Optional request configuration to override defaults
   * @returns API response
   * 
   * @example
   * ```typescript
   * // Mark all messages in a chat as seen
   * await client.sendSeen({
   *   chatId: '1234567890@c.us',
   * });
   * 
   * // Mark a specific message as seen
   * await client.sendSeen({
   *   chatId: '1234567890@c.us',
   *   messageId: 'message-id-here',
   * });
   * ```
   */
  async sendSeen(data: { chatId: string; messageId?: string }, config?: RequestConfig): Promise<APIResponse<any>> {
    return this.request<APIResponse<any>>('POST', '/api/sendSeen', data, config);
  }

  /**
   * Start typing indicator
   * 
   * Shows the "typing..." indicator in a chat. This helps your bot appear more human-like
   * and is recommended by WhatsApp's anti-blocking guidelines. Remember to call stopTyping()
   * after a realistic delay. The safe send methods handle this automatically.
   * 
   * @param data - Object containing chatId
   * @param data.chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param config - Optional request configuration to override defaults
   * @returns API response
   * 
   * @example
   * ```typescript
   * // Show typing indicator
   * await client.startTyping({ chatId: '1234567890@c.us' });
   * 
   * // Wait for realistic typing time
   * await new Promise(resolve => setTimeout(resolve, 2000));
   * 
   * // Stop typing and send message
   * await client.stopTyping({ chatId: '1234567890@c.us' });
   * await client.sendText({
   *   chatId: '1234567890@c.us',
   *   text: 'Hello!',
   * });
   * ```
   */
  async startTyping(data: { chatId: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    return this.request<APIResponse<ResultSchema>>('POST', '/api/startTyping', data, config);
  }

  /**
   * Stop typing indicator
   * 
   * Stops the "typing..." indicator in a chat. Should be called after startTyping()
   * and before sending the actual message. The safe send methods handle this automatically.
   * 
   * @param data - Object containing chatId
   * @param data.chatId - Chat ID in format: phone@c.us (individual) or groupId@g.us (group)
   * @param config - Optional request configuration to override defaults
   * @returns API response
   * 
   * @example
   * ```typescript
   * // Start typing
   * await client.startTyping({ chatId: '1234567890@c.us' });
   * 
   * // Wait for realistic typing time
   * await new Promise(resolve => setTimeout(resolve, 2000));
   * 
   * // Stop typing
   * await client.stopTyping({ chatId: '1234567890@c.us' });
   * 
   * // Send the message
   * await client.sendText({
   *   chatId: '1234567890@c.us',
   *   text: 'Hello!',
   * });
   * ```
   */
  async stopTyping(data: { chatId: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    return this.request<APIResponse<ResultSchema>>('POST', '/api/stopTyping', data, config);
  }

  /**
   * React to a message
   */
  async reaction(data: { chatId: string; messageId: string; reaction: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    return this.request<APIResponse<ResultSchema>>('PUT', '/api/reaction', data, config);
  }

  /**
   * Star/unstar a message
   */
  async star(data: { chatId: string; messageId: string; star: boolean }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    return this.request<APIResponse<ResultSchema>>('PUT', '/api/star', data, config);
  }

  /**
   * Send poll
   */
  async sendPoll(data: Omit<MessagePollRequest, 'session'> | MessagePollRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendPoll', data, config);
  }

  /**
   * Vote in a poll
   */
  async sendPollVote(data: Omit<MessagePollVoteRequest, 'session'> | MessagePollVoteRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendPollVote', data, config);
  }

  /**
   * Send location
   */
  async sendLocation(data: Omit<MessageLocationRequest, 'session'> | MessageLocationRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendLocation', data, config);
  }

  /**
   * Send contact vCard
   */
  async sendContactVcard(data: Omit<MessageContactVcardRequest, 'session'> | MessageContactVcardRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendContactVcard', data, config);
  }

  /**
   * Reply to button
   */
  async replyButton(data: MessageButtonReply | { chatId: string; id: string }, config?: RequestConfig): Promise<APIResponse<ResultSchema>> {
    return this.request<APIResponse<ResultSchema>>('POST', '/api/send/buttons/reply', data, config);
  }

  /**
   * Get messages
   */
  /**
   * Get messages (deprecated)
   * @deprecated Use `getMessages(chatId)` which calls GET /api/{session}/chats/{chatId}/messages
   */
  async getMessagesAlt(chatId?: string, limit?: number, downloadMedia?: boolean, config?: RequestConfig): Promise<WAMessage[]> {
    const mergedConfig = this.mergeConfig(config);
    const params: Record<string, any> = { session: mergedConfig.session };
    if (chatId) params.chatId = chatId;
    if (limit !== undefined) params.limit = limit;
    if (downloadMedia !== undefined) params.downloadMedia = downloadMedia;
    
    return this.request<WAMessage[]>('GET', '/api/messages', undefined, config, params);
  }

  /**
   * Reply to a message
   */
  async reply(data: MessageReplyRequest | Omit<MessageReplyRequest, 'session'>, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/reply', data, config);
  }

  /**
   * Send link preview
   */
  async sendLinkPreview(data: MessageLinkPreviewRequest, config?: RequestConfig): Promise<WAMessage> {
    return this.request<WAMessage>('POST', '/api/sendLinkPreview', data, config);
  }

  // ==================== 💬 Chats Management ====================

  /**
   * Get chats overview
   */
  async getChatsOverview(config?: RequestConfig): Promise<ChatSummary[]> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<ChatSummary[]>('GET', `/api/${mergedConfig.session}/chats/overview`, undefined, config);
  }

  /**
   * Create chats overview
   */
  async createChatsOverview(data: ChatSummary | any, config?: RequestConfig): Promise<ChatSummary> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<ChatSummary>('POST', `/api/${mergedConfig.session}/chats/overview`, data, config);
  }

  /**
   * Delete chat
   */
  async deleteChat(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/chats/${chatId}`, undefined, config);
  }

  /**
   * Get chat picture
   */
  async getChatPicture(chatId: string, config?: RequestConfig): Promise<ChatPictureResponse | Uint8Array> {
    const mergedConfig = this.mergeConfig(config);
    // The endpoint may return JSON (with a URL) or raw binary. Keep the union type.
    return this.request<ChatPictureResponse | Uint8Array>('GET', `/api/${mergedConfig.session}/chats/${chatId}/picture`, undefined, config);
  }

  /**
   * Delete all messages from chat
   */
  async deleteAllMessages(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/chats/${chatId}/messages`, undefined, config);
  }

  /**
   * Mark chat messages as read
   */
  async readMessages(chatId: string, data?: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/chats/${chatId}/messages/read`, data, config);
  }

  /**
   * Get specific message
   */
  async getMessage(chatId: string, messageId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      `/api/${mergedConfig.session}/chats/${chatId}/messages/${messageId}`,
      undefined,
      config
    );
  }

  /**
   * Delete message
   */
  async deleteMessage(chatId: string, messageId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'DELETE',
      `/api/${mergedConfig.session}/chats/${chatId}/messages/${messageId}`,
      undefined,
      config
    );
  }

  /**
   * Edit message
   */
  async editMessage(chatId: string, messageId: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'PUT',
      `/api/${mergedConfig.session}/chats/${chatId}/messages/${messageId}`,
      data,
      config
    );
  }

  /**
   * Pin message
   */
  async pinMessage(chatId: string, messageId: string, data?: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'POST',
      `/api/${mergedConfig.session}/chats/${chatId}/messages/${messageId}/pin`,
      data,
      config
    );
  }

  /**
   * Unpin message
   */
  async unpinMessage(chatId: string, messageId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'POST',
      `/api/${mergedConfig.session}/chats/${chatId}/messages/${messageId}/unpin`,
      undefined,
      config
    );
  }

  /**
   * Archive chat
   */
  async archiveChat(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/chats/${chatId}/archive`, undefined, config);
  }

  /**
   * Unarchive chat
   */
  async unarchiveChat(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/chats/${chatId}/unarchive`, undefined, config);
  }

  /**
   * Mark chat as unread
   */
  async markChatUnread(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/chats/${chatId}/unread`, undefined, config);
  }

  // ==================== 📢 Channels Management ====================

  /**
   * Get all channels
   */
  async getChannels(config?: RequestConfig): Promise<Channel[]> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<Channel[]>('GET', `/api/${mergedConfig.session}/channels`, undefined, config);
  }

  /**
   * Create channel
   */
  async createChannel(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels`, data, config);
  }

  /**
   * Get channel by ID
   */
  async getChannel(id: string, config?: RequestConfig): Promise<Channel> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<Channel>('GET', `/api/${mergedConfig.session}/channels/${id}`, undefined, config);
  }

  /**
   * Delete channel
   */
  async deleteChannel(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/channels/${id}`, undefined, config);
  }

  /**
   * Get channel messages preview
   */
  async getChannelMessagesPreview(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/channels/${id}/messages/preview`, undefined, config);
  }

  /**
   * Follow channel
   */
  async followChannel(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels/${id}/follow`, undefined, config);
  }

  /**
   * Unfollow channel
   */
  async unfollowChannel(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels/${id}/unfollow`, undefined, config);
  }

  /**
   * Mute channel
   */
  async muteChannel(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels/${id}/mute`, undefined, config);
  }

  /**
   * Unmute channel
   */
  async unmuteChannel(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels/${id}/unmute`, undefined, config);
  }

  /**
   * Search channels by view
   */
  async searchChannelsByView(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels/search/by-view`, data, config);
  }

  /**
   * Search channels by text
   */
  async searchChannelsByText(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/channels/search/by-text`, data, config);
  }

  /**
   * Get channel search views
   */
  async getChannelSearchViews(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/channels/search/views`, undefined, config);
  }

  /**
   * Get channel search countries
   */
  async getChannelSearchCountries(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/channels/search/countries`, undefined, config);
  }

  /**
   * Get channel search categories
   */
  async getChannelSearchCategories(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/channels/search/categories`, undefined, config);
  }

  // ==================== 🟢 Status Management ====================

  /**
   * Post text status
   */
  async postTextStatus(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/status/text`, data, config);
  }

  /**
   * Post image status
   */
  async postImageStatus(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/status/image`, data, config);
  }

  /**
   * Post voice status
   */
  async postVoiceStatus(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/status/voice`, data, config);
  }

  /**
   * Post video status
   */
  async postVideoStatus(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/status/video`, data, config);
  }

  /**
   * Delete status
   */
  async deleteStatus(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/status/delete`, data, config);
  }

  /**
   * Get new message ID for status
   */
  async getNewMessageId(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/status/new-message-id`, undefined, config);
  }

  // ==================== 🏷️ Labels Management ====================

  /**
   * Get all labels
   */
  async getLabels(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/labels`, undefined, config);
  }

  /**
   * Create label
   */
  async createLabel(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/labels`, data, config);
  }

  /**
   * Update label
   */
  async updateLabel(labelId: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/labels/${labelId}`, data, config);
  }

  /**
   * Delete label
   */
  async deleteLabel(labelId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/labels/${labelId}`, undefined, config);
  }

  /**
   * Get chat labels
   */
  async getChatLabels(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/labels/chats/${chatId}`, undefined, config);
  }

  /**
   * Set chat labels
   */
  async setChatLabels(chatId: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/labels/chats/${chatId}`, data, config);
  }

  /**
   * Get chats by label
   */
  async getChatsByLabel(labelId: string, config?: RequestConfig): Promise<ChatSummary[]> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<ChatSummary[]>('GET', `/api/${mergedConfig.session}/labels/${labelId}/chats`, undefined, config);
  }

  // ==================== 👤 Contacts Management ====================

  /**
   * Get all contacts
   */
  async getAllContacts(params?: { sortBy?: string; sortOrder?: string; limit?: number; offset?: number }, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    const queryParams: Record<string, any> = { session: mergedConfig.session };
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.offset) queryParams.offset = params.offset;
    
    return this.request<any>('GET', '/api/contacts/all', undefined, config, queryParams);
  }

  /**
   * Get contact info
   */
  async getContact(contactId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      '/api/contacts',
      undefined,
      config,
      { contactId, session: mergedConfig.session }
    );
  }

  /**
   * Check if contact exists
   */
  async checkContactExists(phone: string, config?: RequestConfig): Promise<WANumberExistResult> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<WANumberExistResult>(
      'GET',
      '/api/contacts/check-exists',
      undefined,
      config,
      { phone, session: mergedConfig.session }
    );
  }

  /**
   * Get contact about info
   */
  async getContactAbout(contactId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      '/api/contacts/about',
      undefined,
      config,
      { contactId, session: mergedConfig.session }
    );
  }

  /**
   * Get contact profile picture
   */
  async getContactProfilePicture(contactId: string, refresh?: boolean, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    const params: Record<string, any> = { contactId, session: mergedConfig.session };
    if (refresh !== undefined) params.refresh = refresh;
    
    return this.request<any>('GET', '/api/contacts/profile-picture', undefined, config, params);
  }

  /**
   * Block contact
   */
  async blockContact(data: { chatId: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/contacts/block', data, config);
  }

  /**
   * Unblock contact
   */
  async unblockContact(data: { chatId: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/contacts/unblock', data, config);
  }

  /**
   * Update contact
   */
  async updateContact(chatId: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/contacts/${chatId}`, data, config);
  }

  /**
   * Get LIDs (LinkedIn IDs)
   */
  async getLids(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/lids`, undefined, config);
  }

  /**
   * Get LIDs count
   */
  async getLidsCount(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/lids/count`, undefined, config);
  }

  /**
   * Get LID by ID
   */
  async getLid(lid: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/lids/${lid}`, undefined, config);
  }

  /**
   * Get LID by phone number
   */
  async getLidByPhone(phoneNumber: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/lids/pn/${phoneNumber}`, undefined, config);
  }

  // ==================== 👥 Groups Management ====================

  /**
   * Create group
   * 
   * Creates a new WhatsApp group with the specified name and participants.
   * 
   * @param data - Group data including name and participants array
   * @param data.name - Name of the group
   * @param data.participants - Array of participant phone numbers in format: phone@c.us
   * @param config - Optional request configuration to override defaults
   * @returns Created group information
   * 
   * @example
   * ```typescript
   * // Create a new group
   * const group = await client.createGroup({
   *   name: 'My Group',
   *   participants: [
   *     '1234567890@c.us',
   *     '0987654321@c.us',
   *   ],
   * });
   * 
   * console.log('Group created:', group.id);
   * console.log('Group name:', group.subject);
   * ```
   */
  async createGroup(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups`, data, config);
  }

  /**
   * Get all groups
   * 
   * Retrieves all groups that the authenticated account is a member of.
   * 
   * @param config - Optional request configuration to override defaults
   * @returns Array of group information objects
   * 
   * @example
   * ```typescript
   * // Get all groups
   * const groups = await client.getGroups();
   * 
   * groups.forEach(group => {
   *   console.log(`Group: ${group.subject} (${group.id})`);
   *   console.log(`Participants: ${group.participants.length}`);
   * });
   * ```
   */
  async getGroups(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/groups`, undefined, config);
  }

  /**
   * Get group join info
   */
  async getGroupJoinInfo(inviteCode: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      `/api/${mergedConfig.session}/groups/join-info`,
      undefined,
      config,
      { inviteCode }
    );
  }

  /**
   * Join group
   */
  async joinGroup(data: { inviteCode: string }, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/join`, data, config);
  }

  /**
   * Get groups count
   */
  async getGroupsCount(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/groups/count`, undefined, config);
  }

  /**
   * Refresh groups
   */
  async refreshGroups(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/refresh`, undefined, config);
  }

  /**
   * Get group by ID
   */
  async getGroup(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/groups/${id}`, undefined, config);
  }

  /**
   * Delete group
   */
  async deleteGroup(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/groups/${id}`, undefined, config);
  }

  /**
   * Leave group
   */
  async leaveGroup(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/${id}/leave`, undefined, config);
  }

  /**
   * Get group picture
   */
  async getGroupPicture(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/groups/${id}/picture`, undefined, config);
  }

  /**
   * Set group picture
   */
  async setGroupPicture(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/groups/${id}/picture`, data, config);
  }

  /**
   * Delete group picture
   */
  async deleteGroupPicture(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/groups/${id}/picture`, undefined, config);
  }

  /**
   * Set group description
   */
  async setGroupDescription(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/groups/${id}/description`, data, config);
  }

  /**
   * Set group subject
   */
  async setGroupSubject(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/groups/${id}/subject`, data, config);
  }

  /**
   * Set group info admin only
   */
  async setGroupInfoAdminOnly(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'PUT',
      `/api/${mergedConfig.session}/groups/${id}/settings/security/info-admin-only`,
      data,
      config
    );
  }

  /**
   * Get group info admin only setting
   */
  async getGroupInfoAdminOnly(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      `/api/${mergedConfig.session}/groups/${id}/settings/security/info-admin-only`,
      undefined,
      config
    );
  }

  /**
   * Set group messages admin only
   */
  async setGroupMessagesAdminOnly(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'PUT',
      `/api/${mergedConfig.session}/groups/${id}/settings/security/messages-admin-only`,
      data,
      config
    );
  }

  /**
   * Get group messages admin only setting
   */
  async getGroupMessagesAdminOnly(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      `/api/${mergedConfig.session}/groups/${id}/settings/security/messages-admin-only`,
      undefined,
      config
    );
  }

  /**
   * Get group invite code
   */
  async getGroupInviteCode(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/groups/${id}/invite-code`, undefined, config);
  }

  /**
   * Revoke group invite code
   */
  async revokeGroupInviteCode(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/${id}/invite-code/revoke`, undefined, config);
  }

  /**
   * Get group participants
   */
  async getGroupParticipants(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/groups/${id}/participants`, undefined, config);
  }

  /**
   * Add participants to group
   */
  async addGroupParticipants(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/${id}/participants/add`, data, config);
  }

  /**
   * Remove participants from group
   */
  async removeGroupParticipants(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/${id}/participants/remove`, data, config);
  }

  /**
   * Promote participant to admin
   */
  async promoteGroupParticipant(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/${id}/admin/promote`, data, config);
  }

  /**
   * Demote participant from admin
   */
  async demoteGroupParticipant(id: string, data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups/${id}/admin/demote`, data, config);
  }

  // ==================== ✅ Presence Management ====================

  /**
   * Set presence
   */
  async setPresence(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/presence`, data, config);
  }

  /**
   * Get all presence information
   */
  async getAllPresence(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/presence`, undefined, config);
  }

  /**
   * Get presence for chat
   */
  async getPresence(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/presence/${chatId}`, undefined, config);
  }

  /**
   * Subscribe to presence
   */
  async subscribePresence(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/presence/${chatId}/subscribe`, undefined, config);
  }

  // ==================== 🔍 Observability ====================

  /**
   * Ping endpoint
   */
  async ping(): Promise<any> {
    return this.request<any>('GET', '/ping', undefined, undefined);
  }

  /**
   * Health check
   */
  async health(): Promise<any> {
    return this.request<any>('GET', '/health', undefined, undefined);
  }

  /**
   * Get server version
   */
  async getServerVersion(): Promise<any> {
    return this.request<any>('GET', '/api/server/version', undefined, undefined);
  }

  /**
   * Get server environment
   */
  async getServerEnvironment(): Promise<any> {
    return this.request<any>('GET', '/api/server/environment', undefined, undefined);
  }

  /**
   * Get server status
   */
  async getServerStatus(): Promise<any> {
    return this.request<any>('GET', '/api/server/status', undefined, undefined);
  }

  /**
   * Stop server
   */
  async stopServer(): Promise<any> {
    return this.request<any>('POST', '/api/server/stop', undefined, undefined);
  }

  /**
   * Get heap snapshot
   */
  async getHeapSnapshot(): Promise<any> {
    return this.request<any>('GET', '/api/server/debug/heapsnapshot', undefined, undefined);
  }

  /**
   * Get browser trace
   */
  async getBrowserTrace(sessionName: string): Promise<any> {
    return this.request<any>('GET', `/api/server/debug/browser/trace/${sessionName}`, undefined, undefined);
  }

  /**
   * Get API version
   */
  async getVersion(): Promise<any> {
    return this.request<any>('GET', '/api/version', undefined, undefined);
  }

  // ==================== 🖼️ Media Management ====================

  /**
   * Convert audio to voice message format
   */
  async convertToVoice(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/media/convert/voice`, data, config);
  }

  /**
   * Convert video
   */
  async convertVideo(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/media/convert/video`, data, config);
  }

  // ==================== 🖼️ Screenshot ====================

  /**
   * Take screenshot
   */
  async takeScreenshot(session?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (session) params.session = session;
    
    return this.request<any>('GET', '/api/screenshot', undefined, undefined, params);
  }

  // ==================== 📅 Events ====================

  /**
   * Send event
   */
  async sendEvent(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/events`, data, config);
  }

  // ==================== 🧩 Apps Management ====================

  /**
   * Get all apps
   */
  async getApps(): Promise<any> {
    return this.request<any>('GET', '/api/apps', undefined, undefined);
  }

  /**
   * Create app
   */
  async createApp(data: any): Promise<any> {
    return this.request<any>('POST', '/api/apps', data, undefined);
  }

  /**
   * Get app by ID
   */
  async getApp(id: string): Promise<any> {
    return this.request<any>('GET', `/api/apps/${id}`, undefined, undefined);
  }

  /**
   * Update app
   */
  async updateApp(id: string, data: any): Promise<any> {
    return this.request<any>('PUT', `/api/apps/${id}`, data, undefined);
  }

  /**
   * Delete app
   */
  async deleteApp(id: string): Promise<any> {
    return this.request<any>('DELETE', `/api/apps/${id}`, undefined, undefined);
  }

  /**
   * Get Chatwoot locales
   */
  async getChatwootLocales(): Promise<any> {
    return this.request<any>('GET', '/api/apps/chatwoot/locales', undefined, undefined);
  }
}
