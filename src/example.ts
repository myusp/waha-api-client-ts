/**
 * Example usage of WAHA API Client
 */

import { WAHAClient } from './client';

// Example: Initialize client with default configuration
const client = new WAHAClient({
  baseURL: 'https://waha.example.com',
  apiKey: 'your-api-key-here',
  session: 'default',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
});

// Example function demonstrations
async function examples() {
  try {
    console.log('WAHA API Client Examples\n');

    // Example 1: Send text message with default session
    console.log('1. Sending text message with default session...');
    /*
    const textResponse = await client.sendText({
      chatId: '1234567890@c.us',
      text: 'Hello from WAHA API Client!',
    });
    console.log('Text sent:', textResponse);
    */

    // Example 2: Send text message with custom session override
    console.log('\n2. Sending text message with custom session override...');
    /*
    const textWithOverride = await client.sendText({
      chatId: '1234567890@c.us',
      text: 'Hello from a different session!',
      config: {
        session: 'custom-session',
        timeout: 60000,
        retryAttempts: 5,
      },
    });
    console.log('Text sent with override:', textWithOverride);
    */

    // Example 3: Send image
    console.log('\n3. Sending image...');
    /*
    const imageResponse = await client.sendImage({
      chatId: '1234567890@c.us',
      file: 'https://example.com/image.jpg',
      caption: 'Check out this image!',
    });
    console.log('Image sent:', imageResponse);
    */

    // Example 4: Send file with retry configuration
    console.log('\n4. Sending file with custom retry configuration...');
    /*
    const fileResponse = await client.sendFile({
      chatId: '1234567890@c.us',
      file: 'https://example.com/document.pdf',
      filename: 'document.pdf',
      caption: 'Important document',
      config: {
        retryAttempts: 5,
        retryDelay: 2000,
      },
    });
    console.log('File sent:', fileResponse);
    */

    // Example 5: Get session info
    console.log('\n5. Getting session info...');
    /*
    const sessionInfo = await client.getSession();
    console.log('Session info:', sessionInfo);
    */

    // Example 6: Get session info for a different session
    console.log('\n6. Getting info for a different session...');
    /*
    const otherSessionInfo = await client.getSession({
      session: 'other-session',
    });
    console.log('Other session info:', otherSessionInfo);
    */

    // Example 7: Start a session
    console.log('\n7. Starting a session...');
    /*
    const startedSession = await client.startSession();
    console.log('Session started:', startedSession);
    */

    // Example 8: Get all sessions
    console.log('\n8. Getting all sessions...');
    /*
    const allSessions = await client.getSessions();
    console.log('All sessions:', allSessions);
    */

    // Example 9: Get chats
    console.log('\n9. Getting chats...');
    /*
    const chats = await client.getChats();
    console.log('Chats:', chats);
    */

    // Example 10: Get messages from a chat
    console.log('\n10. Getting messages from a chat...');
    /*
    const messages = await client.getMessages('1234567890@c.us');
    console.log('Messages:', messages);
    */

    // Example 11: Check if number is on WhatsApp
    console.log('\n11. Checking number status...');
    /*
    const numberStatus = await client.checkNumberStatus('1234567890');
    console.log('Number status:', numberStatus);
    */

    // Example 12: Safe send text (checks number first)
    console.log('\n12. Safe send text message...');
    /*
    const safeSendResult = await client.safeSendText({
      chatId: '1234567890@c.us',
      text: 'Hello! This will only be sent if number exists on WhatsApp.',
    });
    
    if (safeSendResult === null) {
      console.log('Number does not exist on WhatsApp - message not sent');
    } else {
      console.log('Message sent successfully:', safeSendResult);
    }
    */

    // Example 13: Safe send image (checks number first)
    console.log('\n13. Safe send image...');
    /*
    const safeSendImageResult = await client.safeSendImage({
      chatId: '1234567890@c.us',
      file: 'https://example.com/image.jpg',
      caption: 'Safe send image!',
    });
    
    if (safeSendImageResult === null) {
      console.log('Number does not exist on WhatsApp - image not sent');
    } else {
      console.log('Image sent successfully:', safeSendImageResult);
    }
    */

    // Example 14: Safe send file (checks number first)
    console.log('\n14. Safe send file...');
    /*
    const safeSendFileResult = await client.safeSendFile({
      chatId: '1234567890@c.us',
      file: 'https://example.com/document.pdf',
      filename: 'document.pdf',
      caption: 'Safe send document',
    });
    
    if (safeSendFileResult === null) {
      console.log('Number does not exist on WhatsApp - file not sent');
    } else {
      console.log('File sent successfully:', safeSendFileResult);
    }
    */

    console.log('\n✓ All examples completed successfully!');
    console.log('\nNote: Examples are commented out to avoid making actual API calls.');
    console.log('Uncomment the examples you want to test with your WAHA API instance.');
    
  } catch (error) {
    console.error('Error in examples:', error);
  }
}

// Run examples
examples();
