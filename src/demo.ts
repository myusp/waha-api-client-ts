/**
 * Demo: WAHA API Client Usage Examples
 * 
 * This file demonstrates all the key features of the WAHA API client:
 * 1. Default configuration setup
 * 2. Config override per request
 * 3. Multiple session handling
 * 4. All available API methods
 */

import { WAHAClient } from './client';

console.log('='.repeat(60));
console.log('WAHA API Client - Complete Feature Demonstration');
console.log('='.repeat(60));

// ============================================================================
// 1. DEFAULT CONFIGURATION SETUP
// ============================================================================
console.log('\n1. INITIALIZING CLIENT WITH DEFAULT CONFIGURATION');
console.log('-'.repeat(60));

const client = new WAHAClient({
  baseURL: 'https://waha.example.com',
  apiKey: 'your-api-key-here',
  session: 'default',           // Default session
  timeout: 30000,                // 30 seconds timeout
  retryAttempts: 3,              // Retry 3 times on failure
  retryDelay: 1000,              // 1 second delay between retries
});

console.log('✓ Client initialized with:');
console.log('  - baseURL: https://waha.example.com');
console.log('  - apiKey: your-api-key-here');
console.log('  - session: default');
console.log('  - timeout: 30000ms');
console.log('  - retryAttempts: 3');
console.log('  - retryDelay: 1000ms');

// ============================================================================
// 2. USING DEFAULT CONFIGURATION
// ============================================================================
console.log('\n2. USING DEFAULT CONFIGURATION');
console.log('-'.repeat(60));
console.log('Sending text with default session and config...');
console.log('Code:');
console.log(`
  await client.sendText({
    chatId: '1234567890@c.us',
    text: 'Hello from default session!',
  });
`);
console.log('→ Will use session: "default" (from initial config)');
console.log('→ Will use timeout: 30000ms (from initial config)');
console.log('→ Will use retryAttempts: 3 (from initial config)');

// ============================================================================
// 3. CONFIG OVERRIDE - DIFFERENT SESSION
// ============================================================================
console.log('\n3. CONFIG OVERRIDE - DIFFERENT SESSION');
console.log('-'.repeat(60));
console.log('Sending text with custom session override...');
console.log('Code:');
console.log(`
  await client.sendText({
    chatId: '1234567890@c.us',
    text: 'Hello from custom session!',
    config: {
      session: 'business-account',
    },
  });
`);
console.log('→ Will use session: "business-account" (OVERRIDDEN)');
console.log('→ Will use timeout: 30000ms (from initial config)');
console.log('→ Will use retryAttempts: 3 (from initial config)');

// ============================================================================
// 4. CONFIG OVERRIDE - MULTIPLE PARAMETERS
// ============================================================================
console.log('\n4. CONFIG OVERRIDE - MULTIPLE PARAMETERS');
console.log('-'.repeat(60));
console.log('Sending text with multiple config overrides...');
console.log('Code:');
console.log(`
  await client.sendText({
    chatId: '1234567890@c.us',
    text: 'Important message with custom settings',
    config: {
      session: 'vip-account',
      timeout: 60000,
      retryAttempts: 5,
      retryDelay: 2000,
    },
  });
`);
console.log('→ Will use session: "vip-account" (OVERRIDDEN)');
console.log('→ Will use timeout: 60000ms (OVERRIDDEN)');
console.log('→ Will use retryAttempts: 5 (OVERRIDDEN)');
console.log('→ Will use retryDelay: 2000ms (OVERRIDDEN)');

// ============================================================================
// 5. AVAILABLE API METHODS
// ============================================================================
console.log('\n5. ALL AVAILABLE API METHODS');
console.log('-'.repeat(60));

const methods = [
  {
    category: 'Messaging',
    methods: [
      { name: 'sendText()', desc: 'Send text message' },
      { name: 'sendImage()', desc: 'Send image with caption' },
      { name: 'sendFile()', desc: 'Send file with caption' },
    ],
  },
  {
    category: 'Session Management',
    methods: [
      { name: 'getSession()', desc: 'Get session information' },
      { name: 'startSession()', desc: 'Start a new session' },
      { name: 'stopSession()', desc: 'Stop a session' },
      { name: 'getSessions()', desc: 'Get all sessions' },
    ],
  },
  {
    category: 'Chat Operations',
    methods: [
      { name: 'getChats()', desc: 'Get chats for a session' },
      { name: 'getMessages()', desc: 'Get messages from a chat' },
    ],
  },
  {
    category: 'Contact Operations',
    methods: [
      { name: 'checkNumberStatus()', desc: 'Check if number is on WhatsApp' },
    ],
  },
];

methods.forEach(({ category, methods: categoryMethods }) => {
  console.log(`\n${category}:`);
  categoryMethods.forEach(({ name, desc }) => {
    console.log(`  • ${name.padEnd(25)} - ${desc}`);
  });
});

// ============================================================================
// 6. PRACTICAL USE CASES
// ============================================================================
console.log('\n6. PRACTICAL USE CASES');
console.log('-'.repeat(60));

console.log('\nUse Case A: Multi-Account Business');
console.log('  Scenario: Managing personal and business WhatsApp accounts');
console.log('  Code:');
console.log(`
    // Send from personal account (default)
    await client.sendText({
      chatId: 'friend@c.us',
      text: 'Hey! How are you?',
    });
    
    // Send from business account
    await client.sendText({
      chatId: 'customer@c.us',
      text: 'Thank you for your order!',
      config: { session: 'business' },
    });
  `);

console.log('\nUse Case B: Critical Messages with Extra Retries');
console.log('  Scenario: Sending payment confirmation that must be delivered');
console.log('  Code:');
console.log(`
    await client.sendText({
      chatId: 'customer@c.us',
      text: 'Your payment has been confirmed!',
      config: {
        retryAttempts: 10,
        retryDelay: 5000,
      },
    });
  `);

console.log('\nUse Case C: Quick Fire-and-Forget Messages');
console.log('  Scenario: Sending notifications with no retries');
console.log('  Code:');
console.log(`
    await client.sendText({
      chatId: 'user@c.us',
      text: 'Server is up!',
      config: {
        retryAttempts: 0,
        timeout: 5000,
      },
    });
  `);

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log('\n✓ Default configuration set on initialization');
console.log('✓ Config override available on every API call');
console.log('✓ Override parameters: session, timeout, retryAttempts, retryDelay');
console.log('✓ 11 API methods implemented');
console.log('✓ Automatic retry logic with configurable delays');
console.log('✓ Full TypeScript support with type definitions');
console.log('\nReady to use! 🚀');
console.log('='.repeat(60) + '\n');
