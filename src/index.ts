/**
 * WAHA API Client - TypeScript client for WAHA WhatsApp API
 * @packageDocumentation
 */

// Export client
export { WAHAClient } from './client';

// Export custom convenience types
export type {
  WAHAConfig,
  RequestConfig,
  SendTextParams,
  SendImageParams,
  SendFileParams,
  APIResponse,
} from './types';

// Export all OpenAPI schema types
export * from './schema-types';

// Export utility functions
export { toNodeBuffer } from './utils';
