import {
  WAHAConfig,
  RequestConfig,
  SendTextParams,
  SendImageParams,
  SendFileParams,
  SessionInfo,
  ChatInfo,
  MessageInfo,
  APIResponse,
} from './types';

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
   * @param params - Message parameters
   * @returns API response
   */
  async sendText(params: SendTextParams): Promise<APIResponse<MessageInfo>> {
    const { chatId, text, reply_to, config } = params;
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<APIResponse<MessageInfo>>(
      'POST',
      `/api/${mergedConfig.session}/messages/text`,
      {
        chatId,
        text,
        ...(reply_to && { reply_to }),
      },
      config
    );
  }

  /**
   * Send an image message
   * @param params - Message parameters
   * @returns API response
   */
  async sendImage(params: SendImageParams): Promise<APIResponse<MessageInfo>> {
    const { chatId, file, caption, reply_to, config } = params;
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<APIResponse<MessageInfo>>(
      'POST',
      `/api/${mergedConfig.session}/messages/image`,
      {
        chatId,
        file,
        ...(caption && { caption }),
        ...(reply_to && { reply_to }),
      },
      config
    );
  }

  /**
   * Send a file message
   * @param params - Message parameters
   * @returns API response
   */
  async sendFile(params: SendFileParams): Promise<APIResponse<MessageInfo>> {
    const { chatId, file, filename, caption, reply_to, config } = params;
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<APIResponse<MessageInfo>>(
      'POST',
      `/api/${mergedConfig.session}/messages/file`,
      {
        chatId,
        file,
        ...(filename && { filename }),
        ...(caption && { caption }),
        ...(reply_to && { reply_to }),
      },
      config
    );
  }

  /**
   * Get session information
   * @param config - Optional request configuration
   * @returns Session information
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
   * @param config - Optional request configuration
   * @returns Session information
   */
  async startSession(config?: RequestConfig): Promise<SessionInfo> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<SessionInfo>(
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
   * @param config - Optional request configuration
   * @returns API response
   */
  async stopSession(config?: RequestConfig): Promise<APIResponse> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<APIResponse>(
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
   * @param config - Optional request configuration
   * @returns List of sessions
   */
  async getSessions(config?: RequestConfig): Promise<SessionInfo[]> {
    return this.request<SessionInfo[]>(
      'GET',
      `/api/sessions`,
      undefined,
      config
    );
  }

  /**
   * Get chats
   * @param config - Optional request configuration
   * @returns List of chats
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
   * @param chatId - Chat ID to get messages from
   * @param config - Optional request configuration
   * @returns List of messages
   */
  async getMessages(chatId: string, config?: RequestConfig): Promise<MessageInfo[]> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<MessageInfo[]>(
      'GET',
      `/api/${mergedConfig.session}/chats/${chatId}/messages`,
      undefined,
      config
    );
  }

  /**
   * Check if a number is registered on WhatsApp
   * @param phone - Phone number to check
   * @param config - Optional request configuration
   * @returns Registration status
   */
  async checkNumberStatus(
    phone: string,
    config?: RequestConfig
  ): Promise<{ exists: boolean; numberExists?: boolean }> {
    const mergedConfig = this.mergeConfig(config);
    
    return this.request<{ exists: boolean; numberExists?: boolean }>(
      'GET',
      `/api/checkNumberStatus`,
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
   * Safely send a text message - checks if number exists before sending
   * @param params - Message parameters
   * @returns API response or null if number doesn't exist
   */
  async safeSendText(params: SendTextParams): Promise<APIResponse<MessageInfo> | null> {
    const phone = this.extractPhoneFromChatId(params.chatId);
    const statusResult = await this.checkNumberStatus(phone, params.config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendText(params);
  }

  /**
   * Safely send an image message - checks if number exists before sending
   * @param params - Message parameters
   * @returns API response or null if number doesn't exist
   */
  async safeSendImage(params: SendImageParams): Promise<APIResponse<MessageInfo> | null> {
    const phone = this.extractPhoneFromChatId(params.chatId);
    const statusResult = await this.checkNumberStatus(phone, params.config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendImage(params);
  }

  /**
   * Safely send a file message - checks if number exists before sending
   * @param params - Message parameters
   * @returns API response or null if number doesn't exist
   */
  async safeSendFile(params: SendFileParams): Promise<APIResponse<MessageInfo> | null> {
    const phone = this.extractPhoneFromChatId(params.chatId);
    const statusResult = await this.checkNumberStatus(phone, params.config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendFile(params);
  }

  /**
   * Safely send a voice message - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendVoice(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendVoice(data, config);
  }

  /**
   * Safely send a video message - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendVideo(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendVideo(data, config);
  }

  /**
   * Safely send a location message - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendLocation(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendLocation(data, config);
  }

  /**
   * Safely send a contact vCard - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendContactVcard(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendContactVcard(data, config);
  }

  /**
   * Safely send a link preview - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendLinkPreview(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendLinkPreview(data, config);
  }

  /**
   * Safely send buttons - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendButtons(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendButtons(data, config);
  }

  /**
   * Safely send a list message - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendList(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendList(data, config);
  }

  /**
   * Safely send a poll - checks if number exists before sending
   * @param data - Message data including chatId
   * @param config - Optional request configuration
   * @returns API response or null if number doesn't exist
   */
  async safeSendPoll(data: any, config?: RequestConfig): Promise<any | null> {
    const phone = this.extractPhoneFromChatId(data.chatId);
    const statusResult = await this.checkNumberStatus(phone, config);
    
    if (!statusResult.exists && !statusResult.numberExists) {
      return null;
    }
    
    return this.sendPoll(data, config);
  }

  // ==================== 🔑 Auth Methods ====================

  /**
   * Get QR code for pairing WhatsApp API
   */
  async getQR(format: 'image' | 'raw' = 'image', config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'GET',
      `/api/${mergedConfig.session}/auth/qr`,
      undefined,
      config,
      { format }
    );
  }

  /**
   * Request authentication code
   */
  async requestCode(data: { phoneNumber: string; method?: string }, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'POST',
      `/api/${mergedConfig.session}/auth/request-code`,
      data,
      config
    );
  }

  // ==================== 🖥️ Sessions Management ====================

  /**
   * Create a new session
   */
  async createSession(data: any, config?: RequestConfig): Promise<SessionInfo> {
    return this.request<SessionInfo>('POST', '/api/sessions', data, config);
  }

  /**
   * Update session configuration
   */
  async updateSession(data: any, config?: RequestConfig): Promise<SessionInfo> {
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
   */
  async deleteSession(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/sessions/${mergedConfig.session}`, undefined, config);
  }

  /**
   * Get session "me" info
   */
  async getSessionMe(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/sessions/${mergedConfig.session}/me`, undefined, config);
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
  async stopSessionAlt(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'POST',
      `/api/sessions/${mergedConfig.session}/stop`,
      undefined,
      config
    );
  }

  /**
   * Logout from a session
   */
  async logoutSession(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
      'POST',
      `/api/sessions/${mergedConfig.session}/logout`,
      undefined,
      config
    );
  }

  /**
   * Logout from a session (bulk operation)
   */
  async logoutSessionBulk(data: { name: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sessions/logout', data, config);
  }

  /**
   * Restart a session
   */
  async restartSession(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
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
  async getProfile(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/profile`, undefined, config);
  }

  /**
   * Set profile name
   */
  async setProfileName(data: { name: string }, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/profile/name`, data, config);
  }

  /**
   * Set profile status (About)
   */
  async setProfileStatus(data: { status: string }, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/profile/status`, data, config);
  }

  /**
   * Set profile picture
   */
  async setProfilePicture(data: { file: string }, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('PUT', `/api/${mergedConfig.session}/profile/picture`, data, config);
  }

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('DELETE', `/api/${mergedConfig.session}/profile/picture`, undefined, config);
  }

  // ==================== 📤 Chatting - Extended Methods ====================

  /**
   * Send text message (alternative endpoint)
   */
  async sendTextAlt(data: { chatId: string; text: string; session?: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendText', data, config);
  }

  /**
   * Send text message via GET (alternative endpoint)
   */
  async sendTextGet(chatId: string, text: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
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
  async sendImageAlt(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendImage', data, config);
  }

  /**
   * Send file (alternative endpoint)
   */
  async sendFileAlt(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendFile', data, config);
  }

  /**
   * Send voice message
   */
  async sendVoice(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendVoice', data, config);
  }

  /**
   * Send video message
   */
  async sendVideo(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendVideo', data, config);
  }

  /**
   * Send link with custom preview
   */
  async sendLinkCustomPreview(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/send/link-custom-preview', data, config);
  }

  /**
   * Send buttons
   */
  async sendButtons(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendButtons', data, config);
  }

  /**
   * Send list message
   */
  async sendList(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendList', data, config);
  }

  /**
   * Forward message
   */
  async forwardMessage(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/forwardMessage', data, config);
  }

  /**
   * Mark message as seen
   */
  async sendSeen(data: { chatId: string; messageId?: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendSeen', data, config);
  }

  /**
   * Start typing indicator
   */
  async startTyping(data: { chatId: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/startTyping', data, config);
  }

  /**
   * Stop typing indicator
   */
  async stopTyping(data: { chatId: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/stopTyping', data, config);
  }

  /**
   * React to a message
   */
  async reaction(data: { chatId: string; messageId: string; reaction: string }, config?: RequestConfig): Promise<any> {
    return this.request<any>('PUT', '/api/reaction', data, config);
  }

  /**
   * Star/unstar a message
   */
  async star(data: { chatId: string; messageId: string; star: boolean }, config?: RequestConfig): Promise<any> {
    return this.request<any>('PUT', '/api/star', data, config);
  }

  /**
   * Send poll
   */
  async sendPoll(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendPoll', data, config);
  }

  /**
   * Vote in a poll
   */
  async sendPollVote(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendPollVote', data, config);
  }

  /**
   * Send location
   */
  async sendLocation(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendLocation', data, config);
  }

  /**
   * Send contact vCard
   */
  async sendContactVcard(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendContactVcard', data, config);
  }

  /**
   * Reply to button
   */
  async replyButton(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/send/buttons/reply', data, config);
  }

  /**
   * Get messages
   */
  async getMessagesAlt(chatId?: string, limit?: number, downloadMedia?: boolean, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    const params: Record<string, any> = { session: mergedConfig.session };
    if (chatId) params.chatId = chatId;
    if (limit !== undefined) params.limit = limit;
    if (downloadMedia !== undefined) params.downloadMedia = downloadMedia;
    
    return this.request<any>('GET', '/api/messages', undefined, config, params);
  }

  /**
   * Reply to a message
   */
  async reply(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/reply', data, config);
  }

  /**
   * Send link preview
   */
  async sendLinkPreview(data: any, config?: RequestConfig): Promise<any> {
    return this.request<any>('POST', '/api/sendLinkPreview', data, config);
  }

  // ==================== 💬 Chats Management ====================

  /**
   * Get chats overview
   */
  async getChatsOverview(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/chats/overview`, undefined, config);
  }

  /**
   * Create chats overview
   */
  async createChatsOverview(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/chats/overview`, data, config);
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
  async getChatPicture(chatId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/chats/${chatId}/picture`, undefined, config);
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
  async getChannels(config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/channels`, undefined, config);
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
  async getChannel(id: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/channels/${id}`, undefined, config);
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
  async getChatsByLabel(labelId: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('GET', `/api/${mergedConfig.session}/labels/${labelId}/chats`, undefined, config);
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
  async checkContactExists(phone: string, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>(
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
   */
  async createGroup(data: any, config?: RequestConfig): Promise<any> {
    const mergedConfig = this.mergeConfig(config);
    return this.request<any>('POST', `/api/${mergedConfig.session}/groups`, data, config);
  }

  /**
   * Get all groups
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
