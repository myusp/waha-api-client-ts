/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Base64FileSchema {
  mimetype: string;
  data: string;
}

export interface QRCodeValueSchema {
  value: string;
}

export interface RequestCodeRequestSchema {
  /**
   * Mobile phone number in international format
   * @example "12132132130"
   */
  phoneNumber: string;
  /**
   * How would you like to receive the one time code for registration? |sms|voice. Leave empty for Web pairing.
   * @example null
   */
  method?: string;
}

export interface MeInfoSchema {
  /** @example "11111111111@c.us" */
  id: string;
  /** @example "123123@lid" */
  lid?: string;
  pushName: string;
}

export type MapSchema = object;

export interface ProxyConfigSchema {
  /** @example "localhost:3128" */
  server: string;
  /** @example null */
  username?: string;
  /** @example null */
  password?: string;
}

export interface IgnoreConfigSchema {
  /** Ignore a status@broadcast (stories) events */
  status?: boolean;
  /** Ignore groups events */
  groups?: boolean;
  /** Ignore channels events */
  channels?: boolean;
  /** Ignore broadcast events (broadcast list and status) */
  broadcast?: boolean;
}

export interface NowebStoreConfigSchema {
  /**
   * Enable or disable the store for contacts, chats, and messages.
   * @default false
   * @example true
   */
  enabled: boolean;
  /**
   * Enable full sync on session initialization (when scanning QR code).
   * Full sync will download all contacts, chats, and messages from the phone.
   * If disabled, only messages early than 90 days will be downloaded and some contacts may be missing.
   * @default false
   */
  fullSync: boolean;
}

export interface NowebConfigSchema {
  /**
   * Mark the session as online when it connects to the server.
   * @default true
   */
  markOnline: boolean;
  store?: NowebStoreConfigSchema;
}

export interface WebjsConfigSchema {
  /**
   * Enable emission of special 'tag:*' engine events required for presence.update and message.ack.
   * WARNING: Enabling this may have performance and stability impact. Disabled by default.
   * @default false
   */
  tagsEventsOn?: boolean;
}

export interface HmacConfigurationSchema {
  /** @example "your-secret-key" */
  key?: string;
}

export interface RetriesConfigurationSchema {
  /** @example 2 */
  delaySeconds?: number;
  /** @example 15 */
  attempts?: number;
  /** @example "linear" */
  policy?: "linear" | "exponential" | "constant";
}

export interface CustomHeaderSchema {
  /** @example "X-My-Custom-Header" */
  name: string;
  /** @example "Value" */
  value: string;
}

export interface WebhookConfigSchema {
  /**
   * You can use https://docs.webhook.site/ to test webhooks and see the payload
   * @example "https://webhook.site/11111111-1111-1111-1111-11111111"
   */
  url: string;
  /** @example ["message","session.status"] */
  events: object[];
  /** @example null */
  hmac?: HmacConfigurationSchema;
  /** @example null */
  retries?: RetriesConfigurationSchema;
  /** @example null */
  customHeaders?: CustomHeaderSchema[];
}

export interface SessionConfigSchema {
  /**
   * Metadata for the session. You'll get 'metadata' in all webhooks.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example null */
  proxy?: ProxyConfigSchema;
  /** @default false */
  debug?: boolean;
  /**
   * Ignore some events related to specific chats
   * @example {"status":null,"groups":null,"channels":null}
   */
  ignore?: IgnoreConfigSchema;
  /** @example {"store":{"enabled":true,"fullSync":false}} */
  noweb?: NowebConfigSchema;
  /** WebJS-specific settings. */
  webjs?: WebjsConfigSchema;
  webhooks?: WebhookConfigSchema[];
}

export interface SessionInfoSchema {
  /**
   * Session name (id)
   * @example "default"
   */
  name: string;
  me?: MeInfoSchema;
  assignedWorker?: string;
  status: "STOPPED" | "STARTING" | "SCAN_QR_CODE" | "WORKING" | "FAILED";
  config?: SessionConfigSchema;
}

export interface SessionCreateRequestSchema {
  /**
   * Session name (id)
   * @maxLength 54
   * @pattern /^[a-zA-Z0-9_-]*$/
   * @example "default"
   */
  name?: string;
  /**
   * Start session after creation
   * @default true
   * @example true
   */
  start?: boolean;
  config?: SessionConfigSchema;
}

export interface SessionDTOSchema {
  /**
   * Session name (id)
   * @example "default"
   */
  name: string;
  status: "STOPPED" | "STARTING" | "SCAN_QR_CODE" | "WORKING" | "FAILED";
  config?: SessionConfigSchema;
}

export interface SessionUpdateRequestSchema {
  config?: SessionConfigSchema;
}

export interface SessionStartDeprecatedRequestSchema {
  /**
   * Session name (id)
   * @example "default"
   */
  name: string;
  config?: SessionConfigSchema;
}

export interface SessionStopDeprecatedRequestSchema {
  /**
   * Session name (id)
   * @example "default"
   */
  name: string;
  /**
   * Stop and logout from the session.
   * @default false
   * @example false
   */
  logout?: boolean;
}

export interface SessionLogoutDeprecatedRequestSchema {
  /**
   * Session name (id)
   * @example "default"
   */
  name: string;
}

export interface MyProfileSchema {
  /** @example "11111111111@c.us" */
  id: string;
  /** @example "https://example.com/picture.jpg" */
  picture: string | null;
  name: string;
}

export interface ProfileNameRequestSchema {
  /** @example "My New Name" */
  name: string;
}

export interface ResultSchema {
  /** @default true */
  success: boolean;
}

export interface ProfileStatusRequestSchema {
  /** @example "🎉 Hey there! I am using WhatsApp 🎉" */
  status: string;
}

export interface RemoteFileSchema {
  /**
   * MIME type of the attachment.
   * @example "image/jpeg"
   */
  mimetype: string;
  /**
   * Document file name. Value can be null
   * @example "filename.jpg"
   */
  filename?: string;
  /** @example "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg" */
  url: string;
}

export interface BinaryFileSchema {
  /**
   * MIME type of the attachment.
   * @example "image/jpeg"
   */
  mimetype: string;
  /**
   * Document file name. Optional
   * @example "filename.jpeg"
   */
  filename?: string;
  /**
   * Base64-encoded data of the file
   * @example "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"
   */
  data: string;
}

export interface ProfilePictureRequestSchema {
  file: RemoteFileSchema | BinaryFileSchema;
}

export interface MessageTextRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /** @default "Hi there!" */
  text: string;
  /** @default true */
  linkPreview?: boolean;
  /** @default false */
  linkPreviewHighQuality?: boolean;
  /** @default "default" */
  session: string;
}

export interface S3MediaDataSchema {
  /**
   * The name of the S3 bucket
   * @example "my-bucket"
   */
  Bucket: string;
  /**
   * The key of the object in the S3 bucket
   * @example "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
   */
  Key: string;
}

export interface WAMediaSchema {
  /**
   * The URL for the media in the message if any
   * @example "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
   */
  url?: string;
  /**
   * mimetype for the media in the message if any
   * @example "audio/jpeg"
   */
  mimetype?: string;
  /**
   * The original filename in mediaUrl in the message if any
   * @example "example.pdf"
   */
  filename?: string;
  /** S3 attributes for the media in the message if you are using S3 media storage */
  s3?: S3MediaDataSchema;
  /**
   * Error message if there's an error downloading the media
   * @example null
   */
  error?: object;
}

export interface WALocationSchema {
  description?: string;
  latitude: string;
  longitude: string;
}

export interface ReplyToMessageSchema {
  /**
   * Message ID
   * @example "AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /** @example "11111111111@c.us" */
  participant?: string;
  /** @example "Hello!" */
  body?: string;
  /** Raw data from reply's message */
  _data?: object;
}

export interface WAMessageSchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /**
   * Unix timestamp for when the message was created
   * @example 1666943582
   */
  timestamp: number;
  /**
   * ID for the Chat that this message was sent to, except if the message was sent by the current user
   * @example "11111111111@c.us"
   */
  from: string;
  /** Indicates if the message was sent by the current user */
  fromMe: boolean;
  /**
   * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
   * @example "api"
   */
  source: "api" | "app";
  /**
   *
   * * ID for who this message is for.
   * * If the message is sent by the current user, it will be the Chat to which the message is being sent.
   * * If the message is sent by another user, it will be the ID for the current user.
   * @example "11111111111@c.us"
   */
  to: string;
  /** For groups - participant who sent the message */
  participant: string;
  /** Message content */
  body: string;
  /** Indicates if the message has media available for download */
  hasMedia: boolean;
  /** Media object for the message if any and downloaded */
  media?: WAMediaSchema;
  /**
   * Use `media.url` instead! The URL for the media in the message if any
   * @deprecated
   * @example "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
   */
  mediaUrl: string;
  /** ACK status for the message */
  ack: -1 | 0 | 1 | 2 | 3 | 4;
  /** ACK status name for the message */
  ackName: string;
  /** If the message was sent to a group, this field will contain the user that sent the message. */
  author?: string;
  /** Location information contained in the message, if the message is type "location" */
  location?: WALocationSchema;
  /** List of vCards contained in the message. */
  vCards?: string[];
  /** Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend. */
  _data?: object;
  replyTo?: ReplyToMessageSchema;
}

export interface MessageImageRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  file: RemoteFileSchema | BinaryFileSchema;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  caption?: string;
  /** @default "default" */
  session: string;
}

export interface MessageFileRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  file: RemoteFileSchema | BinaryFileSchema;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  caption?: string;
  /** @default "default" */
  session: string;
}

export interface VoiceBinaryFileSchema {
  /**
   * MIME type of the attachment.
   * @default "audio/ogg; codecs=opus"
   */
  mimetype: object;
  /**
   * Document file name. Optional
   * @default "voice-message.mp3"
   */
  filename: object;
  /**
   * Base64-encoded data of the file
   * @example "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VSO3pMrPlDI7//NkxP8g454UCuJGUWisGIZWQwUgpHZyhg4kNUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxP4ibDnMAOGEzFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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"
   */
  data: string;
}

export interface VoiceRemoteFileSchema {
  /**
   * MIME type of the attachment.
   * @default "audio/ogg; codecs=opus"
   */
  mimetype: object;
  /** @example "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus" */
  url: string;
}

export interface MessageVoiceRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  file: VoiceRemoteFileSchema | VoiceBinaryFileSchema;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /**
   * Convert the input file to the required format using ffmpeg before sending
   * @example true
   */
  convert: boolean;
  /** @default "default" */
  session: string;
}

export interface VideoRemoteFileSchema {
  /**
   * MIME type of the attachment.
   * @default "video/mp4"
   */
  mimetype: object;
  /**
   * Document file name. Optional
   * @default "video.mp4"
   */
  filename: object;
  /** @example "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4" */
  url: string;
}

export interface VideoBinaryFileSchema {
  /**
   * MIME type of the attachment.
   * @default "video/mp4"
   */
  mimetype: object;
  /**
   * Document file name. Optional
   * @default "video.mp4"
   */
  filename: object;
  /**
   * Base64-encoded data of the file
   * @example "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHYhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAciEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAgAaq3yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq7yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq/yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAjIetKI9/zIAAAAwAAAwAAAwAAAwAVW8H+swAAAwAAAwAAEvcAAAAgAatHyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAgAatLyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAhAatPyJf/AAADAAADAAADAAADAByn5+AAAAMAAAMABN2QAAAAIiHtiiNf5EAAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMCgiAAAAAhAavXyLf/AAADAAADAAADAAADAAADAAADAAADAAADAO6YAAAAIQGr28i3/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwDumAAAACEBq9/It/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMA7pgAAAAiIe/aIt+HAAADAAADAAADAAADAAADAAADAAADAAADAAmagAAAACEBrGfIl/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMBF3AAAAAhAaxryJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfSEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkAAAAhAaxvyJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwAAAAIQGsc8iX/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwEXcAAAAAEKIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHI="
   */
  data: string;
}

export interface MessageVideoRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  file: VideoRemoteFileSchema | VideoBinaryFileSchema;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /**
   * Send as video note (aka instant or round video).
   * @example false
   */
  asNote?: boolean;
  /**
   * Convert the input file to the required format using ffmpeg before sending
   * @example true
   */
  convert: boolean;
  /** @default "Just watch at this!" */
  caption?: string;
  /** @default "default" */
  session: string;
}

export interface FileURLSchema {
  /** @example "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg" */
  url?: string;
}

export interface FileContentSchema {
  /**
   * Base64-encoded data of the file
   * @example "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"
   */
  data?: string;
}

export interface LinkPreviewDataSchema {
  /** @example {"url":"https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"} */
  image?: FileURLSchema | FileContentSchema;
  /** @default "https://github.com/" */
  url: string;
  /** @default "Your Title" */
  title: string;
  /** @default "Check this out, amazing!" */
  description: string;
}

export interface MessageLinkCustomPreviewRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The text to send. MUST include the URL provided in preview.url
   * @default "Check this out! https://github.com/"
   */
  text: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /** @default true */
  linkPreviewHighQuality?: boolean;
  preview: LinkPreviewDataSchema;
  /** @default "default" */
  session: string;
}

export interface ButtonSchema {
  /** @example "Button Text" */
  text: string;
  /** @example "321321" */
  id?: string;
  /** @example "https://example.com" */
  url?: string;
  /** @example "+1234567890" */
  phoneNumber?: string;
  /** @example "4321" */
  copyCode?: string;
  /** @default "reply" */
  type: "reply" | "url" | "call" | "copy";
}

export interface SendButtonsRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /** @example "How are you?" */
  header: string;
  headerImage?: RemoteFileSchema | BinaryFileSchema;
  /** @example "Tell us how are you please 🙏" */
  body: string;
  /** @example "If you have any questions, please send it in the chat" */
  footer: string;
  /** @example [{"type":"reply","text":"I am good!"},{"type":"call","text":"Call us","phoneNumber":"+1234567890"},{"type":"copy","text":"Copy code","copyCode":"4321"},{"type":"url","text":"How did you do that?","url":"https://waha.devlike.pro"}] */
  buttons: ButtonSchema[];
  /** @default "default" */
  session: string;
}

export interface RowSchema {
  /** @example "Option 1" */
  title: string;
  /** @example "Description of option 1" */
  description?: string;
  /** @example "option1" */
  rowId: string;
}

export interface SectionSchema {
  /** @example "Menu" */
  title: string;
  /** @example [{"title":"Option 1","rowId":"option1","description":"First option"},{"title":"Option 2","rowId":"option2","description":"Second option"}] */
  rows: RowSchema[];
}

export interface SendListMessageSchema {
  /** @example "Example List" */
  title: string;
  /** @example "Choose one of the options" */
  description?: string;
  /** @example "Footer note" */
  footer?: string;
  /** @example "Select" */
  button: string;
  /** @example [{"title":"Section 1","rows":[{"title":"Option 1","rowId":"option1","description":"Description 1"},{"title":"Option 2","rowId":"option2","description":"Description 2"}]}] */
  sections: SectionSchema[];
}

export interface SendListRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /** @example {"title":"Simple Menu","description":"Please choose an option","footer":"Thank you!","button":"Choose","sections":[{"title":"Main","rows":[{"title":"Option 1","rowId":"option1","description":null},{"title":"Option 2","rowId":"option2","description":null},{"title":"Option 3","rowId":"option3","description":null}]}]} */
  message: SendListMessageSchema;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /** @default "default" */
  session: string;
}

export interface MessageForwardRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /** @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA" */
  messageId: string;
  /** @default "default" */
  session: string;
}

export interface SendSeenRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * @deprecated
   * @example null
   */
  messageId?: string;
  /** @example ["false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"] */
  messageIds?: string[];
  /**
   * NOWEB engine only - the ID of the user that sent the message (undefined for individual chats)
   * @default null
   * @example "11111111111@c.us"
   */
  participant?: string;
  /** @default "default" */
  session: string;
}

export interface ChatRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /** @default "default" */
  session: string;
}

export interface MessageReactionRequestSchema {
  /** @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA" */
  messageId: string;
  /**
   * Emoji to react with. Send an empty string to remove the reaction
   * @example "👍"
   */
  reaction: string;
  /** @default "default" */
  session: string;
}

export interface MessageStarRequestSchema {
  /** @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA" */
  messageId: string;
  /** @example "11111111111@c.us" */
  chatId: string;
  star: boolean;
  /** @default "default" */
  session: string;
}

export interface MessagePollSchema {
  /** @example "How are you?" */
  name: string;
  /** @example ["Awesome!","Good!","Not bad!"] */
  options: string[];
  /** @default false */
  multipleAnswers: object;
}

export interface MessagePollRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  poll: MessagePollSchema;
  /** @default "default" */
  session: string;
}

export interface MessagePollVoteRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The ID of the poll message. Format: {fromMe}_{chatID}_{messageId}[_{participant}] or just ID for GOWS
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  pollMessageId: string;
  /**
   * Only for Channels - server message id (if known); if omitted, API may look it up in the storage
   * @example null
   */
  pollServerId?: number;
  votes: string[][];
  /** @default "default" */
  session: string;
}

export interface MessageLocationRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /** @example 38.8937255 */
  latitude: number;
  /** @example -77.0969763 */
  longitude: number;
  /** @example "Our office" */
  title: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /** @default "default" */
  session: string;
}

export interface ContactSchema {
  /**
   * The full name of the contact
   * @example "John Doe"
   */
  fullName: string;
  /**
   * The organization of the contact
   * @example "Company Name"
   */
  organization?: string;
  /**
   * The phone number of the contact
   * @example "+91 11111 11111"
   */
  phoneNumber: string;
  /**
   * The whatsapp id of the contact. DO NOT add + or @c.us
   * @example "911111111111"
   */
  whatsappId?: string;
  /** @default null */
  vcard: string;
}

export interface VCardContactSchema {
  /**
   * The vcard string
   * @example "BEGIN:VCARD
   * VERSION:3.0
   * FN:Jane Doe
   * ORG:Company Name;
   * TEL;type=CELL;type=VOICE;waid=911111111111:+91 11111 11111
   * END:VCARD"
   */
  vcard: string;
}

export interface MessageContactVcardRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  contacts: (VCardContactSchema | ContactSchema)[];
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /** @default "default" */
  session: string;
}

export interface MessageButtonReplySchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  replyTo?: string;
  selectedDisplayText: string;
  selectedButtonID: string;
  /** @default "default" */
  session: string;
}

export interface WANumberExistResultSchema {
  /** @example "Chat id for the phone number. Undefined if the number does not exist" */
  chatId?: string;
  numberExists: boolean;
}

export interface MessageReplyRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  /** @default "Hi there!" */
  text: string;
  /** @default true */
  linkPreview?: boolean;
  /** @default false */
  linkPreviewHighQuality?: boolean;
  /** @default "default" */
  session: string;
}

export interface MessageLinkPreviewRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /** @default "default" */
  session: string;
  url: string;
  title: string;
}

export interface ChatSummarySchema {
  id: string;
  name: string | null;
  picture: string | null;
  lastMessage: object;
  _chat: object;
}

export interface OverviewPaginationParamsSchema {
  /** @default 20 */
  limit?: number;
  offset?: number;
}

export interface OverviewFilterSchema {
  /**
   * Filter by chat ids
   * @example ["111111111@c.us"]
   */
  ids?: string[];
}

export interface OverviewBodyRequestSchema {
  pagination: OverviewPaginationParamsSchema;
  filter: OverviewFilterSchema;
}

export interface ChatPictureResponseSchema {
  url: string;
}

export interface ReadChatMessagesResponseSchema {
  /** Messages IDs that have been read */
  ids?: string[];
}

export interface PinMessageRequestSchema {
  /**
   * Duration in seconds. 24 hours (86400), 7 days (604800), 30 days (2592000)
   * @example 86400
   */
  duration: number;
}

export interface EditMessageRequestSchema {
  /** @default "Hello, world!" */
  text: string;
  /** @default true */
  linkPreview?: boolean;
  /** @default false */
  linkPreviewHighQuality?: boolean;
}

export interface ChannelSchema {
  /**
   * Newsletter id
   * @example "123123123123@newsletter"
   */
  id: string;
  /**
   * Channel name
   * @example "Channel Name"
   */
  name: string;
  /**
   * Invite link
   * @example "https://www.whatsapp.com/channel/111111111111111111111111"
   */
  invite: string;
  /**
   * Preview for channel's picture
   * @example "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
   */
  preview?: string;
  /**
   * Channel's picture
   * @example "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
   */
  picture?: string;
  role: "OWNER" | "ADMIN" | "SUBSCRIBER" | "GUEST";
  description?: string;
  verified: boolean;
  subscribersCount: number;
}

export interface CreateChannelRequestSchema {
  /** @example "Channel Name" */
  name: string;
  /** @example "Channel Description" */
  description?: string;
  picture?: RemoteFileSchema | BinaryFileSchema;
}

export interface ChannelMessageSchema {
  /** @example {"👍":10,"❤️":5} */
  reactions: Record<string, number>;
  message: WAMessageSchema;
  viewCount: number;
}

export interface ChannelSearchByViewSchema {
  /** @default "RECOMMENDED" */
  view: string;
  /** @default ["US"] */
  countries: string[];
  /** @default [] */
  categories: string[];
  /** @default 50 */
  limit: number;
  /** @default "" */
  startCursor: string;
}

export interface ChannelPaginationSchema {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ChannelPublicInfoSchema {
  /**
   * Newsletter id
   * @example "123123123123@newsletter"
   */
  id: string;
  /**
   * Channel name
   * @example "Channel Name"
   */
  name: string;
  /**
   * Invite link
   * @example "https://www.whatsapp.com/channel/111111111111111111111111"
   */
  invite: string;
  /**
   * Preview for channel's picture
   * @example "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
   */
  preview?: string;
  /**
   * Channel's picture
   * @example "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
   */
  picture?: string;
  description?: string;
  verified: boolean;
  subscribersCount: number;
}

export interface ChannelListResultSchema {
  page: ChannelPaginationSchema;
  channels: ChannelPublicInfoSchema[];
}

export interface ChannelSearchByTextSchema {
  /** @default "Donald Trump" */
  text: string;
  /** @default [] */
  categories: string[];
  /** @default 50 */
  limit: number;
  /** @default "" */
  startCursor: string;
}

export interface ChannelViewSchema {
  value: string;
  name: string;
}

export interface ChannelCountrySchema {
  code: string;
  name: string;
}

export interface ChannelCategorySchema {
  value: string;
  name: string;
}

export interface TextStatusSchema {
  /**
   * Pre-generated status message id
   * @default null
   * @example "BBBBBBBBBBBBBBBBB"
   */
  id?: string;
  /**
   * Contact list to send the status to.
   * @example null
   */
  contacts?: string[];
  /** @default "Have a look! https://github.com/" */
  text: string;
  /** @default "#38b42f" */
  backgroundColor: string;
  /** @default 0 */
  font: number;
  /** @default true */
  linkPreview?: boolean;
  /** @default false */
  linkPreviewHighQuality?: boolean;
}

export interface ImageStatusSchema {
  /**
   * Pre-generated status message id
   * @default null
   * @example "BBBBBBBBBBBBBBBBB"
   */
  id?: string;
  /**
   * Contact list to send the status to.
   * @example null
   */
  contacts?: string[];
  file: RemoteFileSchema | BinaryFileSchema;
  caption?: string;
}

export interface VoiceStatusSchema {
  /**
   * Pre-generated status message id
   * @default null
   * @example "BBBBBBBBBBBBBBBBB"
   */
  id?: string;
  /**
   * Contact list to send the status to.
   * @example null
   */
  contacts?: string[];
  file: VoiceRemoteFileSchema | VoiceBinaryFileSchema;
  /**
   * Convert the input file to the required format using ffmpeg before sending
   * @example true
   */
  convert: boolean;
  /** @default "#38b42f" */
  backgroundColor: string;
}

export interface VideoStatusSchema {
  /**
   * Pre-generated status message id
   * @default null
   * @example "BBBBBBBBBBBBBBBBB"
   */
  id?: string;
  /**
   * Contact list to send the status to.
   * @example null
   */
  contacts?: string[];
  file: VideoRemoteFileSchema | VideoBinaryFileSchema;
  /**
   * Convert the input file to the required format using ffmpeg before sending
   * @example true
   */
  convert: boolean;
  caption?: string;
}

export interface DeleteStatusRequestSchema {
  /**
   * Status message id to delete
   * @default null
   * @example "AAAAAAAAAAAAAAAAA"
   */
  id?: string;
  /**
   * Contact list to send the status to.
   * @example null
   */
  contacts?: string[];
}

export interface NewMessageIDResponseSchema {
  /**
   * Pre-generated message id
   * @example "BBBBBBBBBBBBBBBBB"
   */
  id: string;
}

export interface LabelSchema {
  /**
   * Label ID
   * @example "1"
   */
  id: string;
  /**
   * Label name
   * @example "Lead"
   */
  name: string;
  /**
   * Color number, not hex
   * @example 0
   */
  color: number;
  /**
   * Color in hex
   * @example "#ff9485"
   */
  colorHex: string;
}

export interface LabelBodySchema {
  /**
   * Label name
   * @example "Lead"
   */
  name: string;
  /**
   * Color in hex
   * @example "#ff9485"
   */
  colorHex?: string;
  /**
   * Color number, not hex
   * @example null
   */
  color?: number;
}

export interface LabelIDSchema {
  /**
   * Label ID
   * @example "1"
   */
  id: string;
}

export interface SetLabelsRequestSchema {
  labels: LabelIDSchema[];
}

export interface ContactRequestSchema {
  /** @example "11111111111@c.us" */
  contactId: string;
  /** @default "default" */
  session: string;
}

export interface ContactUpdateBodySchema {
  /**
   * Contact First Name
   * @default "John"
   * @example "John"
   */
  firstName: string;
  /**
   * Contact Last Name
   * @default "Doe"
   * @example "Doe"
   */
  lastName: string;
}

export interface LidToPhoneNumberSchema {
  /**
   * Linked ID for the user
   * @example "1111111@lid"
   */
  lid?: string;
  /**
   * Phone number (chat id) for the user
   * @example "3333333@c.us"
   */
  pn?: string;
}

export interface CountResponseSchema {
  /** @default 0 */
  count: number;
}

export interface ParticipantSchema {
  /** @example "123456789@c.us" */
  id: string;
}

export interface CreateGroupRequestSchema {
  name: string;
  participants: ParticipantSchema[];
}

export interface JoinGroupRequestSchema {
  /**
   * Group code (123) or url (https://chat.whatsapp.com/123)
   * @example "https://chat.whatsapp.com/1234567890abcdef"
   */
  code: string;
}

export interface JoinGroupResponseSchema {
  /**
   * Group ID
   * @example "123@g.us"
   */
  id: string;
}

export interface DescriptionRequestSchema {
  description: string;
}

export interface SubjectRequestSchema {
  subject: string;
}

export interface SettingsSecurityChangeInfoSchema {
  /** @default true */
  adminsOnly: boolean;
}

export interface ParticipantsRequestSchema {
  participants: ParticipantSchema[];
}

export interface WAHASessionPresenceSchema {
  /**
   * Chat ID - either group id or contact id
   * @example "11111111111@c.us"
   */
  chatId: string;
  presence: "offline" | "online" | "typing" | "recording" | "paused";
}

export interface WAHAPresenceDataSchema {
  /**
   * Chat ID - participant or contact id
   * @example "11111111111@c.us"
   */
  participant: string;
  /** @example 1686568773 */
  lastSeen?: number;
  lastKnownPresence: "offline" | "online" | "typing" | "recording" | "paused";
}

export interface WAHAChatPresencesSchema {
  /**
   * Chat ID - either group id or contact id
   * @example "11111111111@c.us"
   */
  id: string;
  presences: WAHAPresenceDataSchema[];
}

export interface EventLocationSchema {
  /**
   * Name of the location
   * @example "Luxe Nail Studio 💅"
   */
  name: string;
}

export interface EventMessageSchema {
  /**
   * Name of the event
   * @example "John's Nail Appointment 💅"
   */
  name: string;
  /**
   * Description of the event
   * @example "It's time for your nail care session! 🌟\n\nYou'll be getting a *classic gel manicure* – clean, polished, and long-lasting. 💖\n\n📍 *Location:* Luxe Nail Studio\nWe're on the *2nd floor of the Plaza Mall*, next to the flower shop. Look for the *pink neon sign*!\n\nFeel free to arrive *5–10 mins early* so we can get started on time 😊"
   */
  description?: string;
  /**
   * Start time of the event (Unix timestamp in seconds)
   * @example 2063137000
   */
  startTime: number;
  /**
   * End time of the event (Unix timestamp in seconds)
   * @example null
   */
  endTime?: number;
  /** Location of the event */
  location?: EventLocationSchema;
  /**
   * Whether extra guests are allowed
   * @example false
   */
  extraGuestsAllowed?: boolean;
}

export interface EventMessageRequestSchema {
  /** @example "11111111111@c.us" */
  chatId: string;
  /**
   * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
   * @example null
   */
  reply_to?: string;
  event: EventMessageSchema;
}

export interface PingResponseSchema {
  /** @default "pong" */
  message: string;
}

export interface WAHAEnvironmentSchema {
  /** @example "YYYY.MM.BUILD" */
  version: string;
  /** @example "WEBJS" */
  engine: string;
  /** @example "PLUS" */
  tier: string;
  /** @example "/usr/path/to/bin/google-chrome" */
  browser: string;
}

export interface WorkerInfoSchema {
  /**
   * The worker ID.
   * @example "waha"
   */
  id: string;
}

export interface ServerStatusResponseSchema {
  /**
   * The timestamp when the server started (milliseconds).
   * @example 1723788847247
   */
  startTimestamp: number;
  /**
   * The uptime of the server in milliseconds.
   * @example 3600000
   */
  uptime: number;
  worker: WorkerInfoSchema;
}

export interface StopRequestSchema {
  /**
   * By default, it gracefully stops the server, but you can force it to terminate immediately.
   * @default false
   * @example false
   */
  force?: boolean;
}

export interface StopResponseSchema {
  /**
   * Always 'true' if the server is stopping.
   * @default true
   * @example true
   */
  stopping: boolean;
}

export interface VoiceFileDTOSchema {
  /**
   * The URL for the voice file
   * @example "https://github.com/devlikeapro/waha/raw/core/examples/voice.mp3"
   */
  url?: string;
  /**
   * Base64 content of the file
   * @example null
   */
  data?: string;
}

export interface VideoFileDTOSchema {
  /**
   * The URL for the video file
   * @example "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
   */
  url?: string;
  /**
   * Base64 content of the file
   * @example null
   */
  data?: string;
}

export interface ChatWootCommandsConfigSchema {
  /** @default true */
  server: boolean;
}

export interface ChatWootConversationsConfigSchema {
  sort:
    | "activity_newest"
    | "created_newest"
    | "created_oldest"
    | "activity_oldest";
  status: ("open" | "pending" | "snoozed" | "resolved")[] | null;
}

export interface ChatWootAppConfigSchema {
  url: string;
  accountId: number;
  accountToken: string;
  inboxId: number;
  inboxIdentifier: string;
  /** @default "OFF" */
  linkPreview?: "OFF" | "LG" | "HG";
  /** @default "en-US" */
  locale: string;
  templates?: object;
  commands?: ChatWootCommandsConfigSchema;
  conversations?: ChatWootConversationsConfigSchema;
}

export interface AppSchema {
  /**
   * Enable or disable this app without deleting it. If omitted, treated as enabled (true).
   * @default true
   */
  enabled?: boolean;
  id: string;
  session: string;
  app: "chatwoot";
  config: object;
}

export interface SessionStatusPointSchema {
  status: "STOPPED" | "STARTING" | "SCAN_QR_CODE" | "WORKING" | "FAILED";
  timestamp: number;
}

export interface WASessionStatusBodySchema {
  /** @example "default" */
  name: string;
  status: "STOPPED" | "STARTING" | "SCAN_QR_CODE" | "WORKING" | "FAILED";
  statuses: SessionStatusPointSchema[];
}

export interface WAHAWebhookSessionStatusSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the session status changes.
   * @default "session.status"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WASessionStatusBodySchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookMessageSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * Incoming message.
   * @default "message"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAMessageSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAReactionSchema {
  /** Reaction to the message. Either the reaction (emoji) or empty string to remove the reaction */
  text: string;
  /**
   * Message ID for the message to react to
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  messageId: string;
}

export interface WAMessageReactionSchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /**
   * Unix timestamp for when the message was created
   * @example 1666943582
   */
  timestamp: number;
  /**
   * ID for the Chat that this message was sent to, except if the message was sent by the current user
   * @example "11111111111@c.us"
   */
  from: string;
  /** Indicates if the message was sent by the current user */
  fromMe: boolean;
  /**
   * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
   * @example "api"
   */
  source: "api" | "app";
  /**
   *
   * * ID for who this message is for.
   * * If the message is sent by the current user, it will be the Chat to which the message is being sent.
   * * If the message is sent by another user, it will be the ID for the current user.
   * @example "11111111111@c.us"
   */
  to: string;
  /** For groups - participant who sent the message */
  participant: string;
  /** Reaction to the message. Either the reaction (emoji) or empty string to remove the reaction */
  reaction: WAReactionSchema;
}

export interface WAHAWebhookMessageReactionSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a user reacts or removes a reaction.
   * @default "message.reaction"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAMessageReactionSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookMessageAnySchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * Fired on all message creations, including your own.
   * @default "message.any"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAMessageSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAMessageAckBodySchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /** @example "11111111111@c.us" */
  from: string;
  /** @example "11111111111@c.us" */
  to: string;
  /** @example "11111111111@c.us" */
  participant: string;
  fromMe: boolean;
  ack: -1 | 0 | 1 | 2 | 3 | 4;
  ackName: string;
  _data?: object;
}

export interface WAHAWebhookMessageAckSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * Receive events when server or recipient gets the message, read or played it.
   * @default "message.ack"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAMessageAckBodySchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAMessageRevokedBodySchema {
  /**
   * ID of the message that was revoked
   * @example "A06CA7BB5DD8C8F705628CDB7E3A33C9"
   */
  revokedMessageId?: string;
  after?: WAMessageSchema;
  before?: WAMessageSchema;
  _data?: object;
}

export interface WAHAWebhookMessageRevokedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a user, whether it be you or any other participant, revokes a previously sent message.
   * @default "message.revoked"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAMessageRevokedBodySchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAMessageEditedBodySchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /**
   * Unix timestamp for when the message was created
   * @example 1666943582
   */
  timestamp: number;
  /**
   * ID for the Chat that this message was sent to, except if the message was sent by the current user
   * @example "11111111111@c.us"
   */
  from: string;
  /** Indicates if the message was sent by the current user */
  fromMe: boolean;
  /**
   * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
   * @example "api"
   */
  source: "api" | "app";
  /**
   *
   * * ID for who this message is for.
   * * If the message is sent by the current user, it will be the Chat to which the message is being sent.
   * * If the message is sent by another user, it will be the ID for the current user.
   * @example "11111111111@c.us"
   */
  to: string;
  /** For groups - participant who sent the message */
  participant: string;
  /** Message content */
  body: string;
  /** Indicates if the message has media available for download */
  hasMedia: boolean;
  /** Media object for the message if any and downloaded */
  media?: WAMediaSchema;
  /**
   * Use `media.url` instead! The URL for the media in the message if any
   * @deprecated
   * @example "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
   */
  mediaUrl: string;
  /** ACK status for the message */
  ack: -1 | 0 | 1 | 2 | 3 | 4;
  /** ACK status name for the message */
  ackName: string;
  /** If the message was sent to a group, this field will contain the user that sent the message. */
  author?: string;
  /** Location information contained in the message, if the message is type "location" */
  location?: WALocationSchema;
  /** List of vCards contained in the message. */
  vCards?: string[];
  /** Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend. */
  _data?: object;
  /**
   * ID of the original message that was edited
   * @example "A06CA7BB5DD8C8F705628CDB7E3A33C9"
   */
  editedMessageId?: string;
  replyTo?: ReplyToMessageSchema;
}

export interface WAHAWebhookMessageEditedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a user edits a previously sent message.
   * @default "message.edited"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAMessageEditedBodySchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface GroupParticipantSchema {
  /** @example "123456789@c.us" */
  id: string;
  /** @example "participant" */
  role: "left" | "participant" | "admin" | "superadmin";
}

export interface GroupInfoSchema {
  /** @example "123456789@g.us" */
  id: string;
  /** @example "Group Name" */
  subject: string;
  /** @example "Group Description" */
  description: string;
  /**
   * Invite URL
   * @example "https://chat.whatsapp.com/1234567890abcdef"
   */
  invite?: string;
  /** Members can add new members */
  membersCanAddNewMember: boolean;
  /** Members can send messages to the group */
  membersCanSendMessages: boolean;
  /** Admin approval required for new members */
  newMembersApprovalRequired: boolean;
  participants: GroupParticipantSchema[];
}

export interface GroupV2JoinEventSchema {
  /**
   * Unix timestamp
   * @example 1666943582
   */
  timestamp: number;
  group: GroupInfoSchema;
  _data: object;
}

export interface WebhookGroupV2JoinSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * When you joined or were added to a group
   * @default "group.v2.join"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: GroupV2JoinEventSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface GroupIdSchema {
  /** @example "123456789@g.us" */
  id: string;
}

export interface GroupV2LeaveEventSchema {
  /**
   * Unix timestamp
   * @example 1666943582
   */
  timestamp: number;
  group: GroupIdSchema;
  _data: object;
}

export interface WebhookGroupV2LeaveSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * When you left or were removed from a group
   * @default "group.v2.leave"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: GroupV2LeaveEventSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface GroupV2UpdateEventSchema {
  /**
   * Unix timestamp
   * @example 1666943582
   */
  timestamp: number;
  group: object;
  _data: object;
}

export interface WebhookGroupV2UpdateSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * When group info is updated
   * @default "group.v2.update"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: GroupV2UpdateEventSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface GroupV2ParticipantsEventSchema {
  /** Type of the event */
  type: "join" | "leave" | "promote" | "demote";
  /**
   * Unix timestamp
   * @example 1666943582
   */
  timestamp: number;
  group: GroupIdSchema;
  participants: GroupParticipantSchema[];
  _data: object;
}

export interface WebhookGroupV2ParticipantsSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * When participants changed - join, leave, promote to admin
   * @default "group.v2.participants"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: GroupV2ParticipantsEventSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookPresenceUpdateSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The most recent presence information for a chat.
   * @default "presence.update"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: WAHAChatPresencesSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface PollVoteSchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /**
   * Option that user has selected
   * @example ["Awesome!"]
   */
  selectedOptions: string[];
  /**
   * Timestamp, ms
   * @example 1692861369
   */
  timestamp: number;
  to: string;
  from: string;
  fromMe: boolean;
  participant?: string;
}

export interface MessageDestinationSchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  to: string;
  from: string;
  fromMe: boolean;
  participant?: string;
}

export interface PollVotePayloadSchema {
  vote: PollVoteSchema;
  poll: MessageDestinationSchema;
  _data?: object;
}

export interface WAHAWebhookPollVoteSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * With this event, you receive new votes for the poll sent.
   * @default "poll.vote"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: PollVotePayloadSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookPollVoteFailedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * There may be cases when it fails to decrypt a vote from the user. Read more about how to handle such events in the documentations.
   * @default "poll.vote.failed"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: PollVotePayloadSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface ChatArchiveEventSchema {
  /** @example "11111111111@c.us" */
  id: string;
  archived: boolean;
  timestamp: number;
}

export interface WAHAWebhookChatArchiveSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the chat is archived or unarchived
   * @default "chat.archive"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: ChatArchiveEventSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface CallDataSchema {
  /**
   * Call ID
   * @example "ABCDEFGABCDEFGABCDEFGABCDEFG"
   */
  id: string;
  /** @example "11111111111@c.us" */
  from?: string;
  timestamp: number;
  isVideo: boolean;
  isGroup: boolean;
}

export interface WAHAWebhookCallReceivedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the call is received by the user.
   * @default "call.received"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: CallDataSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookCallAcceptedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the call is accepted by the user.
   * @default "call.accepted"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: CallDataSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookCallRejectedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the call is rejected by the user.
   * @default "call.rejected"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: CallDataSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookLabelUpsertSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a label is created or updated
   * @default "label.upsert"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: LabelSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookLabelDeletedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a label is deleted
   * @default "label.deleted"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: LabelSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface LabelChatAssociationSchema {
  /**
   * Label ID
   * @example "1"
   */
  labelId: string;
  /**
   * Chat ID
   * @example "11111111111@c.us"
   */
  chatId: string;
  label: LabelSchema | null;
}

export interface WAHAWebhookLabelChatAddedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a label is added to a chat
   * @default "label.chat.added"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: LabelChatAssociationSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookLabelChatDeletedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when a label is deleted from a chat
   * @default "label.chat.deleted"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: LabelChatAssociationSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface EventResponseSchema {
  response: "UNKNOWN" | "GOING" | "NOT_GOING" | "MAYBE";
  timestampMs: number;
  extraGuestCount: number;
}

export interface EventResponsePayloadSchema {
  /**
   * Message ID
   * @example "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
   */
  id: string;
  /**
   * Unix timestamp for when the message was created
   * @example 1666943582
   */
  timestamp: number;
  /**
   * ID for the Chat that this message was sent to, except if the message was sent by the current user
   * @example "11111111111@c.us"
   */
  from: string;
  /** Indicates if the message was sent by the current user */
  fromMe: boolean;
  /**
   * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
   * @example "api"
   */
  source: "api" | "app";
  /**
   *
   * * ID for who this message is for.
   * * If the message is sent by the current user, it will be the Chat to which the message is being sent.
   * * If the message is sent by another user, it will be the ID for the current user.
   * @example "11111111111@c.us"
   */
  to: string;
  /** For groups - participant who sent the message */
  participant: string;
  /** Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend. */
  _data?: object;
  eventCreationKey: MessageDestinationSchema;
  eventResponse?: EventResponseSchema;
}

export interface WAHAWebhookEventResponseSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the event response is received.
   * @default "event.response"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: EventResponsePayloadSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookEventResponseFailedSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * The event is triggered when the event response is failed to decrypt.
   * @default "event.response.failed"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: EventResponsePayloadSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface EnginePayloadSchema {
  event: string;
  data: object;
}

export interface WAHAWebhookEngineEventSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * Internal engine event.
   * @default "engine.event"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: EnginePayloadSchema;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookGroupJoinSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * Some one join a group.
   * @deprecated
   * @default "group.join"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: object;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookGroupLeaveSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * Some one left a group.
   * @deprecated
   * @default "group.leave"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: object;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}

export interface WAHAWebhookStateChangeSchema {
  /**
   * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
   * @example "evt_01aaaaaaaaaaaaaaaaaaaaaaaa"
   */
  id: string;
  /**
   * Unix timestamp (ms) for when the event was created.
   * @example 1634567890123
   */
  timestamp: number;
  /** @example "default" */
  session: string;
  /**
   * Metadata for the session.
   * @example {"user.id":"123","user.email":"email@example.com"}
   */
  metadata?: MapSchema;
  /** @example "WEBJS" */
  engine: "WEBJS" | "NOWEB" | "GOWS";
  /**
   * It’s an internal engine’s state, not session status.
   * @deprecated
   * @default "state.change"
   */
  event:
    | "session.status"
    | "message"
    | "message.reaction"
    | "message.any"
    | "message.ack"
    | "message.waiting"
    | "message.revoked"
    | "message.edited"
    | "state.change"
    | "group.join"
    | "group.leave"
    | "group.v2.join"
    | "group.v2.leave"
    | "group.v2.update"
    | "group.v2.participants"
    | "presence.update"
    | "poll.vote"
    | "poll.vote.failed"
    | "chat.archive"
    | "call.received"
    | "call.accepted"
    | "call.rejected"
    | "label.upsert"
    | "label.deleted"
    | "label.chat.added"
    | "label.chat.deleted"
    | "event.response"
    | "event.response.failed"
    | "engine.event";
  payload: object;
  me?: MeInfoSchema;
  environment: WAHAEnvironmentSchema;
}
