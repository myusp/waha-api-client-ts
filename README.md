# waha-api-client-ts

TypeScript client library for [WAHA (WhatsApp HTTP API)](https://github.com/devlikeapro/waha) - Unofficial

**✨ This library is fully auto-generated and maintained by GitHub Copilot**

## Features

- ✅ **Complete API Coverage**: All 147 WAHA API endpoints implemented
- 🌐 **Universal Compatibility**: Works in both Node.js and browser environments
- 🚫 **Zero Dependencies**: No axios or other HTTP libraries - uses native fetch API
- 🔑 **Default Configuration**: Set API key, base URL, and default session on initialization
- 🔄 **Config Override**: Override session, timeout, retry attempts, and retry delay per API call
- 🔁 **Automatic Retries**: Built-in retry logic with configurable attempts and delays
- 📝 **TypeScript**: Fully typed with TypeScript for better development experience
- 🚀 **Easy to Use**: Simple and intuitive API
- 🛡️ **Safe Send Methods**: Built-in number verification to prevent blocking

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

## Safe Send Methods (Avoid Blocking)

To prevent your WhatsApp account from being blocked, it's recommended to check if a number is registered on WhatsApp before sending messages. This library provides "safe send" methods that automatically implement WhatsApp's anti-blocking best practices.

### Why Use Safe Send?

When you send messages to numbers that don't exist on WhatsApp, it can lead to your account being flagged or blocked. Safe send methods help prevent this by implementing the following anti-blocking measures:

1. **Number Verification**: Checks if the number is registered on WhatsApp before sending
2. **Seen Receipt**: Sends a "seen" indicator to appear more human-like
3. **Typing Indicators**: Shows "typing..." with realistic delays based on message type and length
4. **Random Delays**: Adds random delays between actions to simulate human behavior
5. **Smart Timing**: Calculates appropriate delays based on message length (1-5 seconds for text, 2-6 seconds for media)

These methods return `null` if the number doesn't exist, preventing failed delivery attempts that could flag your account.

**Delay Timings:**
- Text messages: 1-5 seconds (calculated based on message length)
- Images: 2-4 seconds
- Videos: 3-6 seconds  
- Files: 2-5 seconds
- Voice, Location, Contacts, Buttons, Lists, Polls: 1.5-3 seconds

### Available Safe Send Methods

All safe send methods follow the same pattern: they check the number status first, then send only if the number exists.

- `safeSendText()` - Safe version of `sendText()`
- `safeSendImage()` - Safe version of `sendImage()`
- `safeSendFile()` - Safe version of `sendFile()`
- `safeSendVoice()` - Safe version of `sendVoice()`
- `safeSendVideo()` - Safe version of `sendVideo()`
- `safeSendLocation()` - Safe version of `sendLocation()`
- `safeSendContactVcard()` - Safe version of `sendContactVcard()`
- `safeSendLinkPreview()` - Safe version of `sendLinkPreview()`
- `safeSendButtons()` - Safe version of `sendButtons()`
- `safeSendList()` - Safe version of `sendList()`
- `safeSendPoll()` - Safe version of `sendPoll()`

### How Safe Send Works

When you call a safe send method, the following sequence occurs automatically:

1. **Verify Number**: Check if the recipient's number exists on WhatsApp
2. **Send Seen**: Mark the chat as "seen" (if applicable)
3. **Start Typing**: Show typing indicator in the chat
4. **Wait**: Realistic delay based on message type (see "Delay Timings" above: 1-6 seconds depending on content)
5. **Stop Typing**: Hide typing indicator
6. **Send Message**: Deliver the actual message

This mimics human behavior and significantly reduces the risk of being flagged as a bot or spam account.

### Safe Send Usage Examples

```typescript
// Safe send text message with anti-blocking measures
const result = await client.safeSendText({
  chatId: '1234567890@c.us',
  text: 'Hello! How are you?',
});

if (result === null) {
  console.log('Number does not exist on WhatsApp - message not sent');
} else {
  console.log('Message sent successfully with anti-blocking measures:', result);
}

// Safe send image with anti-blocking measures
const imageResult = await client.safeSendImage({
  chatId: '1234567890@c.us',
  file: 'https://example.com/image.jpg',
  caption: 'Check this out!',
});

if (imageResult === null) {
  console.log('Number does not exist on WhatsApp - image not sent');
} else {
  console.log('Image sent successfully:', imageResult);
}

// Safe send file with anti-blocking measures
const fileResult = await client.safeSendFile({
  chatId: '1234567890@c.us',
  file: 'https://example.com/document.pdf',
  filename: 'document.pdf',
  caption: 'Important document',
});

if (fileResult === null) {
  console.log('Number does not exist on WhatsApp - file not sent');
} else {
  console.log('File sent successfully:', fileResult);
}
```

### Anti-Blocking Best Practices

Following WhatsApp's guidelines to avoid getting blocked:

✅ **DO:**
- Use safe send methods for new/unknown contacts
- Add random delays between messages (the safe send methods do this automatically)
- Only reply to messages, never initiate conversations with strangers
- Send personalized messages that vary in content
- Respect rate limits (maximum 4 messages per hour per contact is a safe guideline - exceeding this may trigger spam detection)
- Have a profile picture and status
- Use HTTPS URLs and avoid previously marked spam links

❌ **DON'T:**
- Send messages to numbers not on WhatsApp
- Send bulk messages without delays
- Use the same message template repeatedly
- Send messages 24/7 without breaks
- Send long texts or multiple messages to new contacts
- Ignore user reports (if users block/report you, stop messaging them)

### When to Use Safe Send vs Regular Send

- **Use Safe Send** when:
  - Sending to numbers from external sources (databases, forms, APIs)
  - You're not sure if the number is on WhatsApp
  - You want maximum protection against blocking
  - You're doing any form of bulk messaging
  - Initiating conversations with new contacts
  - Building a bot or automated system

- **Use Regular Send** when:
  - Sending to group chats (groups don't need number verification)
  - Replying to received messages (they initiated the conversation)
  - You're certain the number exists and you have an ongoing conversation
  - You need minimal latency and have already verified the number
  - Sending to your own saved contacts from your phone

## API Methods

This client implements all 147 WAHA API endpoints organized into the following categories:

### 🔑 Authentication (2 methods)
- `getQR()` - Get QR code for pairing
- `requestCode()` - Request authentication code

### 🖥️ Session Management (13 methods)
- `getSessions()` - Get all sessions
- `getSession()` - Get session info
- `createSession()` - Create new session
- `updateSession()` - Update session config
- `deleteSession()` - Delete session
- `startSession()` / `startSessionAlt()` - Start session
- `stopSession()` / `stopSessionAlt()` - Stop session
- `logoutSession()` / `logoutSessionBulk()` - Logout session
- `restartSession()` - Restart session
- `getSessionMe()` - Get session "me" info

### 🆔 Profile Management (5 methods)
- `getProfile()` - Get my profile
- `setProfileName()` - Set profile name
- `setProfileStatus()` - Set profile status
- `setProfilePicture()` - Set profile picture
- `deleteProfilePicture()` - Delete profile picture

### 📤 Messaging (24 methods)
- `sendText()` / `sendTextAlt()` / `sendTextGet()` - Send text message
- `sendImage()` / `sendImageAlt()` - Send image
- `sendFile()` / `sendFileAlt()` - Send file
- `sendVoice()` - Send voice message
- `sendVideo()` - Send video
- `sendButtons()` - Send buttons
- `sendList()` - Send list message
- `sendPoll()` - Send poll
- `sendPollVote()` - Vote in poll
- `sendLocation()` - Send location
- `sendContactVcard()` - Send contact vCard
- `sendLinkPreview()` - Send link with preview
- `sendLinkCustomPreview()` - Send link with custom preview
- `forwardMessage()` - Forward message
- `reply()` - Reply to message
- `replyButton()` - Reply to button
- `sendSeen()` - Mark as seen
- `startTyping()` - Start typing indicator
- `stopTyping()` - Stop typing indicator
- `reaction()` - React to message
- `star()` - Star/unstar message
- `getMessages()` / `getMessagesAlt()` - Get messages
- `checkNumberStatus()` - Check if number is on WhatsApp

### 💬 Chat Management (16 methods)
- `getChats()` - Get all chats
- `getChatsOverview()` - Get chats overview
- `createChatsOverview()` - Create chats overview
- `deleteChat()` - Delete chat
- `getChatPicture()` - Get chat picture
- `getMessage()` - Get specific message
- `deleteMessage()` - Delete message
- `editMessage()` - Edit message
- `deleteAllMessages()` - Delete all messages
- `readMessages()` - Mark messages as read
- `pinMessage()` - Pin message
- `unpinMessage()` - Unpin message
- `archiveChat()` - Archive chat
- `unarchiveChat()` - Unarchive chat
- `markChatUnread()` - Mark chat as unread

### 📢 Channels Management (14 methods)
- `getChannels()` - Get all channels
- `createChannel()` - Create channel
- `getChannel()` - Get channel by ID
- `deleteChannel()` - Delete channel
- `getChannelMessagesPreview()` - Get messages preview
- `followChannel()` - Follow channel
- `unfollowChannel()` - Unfollow channel
- `muteChannel()` - Mute channel
- `unmuteChannel()` - Unmute channel
- `searchChannelsByView()` - Search channels by view
- `searchChannelsByText()` - Search channels by text
- `getChannelSearchViews()` - Get search views
- `getChannelSearchCountries()` - Get search countries
- `getChannelSearchCategories()` - Get search categories

### 🟢 Status Management (6 methods)
- `postTextStatus()` - Post text status
- `postImageStatus()` - Post image status
- `postVoiceStatus()` - Post voice status
- `postVideoStatus()` - Post video status
- `deleteStatus()` - Delete status
- `getNewMessageId()` - Get new message ID

### 🏷️ Labels Management (7 methods)
- `getLabels()` - Get all labels
- `createLabel()` - Create label
- `updateLabel()` - Update label
- `deleteLabel()` - Delete label
- `getChatLabels()` - Get labels for chat
- `setChatLabels()` - Set labels for chat
- `getChatsByLabel()` - Get chats by label

### 👤 Contacts Management (12 methods)
- `getAllContacts()` - Get all contacts
- `getContact()` - Get contact info
- `checkContactExists()` - Check if contact exists
- `getContactAbout()` - Get contact about
- `getContactProfilePicture()` - Get contact profile picture
- `blockContact()` - Block contact
- `unblockContact()` - Unblock contact
- `updateContact()` - Update contact
- `getLids()` - Get LIDs
- `getLidsCount()` - Get LIDs count
- `getLid()` - Get LID by ID
- `getLidByPhone()` - Get LID by phone

### 👥 Groups Management (25 methods)
- `createGroup()` - Create group
- `getGroups()` - Get all groups
- `getGroup()` - Get group by ID
- `deleteGroup()` - Delete group
- `getGroupsCount()` - Get groups count
- `refreshGroups()` - Refresh groups
- `getGroupJoinInfo()` - Get group join info
- `joinGroup()` - Join group
- `leaveGroup()` - Leave group
- `getGroupPicture()` - Get group picture
- `setGroupPicture()` - Set group picture
- `deleteGroupPicture()` - Delete group picture
- `setGroupDescription()` - Set group description
- `setGroupSubject()` - Set group subject
- `getGroupInfoAdminOnly()` - Get info admin only setting
- `setGroupInfoAdminOnly()` - Set info admin only
- `getGroupMessagesAdminOnly()` - Get messages admin only setting
- `setGroupMessagesAdminOnly()` - Set messages admin only
- `getGroupInviteCode()` - Get invite code
- `revokeGroupInviteCode()` - Revoke invite code
- `getGroupParticipants()` - Get participants
- `addGroupParticipants()` - Add participants
- `removeGroupParticipants()` - Remove participants
- `promoteGroupParticipant()` - Promote to admin
- `demoteGroupParticipant()` - Demote from admin

### ✅ Presence Management (4 methods)
- `setPresence()` - Set presence
- `getAllPresence()` - Get all presence info
- `getPresence()` - Get presence for chat
- `subscribePresence()` - Subscribe to presence

### 🔍 Observability (9 methods)
- `ping()` - Ping endpoint
- `health()` - Health check
- `getVersion()` - Get API version
- `getServerVersion()` - Get server version
- `getServerEnvironment()` - Get server environment
- `getServerStatus()` - Get server status
- `stopServer()` - Stop server
- `getHeapSnapshot()` - Get heap snapshot
- `getBrowserTrace()` - Get browser trace

### 🖼️ Media Management (2 methods)
- `convertToVoice()` - Convert audio to voice format
- `convertVideo()` - Convert video

### 🖼️ Screenshot (1 method)
- `takeScreenshot()` - Take screenshot

### 📅 Events (1 method)
- `sendEvent()` - Send event

### 🧩 Apps Management (6 methods)
- `getApps()` - Get all apps
- `createApp()` - Create app
- `getApp()` - Get app by ID
- `updateApp()` - Update app
- `deleteApp()` - Delete app
- `getChatwootLocales()` - Get Chatwoot locales

## Usage Examples

### Send Text Message

```typescript
await client.sendText({
  chatId: '1234567890@c.us',
  text: 'Hello, World!',
  reply_to: 'message-id',  // Optional: Reply to a specific message
  config: { ... },          // Optional: Override config
});
```

### Send Image

```typescript
await client.sendImage({
  chatId: '1234567890@c.us',
  file: 'https://example.com/image.jpg', // URL or base64
  caption: 'Check this out!',             // Optional
  reply_to: 'message-id',                 // Optional
  config: { ... },                        // Optional
});
```

### Send File

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

### Create and Manage Groups

```typescript
// Create a group
const groupResponse = await client.createGroup({
  name: 'My Group',
  participants: ['1234567890@c.us', '0987654321@c.us']
});

// Add participants (use the group ID from the response)
const groupId = 'group-id@g.us'; // Extract from response
await client.addGroupParticipants(groupId, {
  participants: ['1111111111@c.us']
});

// Promote to admin
await client.promoteGroupParticipant(groupId, {
  participants: ['1234567890@c.us']
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

See [src/example.ts](./src/example.ts) for code examples and [src/demo.ts](./src/demo.ts) for a complete feature demonstration.

To run the demo:
```bash
npm install
npx tsx src/demo.ts
```

## Publishing to NPM

This library is automatically published to NPM when a new release is created. The GitHub Actions workflow handles:

1. Building the TypeScript code
2. Running tests
3. Publishing to NPM with provenance

### Setup for NPM Publishing

To enable automatic publishing, you need to:

1. Create an NPM access token:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create a new "Automation" token
   
2. Add the token to GitHub repository secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Create a new repository secret named `NPM_TOKEN`
   - Paste your NPM access token as the value

3. Create a new release:
   - Go to the repository's Releases page
   - Click "Create a new release"
   - Choose or create a tag (e.g., `v1.0.1`)
   - Publish the release
   - The GitHub Actions workflow will automatically publish to NPM

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is an unofficial client library for WAHA API. It is not affiliated with or endorsed by the WAHA project.

**USE AT YOUR OWN RISK**: This software is provided "as is" without warranty of any kind, either expressed or implied. The authors and contributors are not responsible for any damages, data loss, account bans, or other issues that may arise from using this library. You are solely responsible for ensuring your use complies with WhatsApp's Terms of Service and applicable laws. By using this library, you acknowledge and accept all risks associated with automated messaging and API usage.
