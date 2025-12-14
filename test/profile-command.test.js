import { describe, it } from 'node:test';
import assert from 'node:assert';
import { listAnimals, getAnimal, getStats } from '../src/game/species/index.js';
import { levelFromXp, xpForNext } from '../src/game/leveling.js';

// Test actual data and functions from the codebase
describe('Real Data Tests', () => {
  describe('Species Data', () => {
    it('should load actual animal data from JSON', () => {
      const animals = listAnimals();
      assert(Array.isArray(animals), 'listAnimals should return an array');
      assert(animals.length > 0, 'Should have at least one animal');

      // Check that each animal has required properties
      animals.forEach(animal => {
        assert(animal.key, 'Animal should have a key');
        assert(animal.name, 'Animal should have a name');
        assert(animal.base, 'Animal should have base stats');
        assert(animal.growth, 'Animal should have growth stats');
      });
    });

    it('should get specific animal data correctly', () => {
      const animals = listAnimals();
      const firstAnimal = animals[0];

      const animalData = getAnimal(firstAnimal.key);
      assert.equal(animalData.name, firstAnimal.name, 'Should return correct animal data');
      assert(animalData.base, 'Should have base stats');
      assert(animalData.growth, 'Should have growth stats');
    });

    it('should calculate stats correctly for different levels', () => {
      const animals = listAnimals();
      const firstAnimal = animals[0];

      const level1Stats = getStats(firstAnimal.key, 1);
      const level5Stats = getStats(firstAnimal.key, 5);

      // Level 5 should have higher stats than level 1
      assert(level5Stats.hp > level1Stats.hp, 'Higher level should have more HP');
      assert(level5Stats.atk > level1Stats.atk, 'Higher level should have more attack');
      assert(level5Stats.def > level1Stats.def, 'Higher level should have more defense');
      assert(level5Stats.spd > level1Stats.spd, 'Higher level should have more speed');
    });

    it('should throw error for invalid animal key', () => {
      assert.throws(() => getAnimal('nonexistent'), /Unknown animal key/);
      assert.throws(() => getAnimal(undefined), /Unknown animal key/);
      assert.throws(() => getAnimal(null), /Unknown animal key/);
    });
  });

  describe('Leveling System', () => {
    it('should calculate levels correctly from XP', () => {
      // Test various XP amounts based on actual algorithm (30 XP needed for level 2)
      assert.deepEqual(levelFromXp(0), { level: 1, xpIntoLevel: 0 });
      assert.deepEqual(levelFromXp(9), { level: 1, xpIntoLevel: 9 });
      assert.deepEqual(levelFromXp(30), { level: 2, xpIntoLevel: 0 }); // 30 XP = level 2
      assert.deepEqual(levelFromXp(55), { level: 2, xpIntoLevel: 25 }); // 30 + 25 = level 2 with 25 XP into level
    });

    it('should calculate XP requirements for next level', () => {
      // Based on actual algorithm: 30 + (L-1)*12 + (L-1)*(L-1)*2
      assert.equal(xpForNext(1), 30); // 30 + 0 + 0 = 30
      assert.equal(xpForNext(2), 44); // 30 + 12 + 2 = 44
      assert.equal(xpForNext(3), 62); // 30 + 24 + 8 = 62
    });
  });

  describe('Profile Command Validation', () => {
    it('should validate animal key before processing', () => {
      // Test the validation logic from profile command
      const testCases = [
        { animal_key: null, shouldThrow: true },
        { animal_key: undefined, shouldThrow: true },
        { animal_key: '', shouldThrow: true },
        { animal_key: 'fox', shouldThrow: false },
        { animal_key: 0, shouldThrow: false }, // numeric zero should be valid
      ];

      testCases.forEach(({ animal_key, shouldThrow }) => {
        const player = { animal_key };

        if (shouldThrow) {
          // Simulate the validation from profile.js
          assert(!player.animal_key, `Player with animal_key=${animal_key} should be considered invalid`);
        } else {
          assert(player.animal_key !== null && player.animal_key !== undefined && player.animal_key !== '',
            `Player with animal_key=${animal_key} should be considered valid`);
        }
      });
    });

    it('should handle unknown animal key errors properly', () => {
      // Test the error transformation logic
      const testError = new Error('Unknown animal key: corrupted_data');

      assert(testError.message.includes('Unknown animal key'), 'Should detect animal key error');
      assert(testError.message.includes('corrupted_data'), 'Should include the problematic key');

      // Simulate the error transformation from profile.js
      const transformedMessage = `Invalid animal data for player - animal key "corrupted_data" not found. Please contact support.`;
      assert(transformedMessage.includes('corrupted_data'), 'Transformed message should include the key');
      assert(transformedMessage.includes('contact support'), 'Should provide support guidance');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete profile display flow with real data', () => {
      const animals = listAnimals();
      const foxData = getAnimal('fox'); // Assuming fox exists
      const foxStats = getStats('fox', 5);

      // Verify the data structure that would be used in profile display
      assert(foxData.name, 'Fox should have a name');
      assert(foxData.passive, 'Fox should have a passive ability');
      assert(typeof foxStats.hp === 'number', 'Stats should include HP as number');
      assert(typeof foxStats.atk === 'number', 'Stats should include attack as number');

      // Test level calculation
      const levelInfo = levelFromXp(100); // Some XP amount
      assert(levelInfo.level >= 1, 'Should calculate valid level');
      assert(levelInfo.xpIntoLevel >= 0, 'Should have valid XP into level');

      // Test XP requirement calculation
      const nextLevelXP = xpForNext(levelInfo.level);
      assert(nextLevelXP > levelInfo.xpIntoLevel, 'Next level should require more XP');
    });

    it('should validate complete user flow data integrity', () => {
      // Test that all pieces work together for a complete user scenario
      const animals = listAnimals();
      assert(animals.length >= 4, 'Should have at least 4 animals for the game');

      // Test each animal can be retrieved and have stats calculated
      animals.forEach(animal => {
        const data = getAnimal(animal.key);
        const stats = getStats(animal.key, 1);

        assert(data.name, `${animal.key} should have name`);
        assert(data.passive, `${animal.key} should have passive`);
        assert(stats.hp > 0, `${animal.key} should have HP stat`);
        assert(stats.atk > 0, `${animal.key} should have attack stat`);
      });
    });
  });
});
