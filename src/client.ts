import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
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
  private axiosInstance: AxiosInstance;

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

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'X-Api-Key': this.config.apiKey }),
      },
    });
  }

  /**
   * Merge default config with request-specific overrides
   */
  private mergeConfig(override?: RequestConfig): Required<Omit<RequestConfig, 'session'>> & { session: string } {
    return {
      session: override?.session || this.config.session || 'default',
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
   * Make HTTP request with retry logic
   */
  private async request<T>(
    method: string,
    path: string,
    data?: any,
    requestConfig?: RequestConfig
  ): Promise<T> {
    const mergedConfig = this.mergeConfig(requestConfig);
    
    const axiosConfig: AxiosRequestConfig = {
      method,
      url: path,
      timeout: mergedConfig.timeout,
      ...(data && { data }),
    };

    return this.executeWithRetry(
      async () => {
        const response = await this.axiosInstance.request<T>(axiosConfig);
        return response.data;
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
      `/api/${mergedConfig.session}/contacts/check-exists?phone=${phone}`,
      undefined,
      config
    );
  }
}
