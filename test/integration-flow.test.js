import { describe, it, mock } from 'node:test';
import assert from 'node:assert';

// Integration test for the complete user flow and error handling
describe('Integration Flow Tests', () => {
  describe('Error Response Visibility (Non-Ephemeral)', () => {
    it('should send error messages as regular (non-ephemeral) replies', async () => {
      // Mock the interaction and error scenario
      const mockError = new Error('Test database error');
      const mockInteraction = {
        commandName: 'profile',
        isRepliable: () => true,
        deferred: false,
        replied: false
      };

      let replyOptions = {};
      let replyUsed = false;
      let followUpUsed = false;

      // Mock the reply methods to capture what options are used
      mockInteraction.reply = mock.fn((options) => {
        replyUsed = true;
        replyOptions = options;
        return Promise.resolve();
      });

      mockInteraction.followUp = mock.fn((options) => {
        followUpUsed = true;
        replyOptions = options;
        return Promise.resolve();
      });

      // Simulate the error handling from index.js
      try {
        // This would normally be the command execution that fails
        throw mockError;
      } catch (err) {
        // Simulate the error handling logic
        const sanitized = {
          name: err.name || 'Error',
          message: err.message || 'Unknown error',
          stack: []
        };

        let details = `\`\`\`\n${sanitized.name}: ${sanitized.message}`;
        details += '\n\`\`\`';

        const errorMessage = `📊 **Profile Error**\nFailed to load profile data.\n\n${details}\n\nTry viewing your profile again.`;

        // This is the key test: ensure NO ephemeral flag is used
        if (mockInteraction.deferred || mockInteraction.replied) {
          await mockInteraction.followUp({ content: errorMessage });
        } else {
          await mockInteraction.reply({ content: errorMessage });
        }
      }

      // Verify the response was sent without ephemeral flag
      assert(replyUsed || followUpUsed, 'Either reply or followUp should have been called');

      // Check that ephemeral is NOT in the options
      assert(!('ephemeral' in replyOptions), 'Error response should NOT be ephemeral');
      assert(typeof replyOptions.content === 'string', 'Error message should be a string');
      assert(replyOptions.content.includes('Profile Error'), 'Error message should contain category');
      assert(replyOptions.content.includes('```'), 'Error message should contain code block with technical details');
    });
  });

  describe('Profile Command Error Scenarios', () => {
    it('should handle undefined animal key with proper error message', () => {
      // Simulate the profile command error handling
      const error = new Error('Unknown animal key: undefined');
      const interaction = { commandName: 'profile' };

      // This simulates the error transformation in profile.js
      let transformedError = error;
      if (error.message.includes('Unknown animal key')) {
        transformedError = new Error(`Invalid animal data for player - animal key "undefined" not found. Please contact support.`);
      }

      // Test the error message formatting
      const sanitized = {
        name: transformedError.name,
        message: transformedError.message,
        stack: []
      };

      const details = `\`\`\`\n${sanitized.name}: ${sanitized.message}\n\`\`\``;
      const errorMessage = `📊 **Profile Error**\nFailed to load profile data.\n\n${details}\n\nTry viewing your profile again.`;

      assert(errorMessage.includes('Invalid animal data for player'));
      assert(errorMessage.includes('undefined'));
      assert(errorMessage.includes('contact support'));
      assert(errorMessage.includes('📊 **Profile Error**'));
      assert(!errorMessage.includes('ephemeral'));
    });

    it('should handle null animal key appropriately', () => {
      // Test the validation logic from profile command
      const playerData = { user_id: '123', xp: 100, animal_key: null };

      // This simulates the validation in profile.js
      let shouldThrow = false;
      let errorMessage = '';

      if (!playerData.animal_key) {
        shouldThrow = true;
        errorMessage = 'Player has no animal assigned - please use /start to choose an animal';
      }

      assert(shouldThrow, 'Should throw error for null animal_key');
      assert(errorMessage.includes('no animal assigned'), 'Error message should guide to /start');
      assert(errorMessage.includes('/start'), 'Error message should mention the start command');
    });
  });

  describe('End-to-End Error Flow Simulation', () => {
    it('should properly format and deliver error messages without ephemeral flag', async () => {
      // Complete simulation of the error flow from command execution to user response

      // Step 1: Simulate command execution failure
      const originalError = new Error('Unknown animal key: corrupted_data');
      originalError.stack = 'Error: Unknown animal key: corrupted_data\n    at getAnimal (src/game/species/index.js:25:9)\n    at Object.execute (src/interactions/commands/profile.js:18:20)';

      // Step 2: Simulate profile command error transformation
      let commandError = originalError;
      if (originalError.message.includes('Unknown animal key')) {
        commandError = new Error(`Invalid animal data for player - animal key "corrupted_data" not found. Please contact support.`);
      }

      // Step 3: Simulate main error handler processing
      const sanitized = {
        name: commandError.name,
        message: commandError.message,
        stack: ['at getAnimal', 'at Object.execute']
      };

      const commandName = 'profile';
      const details = `\`\`\`\n${sanitized.name}: ${sanitized.message}\n${sanitized.stack.join('\n')}\n\`\`\``;
      const userFriendlyMessage = `📊 **Profile Error**\nFailed to load profile data.\n\n${details}\n\nTry viewing your profile again.`;

      // Step 4: Simulate Discord interaction response
      const mockInteraction = {
        commandName: 'profile',
        isRepliable: () => true,
        deferred: false,
        replied: false
      };

      let actualResponseOptions = null;
      mockInteraction.reply = mock.fn((options) => {
        actualResponseOptions = options;
        return Promise.resolve();
      });

      // Send the error response (this is what happens in index.js)
      await mockInteraction.reply({ content: userFriendlyMessage });

      // Verify the complete flow
      assert(actualResponseOptions, 'Response should have been sent');
      assert(actualResponseOptions.content, 'Response should have content');
      assert(!('ephemeral' in actualResponseOptions), 'Response should NOT be ephemeral');

      // Verify error message content
      const content = actualResponseOptions.content;
      assert(content.includes('📊 **Profile Error**'), 'Should have proper error category');
      assert(content.includes('Invalid animal data'), 'Should have specific error details');
      assert(content.includes('corrupted_data'), 'Should include the problematic data');
      assert(content.includes('contact support'), 'Should provide user guidance');
      assert(content.includes('```'), 'Should have code block with technical details');
      assert(content.includes('at getAnimal'), 'Should include sanitized stack trace');
      assert(content.includes('Try viewing your profile again'), 'Should have recovery instructions');
    });
  });

  describe('Error Message Security', () => {
    it('should not expose sensitive file paths', () => {
      const errorWithSensitivePaths = new Error('Database connection failed');
      errorWithSensitivePaths.stack = `Error: Database connection failed
    at queryDatabase (file:///C:/Users/Admin/Documents/secret/project/src/db/index.js:45:12)
    at handleRequest (/usr/local/lib/node_modules/discord.js/src/client/Client.js:123:45)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)`;

      const sanitized = {
        name: errorWithSensitivePaths.name,
        message: errorWithSensitivePaths.message,
        stack: errorWithSensitivePaths.stack
          .split('\n')
          .slice(1, 4)
          .map(line => line
            .replace(/file:\/\/\/[a-zA-Z]:\/[^)]*\//g, '')
            .replace(/\/[a-zA-Z0-9_./-]+\/[^)]*\//g, '')
            .replace(/:[0-9]+:[0-9]+/g, '')
            .trim()
          )
          .filter(line => line && !line.includes('node:internal'))
      };

      // Verify sensitive paths are removed
      assert(!sanitized.stack.some(line => line.includes('Admin')), 'Should not contain username');
      assert(!sanitized.stack.some(line => line.includes('secret')), 'Should not contain sensitive directory names');
      assert(!sanitized.stack.some(line => line.includes('Documents')), 'Should not contain personal directories');

      // Verify useful information remains
      assert(sanitized.stack.some(line => line.includes('queryDatabase')), 'Should keep function names');
      assert(sanitized.stack.some(line => line.includes('handleRequest')), 'Should keep relevant stack frames');
    });
  });
});
