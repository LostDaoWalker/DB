import { describe, it } from 'node:test';
import assert from 'node:assert';

// Simple mock function implementation
const mock = {
  fn: () => {
    const calls = [];
    const mockFn = (...args) => {
      calls.push({ arguments: args });
      return undefined;
    };
    mockFn.calls = calls;
    mockFn.callCount = () => calls.length;
    return mockFn;
  }
};

// Create mock functions that can be configured per test
let mockGetPlayer = () => null;
let mockGetAnimal = () => ({});
let mockGetStats = () => ({});
let mockLevelFromXp = () => ({ level: 1, xpIntoLevel: 0 });

// Create mock objects that behave like Node.js test mocks
const createMock = (defaultImpl) => {
  let implementation = defaultImpl;
  const mock = (...args) => implementation(...args);
  mock.mockReturnValue = (value) => { implementation = () => value; return mock; };
  mock.mockImplementation = (fn) => { implementation = fn; return mock; };
  return mock;
};

// Reset mocks between tests
function resetMocks() {
  mockGetPlayer = createMock(() => null);
  mockGetAnimal = createMock(() => ({}));
  mockGetStats = createMock(() => ({}));
  mockLevelFromXp = createMock(() => ({ level: 1, xpIntoLevel: 0 }));
}

// Mock the profile command logic
function createProfileCommand() {
  return {
    data: { name: 'profile', description: 'View animal stats.' },

    async execute(interaction) {
      const getPlayer = mockGetPlayer;
      const getAnimal = mockGetAnimal;
      const getStats = mockGetStats;
      const levelFromXp = mockLevelFromXp;

      const p = getPlayer(interaction.user.id);
      if (!p) {
        await interaction.reply('No animal chosen. Use `/start`.');
        return;
      }

      // Validate animal key exists and is valid
      if (!p.animal_key) {
        throw new Error('Player has no animal assigned - please use /start to choose an animal');
      }

      let animal, stats;
      try {
        const { level, xpIntoLevel } = levelFromXp(p.xp);
        const next = xpForNext(level);
        animal = getAnimal(p.animal_key);
        stats = getStats(p.animal_key, level);

        await interaction.reply({
          embeds: [{
            title: `🦊 ${animal.name}`,
            description: `Level ${level}\n${xpIntoLevel}/${next} XP\n\n${animal.passive}`,
            fields: [{
              name: 'Stats',
              value: `${stats.hp} HP • ${stats.atk} ATK • ${stats.def} DEF • ${stats.spd} SPD`
            }]
          }]
        });
      } catch (err) {
        if (err.message.includes('Unknown animal key')) {
          throw new Error(`Invalid animal data for player - animal key "${p.animal_key}" not found. Please contact support.`);
        }
        throw err;
      }
    }
  };
}

function xpForNext(level) {
  return Math.floor(level * 10 + Math.pow(level, 1.5));
}

describe('Profile Command Tests', () => {
  const profileCommand = createProfileCommand();

  describe('execute method', () => {
    it('should reply with error when no player exists', async () => {
      // Setup mocks
      mockGetPlayer.mockReturnValue(null);

      const mockInteraction = {
        user: { id: '123' },
        reply: mock.fn()
      };

      await profileCommand.execute(mockInteraction);

      assert.equal(mockInteraction.reply.callCount(), 1);
      assert.equal(mockInteraction.reply.calls[0].arguments[0], 'No animal chosen. Use `/start`.');
    });

    it('should throw error when player has no animal_key', async () => {
      // Setup mocks
      mockGetPlayer.mockReturnValue({ user_id: '123', xp: 100, animal_key: null });

      const mockInteraction = {
        user: { id: '123' }
      };

      await assert.rejects(
        () => profileCommand.execute(mockInteraction),
        /Player has no animal assigned/
      );
    });

    it('should throw error when player has undefined animal_key', async () => {
      // Setup mocks
      mockGetPlayer.mockReturnValue({ user_id: '123', xp: 100, animal_key: undefined });

      const mockInteraction = {
        user: { id: '123' }
      };

      await assert.rejects(
        () => profileCommand.execute(mockInteraction),
        /Player has no animal assigned/
      );
    });

    it('should handle unknown animal key error gracefully', async () => {
      // Setup mocks
      mockGetPlayer.mockReturnValue({ user_id: '123', xp: 100, animal_key: 'nonexistent' });
      mockLevelFromXp.mockReturnValue({ level: 5, xpIntoLevel: 50 });
      mockGetAnimal.mockImplementation(() => {
        throw new Error('Unknown animal key: nonexistent');
      });

      const mockInteraction = {
        user: { id: '123' }
      };

      await assert.rejects(
        () => profileCommand.execute(mockInteraction),
        /Invalid animal data for player - animal key "nonexistent" not found/
      );
    });

    it('should successfully show profile for valid player with animal', async () => {
      // Setup mocks
      const mockPlayer = { user_id: '123', xp: 100, animal_key: 'fox' };
      const mockAnimal = { name: 'Fox', passive: 'Stealthy hunter' };
      const mockStats = { hp: 100, atk: 15, def: 10, spd: 20 };

      mockGetPlayer.mockReturnValue(mockPlayer);
      mockLevelFromXp.mockReturnValue({ level: 5, xpIntoLevel: 50 });
      mockGetAnimal.mockReturnValue(mockAnimal);
      mockGetStats.mockReturnValue(mockStats);

      const mockInteraction = {
        user: { id: '123' },
        reply: mock.fn()
      };

      await profileCommand.execute(mockInteraction);

      assert.equal(mockInteraction.reply.callCount(), 1);
      const replyArgs = mockInteraction.reply.calls[0].arguments[0];

      assert(replyArgs.embeds);
      assert.equal(replyArgs.embeds.length, 1);
      const embed = replyArgs.embeds[0];

      assert(embed.title.includes('Fox'));
      assert(embed.description.includes('Level 5'));
      assert(embed.fields[0].value.includes('100 HP'));
      assert(embed.fields[0].value.includes('15 ATK'));
    });

    it('should propagate non-animal-key related errors', async () => {
      // Setup mocks
      mockGetPlayer.mockReturnValue({ user_id: '123', xp: 100, animal_key: 'fox' });
      mockLevelFromXp.mockReturnValue({ level: 5, xpIntoLevel: 50 });
      mockGetAnimal.mockReturnValue({ name: 'Fox', passive: 'Stealthy hunter' });
      mockGetStats.mockImplementation(() => {
        throw new Error('Some other database error');
      });

      const mockInteraction = {
        user: { id: '123' }
      };

      await assert.rejects(
        () => profileCommand.execute(mockInteraction),
        /Some other database error/
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string animal key', async () => {
      mockGetPlayer.mockReturnValue({ user_id: '123', xp: 100, animal_key: '' });

      const mockInteraction = {
        user: { id: '123' }
      };

      await assert.rejects(
        () => profileCommand.execute(mockInteraction),
        /Player has no animal assigned/
      );
    });

    it('should handle numeric zero as valid animal key', async () => {
      const mockPlayer = { user_id: '123', xp: 100, animal_key: 0 };
      const mockAnimal = { name: 'Test Animal', passive: 'Test passive' };
      const mockStats = { hp: 50, atk: 5, def: 5, spd: 5 };

      mockGetPlayer.mockReturnValue(mockPlayer);
      mockLevelFromXp.mockReturnValue({ level: 1, xpIntoLevel: 0 });
      mockGetAnimal.mockReturnValue(mockAnimal);
      mockGetStats.mockReturnValue(mockStats);

      const mockInteraction = {
        user: { id: '123' },
        reply: mock.fn()
      };

      await profileCommand.execute(mockInteraction);

      assert.equal(mockInteraction.reply.callCount(), 1);
    });

    it('should handle level 1 players correctly', async () => {
      const mockPlayer = { user_id: '123', xp: 0, animal_key: 'fox' };
      const mockAnimal = { name: 'Fox', passive: 'Stealthy hunter' };
      const mockStats = { hp: 80, atk: 10, def: 8, spd: 15 };

      mockGetPlayer.mockReturnValue(mockPlayer);
      mockLevelFromXp.mockReturnValue({ level: 1, xpIntoLevel: 0 });
      mockGetAnimal.mockReturnValue(mockAnimal);
      mockGetStats.mockReturnValue(mockStats);

      const mockInteraction = {
        user: { id: '123' },
        reply: mock.fn()
      };

      await profileCommand.execute(mockInteraction);

      const embed = mockInteraction.reply.calls[0].arguments[0].embeds[0];
      assert(embed.description.includes('Level 1'));
      assert(embed.description.includes('0/10 XP'));
    });
  });
});
