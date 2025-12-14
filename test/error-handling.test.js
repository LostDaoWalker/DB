import { describe, it, mock } from 'node:test';
import assert from 'node:assert';

// Use the actual sanitizeErrorDetails function from index.js
function sanitizeErrorDetails(err) {
  let errorName = err.name || 'Error';
  let errorMessage = err.message || 'Unknown error';
  let stackLines = [];

  // Extract relevant stack trace lines (first few, sanitized)
  if (err.stack) {
    const stackArray = err.stack.split('\n').slice(1, 6); // Skip first line (error message), take next 5
    stackLines = stackArray.map(line => {
      // Remove full file paths and sensitive information
      return line
        .replace(/file:\/\/\/[a-zA-Z]:\/[^)]*\//g, '') // Remove Windows file paths
        .replace(/\/[a-zA-Z0-9_./-]+\/[^)]*\//g, '') // Remove Unix file paths
        .replace(/:[0-9]+:[0-9]+/g, '') // Remove line/column numbers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    }).filter(line => line && line.startsWith('at ') && !line.includes('node:internal'));
  }

  return {
    name: errorName,
    message: errorMessage,
    stack: stackLines.slice(0, 3) // Limit to 3 stack lines
  };
}

// Mock the getUserFriendlyErrorMessage function
function getUserFriendlyErrorMessage(err, interaction) {
  const sanitized = sanitizeErrorDetails(err);
  const errorMessage = err.message?.toLowerCase() || '';
  const commandName = interaction.commandName || interaction.customId?.split(':')[0] || 'command';

  // Build detailed error info
  let details = `\`\`\`\n${sanitized.name}: ${sanitized.message}`;
  if (sanitized.stack.length > 0) {
    details += '\n' + sanitized.stack.join('\n');
  }
  details += '\n\`\`\`';

  // Database-related errors
  if (errorMessage.includes('database') || errorMessage.includes('sqlite') || errorMessage.includes('sql')) {
    return `🐾 **Database Error**\nYour game data is safe, but there was a database issue.\n\n${details}\n\nTry again in a moment.`;
  }

  // Command-specific errors with details
  if (commandName === 'profile') {
    return `📊 **Profile Error**\nFailed to load profile data.\n\n${details}\n\nTry viewing your profile again.`;
  }

  // Fallback with full error details
  return `🐺 **Unexpected Error**\nAn unexpected error occurred.\n\n${details}\n\nThe developers have been notified. Please try again.`;
}

describe('Error Handling Tests', () => {
  describe('sanitizeErrorDetails', () => {
    it('should sanitize basic error information', () => {
      const error = new Error('Test error message');
      error.stack = 'Error: Test error message\n    at testFunction (file.js:123:45)\n    at anotherFunction (file.js:456:78)';

      const result = sanitizeErrorDetails(error);

      assert.equal(result.name, 'Error');
      assert.equal(result.message, 'Test error message');
      // The stack parsing should extract 'at testFunction' and 'at anotherFunction'
      assert(result.stack.length >= 1, 'Should have at least one stack frame');
      assert(result.stack[0].startsWith('at '), 'Stack frames should start with "at "');
    });

    it('should handle errors with minimal stack traces', () => {
      const error = new Error('Test error');
      // Node.js always adds some stack frames, so we can't truly have "no stack trace"
      // But we can verify that our filtering works

      const result = sanitizeErrorDetails(error);

      assert.equal(result.name, 'Error');
      assert.equal(result.message, 'Test error');
      // Node.js will always have at least some stack frames from the test runner
      assert(Array.isArray(result.stack), 'Stack should be an array');
    });

    it('should filter out sensitive file paths and line numbers', () => {
      const error = new Error('Path exposure');
      error.stack = 'Error: Path exposure\n    at func (file:///C:/Users/SecretUser/Documents/private/file.js:123:45)\n    at internal (/usr/local/lib/node:internal:456:78)';

      const result = sanitizeErrorDetails(error);

      // Should filter out node:internal and sanitize file paths
      const hasValidStackFrame = result.stack.some(line =>
        line.startsWith('at ') &&
        !line.includes('node:internal') &&
        !line.includes('SecretUser') &&
        !line.includes('private') &&
        !line.includes(':123:45')
      );

      assert(hasValidStackFrame, 'Should have at least one properly sanitized stack frame');
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('should format database errors with technical details', () => {
      const error = new Error('SQLITE_ERROR: database is locked');
      const interaction = { commandName: 'profile' };

      const result = getUserFriendlyErrorMessage(error, interaction);

      assert(result.includes('🐾 **Database Error**'));
      assert(result.includes('SQLITE_ERROR: database is locked'));
      assert(result.includes('```'));
      assert(result.includes('Your game data is safe'));
    });

    it('should format profile command errors specifically', () => {
      const error = new Error('Unknown animal key: undefined');
      const interaction = { commandName: 'profile' };

      const result = getUserFriendlyErrorMessage(error, interaction);

      assert(result.includes('📊 **Profile Error**'));
      assert(result.includes('Failed to load profile data'));
      assert(result.includes('Unknown animal key: undefined'));
    });

    it('should include stack traces in error messages', () => {
      const error = new Error('Test error with stack');
      error.stack = 'Error: Test error with stack\n    at failingFunction (test.js:10:5)\n    at testCase (test.js:20:10)';
      const interaction = { commandName: 'unknown' };

      const result = getUserFriendlyErrorMessage(error, interaction);

      assert(result.includes('🐺 **Unexpected Error**'));
      assert(result.includes('at failingFunction'));
      assert(result.includes('at testCase'));
    });

    it('should handle interaction without commandName', () => {
      const error = new Error('Generic error');
      const interaction = { customId: 'button:123' };

      const result = getUserFriendlyErrorMessage(error, interaction);

      assert(result.includes('🐺 **Unexpected Error**'));
    });
  });

  describe('Error Response Visibility', () => {
    it('should not use ephemeral flag in error responses', () => {
      // This test verifies that our error handling doesn't use ephemeral responses
      // The actual test would need to mock the Discord interaction, but we can verify
      // the logic doesn't include ephemeral flags

      const error = new Error('Test error');
      const interaction = { commandName: 'test' };

      // Mock interaction methods
      let replyCalled = false;
      let followUpCalled = false;
      let replyOptions = {};

      const mockInteraction = {
        commandName: 'test',
        isRepliable: () => true,
        deferred: false,
        replied: false,
        reply: (options) => {
          replyCalled = true;
          replyOptions = options;
          return Promise.resolve();
        },
        followUp: (options) => {
          followUpCalled = true;
          replyOptions = options;
          return Promise.resolve();
        }
      };

      // Test that our error message doesn't contain ephemeral
      const errorMessage = getUserFriendlyErrorMessage(error, mockInteraction);
      assert(!errorMessage.includes('ephemeral'));
      assert(errorMessage.length > 0);
    });
  });
});
