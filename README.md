# waha-api-client-ts

TypeScript client library for [WAHA (WhatsApp HTTP API)](https://github.com/devlikeapro/waha) - Unofficial

## Features

- 🔑 **Default Configuration**: Set API key, base URL, and default session on initialization
- 🔄 **Config Override**: Override session, timeout, retry attempts, and retry delay per API call
- 🔁 **Automatic Retries**: Built-in retry logic with configurable attempts and delays
- 📝 **TypeScript**: Fully typed with TypeScript for better development experience
- 🚀 **Easy to Use**: Simple and intuitive API

## Installation

```bash
npm install waha-api-client-ts
```

## Quick Start

```typescript
import { WAHAClient } from 'waha-api-client-ts';

// Initialize client with default configuration
const client = new WAHAClient({
  baseURL: 'https://your-waha-instance.com',
  apiKey: 'your-api-key',
  session: 'default',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
});

// Send a text message
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'Hello from WAHA!',
});
```

## Configuration

### Default Configuration

When initializing the client, you can set default values:

```typescript
const client = new WAHAClient({
  baseURL: 'https://your-waha-instance.com',  // Required: Your WAHA API base URL
  apiKey: 'your-api-key',                     // Optional: API key for authentication
  session: 'default',                          // Optional: Default session name (default: 'default')
  timeout: 30000,                              // Optional: Request timeout in ms (default: 30000)
  retryAttempts: 3,                            // Optional: Number of retry attempts (default: 3)
  retryDelay: 1000,                            // Optional: Delay between retries in ms (default: 1000)
});
```

### Per-Request Configuration Override

You can override configuration for individual API calls:

```typescript
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'Hello!',
  config: {
    session: 'custom-session',      // Override session for this request
    timeout: 60000,                  // Override timeout for this request
    retryAttempts: 5,                // Override retry attempts
    retryDelay: 2000,                // Override retry delay
  },
});
```

## API Methods

### Messaging

#### Send Text Message

```typescript
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'Hello, World!',
  reply_to: 'message-id',  // Optional: Reply to a specific message
  config: { ... },          // Optional: Override config
});
```

#### Send Image

```typescript
await client.sendImage({
  chatId: '1234567890@c.us',
  file: 'https://example.com/image.jpg', // URL or base64
  caption: 'Check this out!',             // Optional
  reply_to: 'message-id',                 // Optional
  config: { ... },                        // Optional
});
```

#### Send File

```typescript
await client.sendFile({
  chatId: '1234567890@c.us',
  file: 'https://example.com/document.pdf',
  filename: 'document.pdf',               // Optional
  caption: 'Important document',          // Optional
  reply_to: 'message-id',                 // Optional
  config: { ... },                        // Optional
});
```

### Session Management

#### Get Session Info

```typescript
const session = await client.getSession({
  session: 'custom-session',  // Optional: Override session
});
```

#### Start Session

```typescript
const session = await client.startSession({
  session: 'new-session',  // Optional: Override session to start
});
```

#### Stop Session

```typescript
await client.stopSession({
  session: 'session-to-stop',  // Optional: Override session
});
```

#### Get All Sessions

```typescript
const sessions = await client.getSessions();
```

### Chat Operations

#### Get Chats

```typescript
const chats = await client.getChats({
  session: 'custom-session',  // Optional: Override session
});
```

#### Get Messages

```typescript
const messages = await client.getMessages('1234567890@c.us', {
  session: 'custom-session',  // Optional: Override session
});
```

### Contact Operations

#### Check Number Status

```typescript
const status = await client.checkNumberStatus('1234567890', {
  session: 'custom-session',  // Optional: Override session
});
console.log(status.exists); // true if number is on WhatsApp
```

## Advanced Usage

### Multiple Sessions

You can work with multiple WhatsApp sessions using the same client:

```typescript
const client = new WAHAClient({
  baseURL: 'https://your-waha-instance.com',
  apiKey: 'your-api-key',
  session: 'default',
});

// Send from default session
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'From default session',
});

// Send from a different session
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'From custom session',
  config: { session: 'session-2' },
});
```

### Custom Retry Logic

Adjust retry behavior for specific operations:

```typescript
// For a critical message that needs more retries
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'Important message',
  config: {
    retryAttempts: 10,
    retryDelay: 5000,
  },
});

// For a quick operation with no retries
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'Quick message',
  config: {
    retryAttempts: 0,
  },
});
```

### Error Handling

```typescript
try {
  await client.sendText({
    chatId: '1234567890@c.us',
    text: 'Hello!',
  });
} catch (error) {
  console.error('Failed to send message:', error);
}
```

## Types

The library exports TypeScript types for all configurations and responses:

```typescript
import type {
  WAHAConfig,
  RequestConfig,
  SendTextParams,
  SendImageParams,
  SendFileParams,
  SessionInfo,
  ChatInfo,
  MessageInfo,
  APIResponse,
} from 'waha-api-client-ts';
```

## Examples

See [src/example.ts](./src/example.ts) for more detailed examples.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is an unofficial client library for WAHA API. It is not affiliated with or endorsed by the WAHA project.
