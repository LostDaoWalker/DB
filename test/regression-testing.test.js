import { describe, it } from 'node:test';
import assert from 'node:assert';
import { levelFromXp, xpForNext, applyXp } from '../src/game/leveling.js';
import { getAnimal, getStats, listAnimals } from '../src/game/species/index.js';
import { SchemaExecutor } from '../src/db/schema-executor.js';
import { currentSchema } from '../src/db/schema.js';

/**
 * Regression Testing Suite
 *
 * Ensures that previously working functionality continues to work
 * after code changes, schema updates, and feature additions.
 */

describe('Regression Testing Suite', () => {
  describe('Core Game Mechanics (Regression)', () => {
    // These tests ensure that fundamental game mechanics haven't broken
    it('should maintain consistent leveling progression', () => {
      // Test known XP values that should result in specific levels
      const testCases = [
        { xp: 0, expectedLevel: 1 },
        { xp: 10, expectedLevel: 1 }, // Still level 1 until 30 XP
        { xp: 30, expectedLevel: 2 },
        { xp: 74, expectedLevel: 3 }, // 30 + 44 = 74 for level 3
        { xp: 118, expectedLevel: 4 }, // 30 + 44 + 62 = 136, so 118 is still level 3
      ];

      for (const { xp, expectedLevel } of testCases) {
        const result = levelFromXp(xp);
        assert.equal(result.level, expectedLevel,
          `XP ${xp} should result in level ${expectedLevel}, got ${result.level}`);
      }
    });

    it('should preserve animal stat calculations', () => {
      // Test that animal stats are calculated consistently
      const animals = listAnimals();
      assert(animals.length > 0, 'Should have animals available');

      for (const animal of animals) {
        const level1Stats = getStats(animal.key, 1);
        const level5Stats = getStats(animal.key, 5);

        // Basic sanity checks
        assert(level1Stats.hp > 0, `${animal.key} should have HP at level 1`);
        assert(level5Stats.hp > level1Stats.hp, `${animal.key} HP should increase with level`);
        assert(level5Stats.atk > level1Stats.atk, `${animal.key} attack should increase with level`);
        assert(level5Stats.def > level1Stats.def, `${animal.key} defense should increase with level`);
        assert(level5Stats.spd > level1Stats.spd, `${animal.key} speed should increase with level`);
      }
    });

    it('should maintain XP application consistency', () => {
      // Test that XP application works as expected
      const initialXp = 10;
      const gainedXp = 25;

      const result = applyXp(initialXp, gainedXp);

      assert.equal(result.totalXp, 35, 'Should correctly sum XP');
      assert.equal(result.level, 1, 'Should still be level 1 with 35 XP');
      assert.equal(result.xpIntoLevel, 35, 'Should have 35 XP into level 1');
    });
  });

  describe('Database Schema (Regression)', () => {
    it('should maintain schema integrity across updates', async () => {
      // Create a mock database for testing
      class MockDatabase {
        constructor() {
          this.tables = new Map();
          this.indexes = new Map();
          this.executedSQL = [];
        }

        run(sql, callback) {
          this.executedSQL.push(sql);
          setTimeout(() => callback(null), 1);
        }

        get(sql, params, callback) {
          if (sql.includes("SELECT name FROM sqlite_master WHERE type='table'")) {
            const tableName = params[0];
            const exists = this.tables.has(tableName);
            setTimeout(() => callback(null, exists ? { name: tableName } : null), 1);
            return;
          }
          setTimeout(() => callback(null, null), 1);
        }

        all(sql, params, callback) {
          if (sql.includes('PRAGMA table_info')) {
            const tableName = sql.match(/PRAGMA table_info\(([^)]+)\)/)?.[1] || params?.[0];
            const tableInfo = this.tables.get(tableName) || [];
            setTimeout(() => callback(null, tableInfo), 1);
            return;
          }
          if (sql.includes("SELECT name, sql FROM sqlite_master WHERE type='index'")) {
            const tableName = params?.[0];
            const indexes = this.indexes.get(tableName) || [];
            setTimeout(() => callback(null, indexes), 1);
            return;
          }
          setTimeout(() => callback(null, []), 1);
        }
      }

      const mockDb = new MockDatabase();
      const executor = new SchemaExecutor(mockDb);

      // Test that schema generation doesn't throw errors
      const sqlStatements = currentSchema.toSQL();
      assert(Array.isArray(sqlStatements), 'Schema should generate SQL statements');
      assert(sqlStatements.length > 0, 'Schema should have SQL statements');

      // Test that all tables are defined
      const tables = currentSchema.getAllTables();
      assert(tables.length >= 2, 'Should have at least players and bot_events tables');

      // Test that players table has all expected columns
      const playersTable = currentSchema.getTable('players');
      assert(playersTable, 'Players table should exist');
      assert(playersTable.columns.length >= 16, 'Players table should have many columns');
    });

    it('should preserve existing data compatibility', () => {
      // Test that schema changes don't break existing data expectations
      const playersTable = currentSchema.getTable('players');

      // Check that critical columns exist and have correct types
      const userIdColumn = playersTable.columns.find(col => col.name === 'user_id');
      const xpColumn = playersTable.columns.find(col => col.name === 'xp');
      const animalKeyColumn = playersTable.columns.find(col => col.name === 'animal_key');

      assert(userIdColumn, 'user_id column should exist');
      assert(xpColumn, 'xp column should exist');
      assert(animalKeyColumn, 'animal_key column should exist');

      // Check that they have the expected constraints
      assert(userIdColumn.constraints.includes('PRIMARY KEY'), 'user_id should be primary key');
      assert(animalKeyColumn.constraints.includes('NOT NULL'), 'animal_key should be NOT NULL');
      assert.equal(xpColumn.default, 0, 'xp should default to 0');
    });
  });

  describe('API Compatibility (Regression)', () => {
    it('should maintain function signatures', () => {
      // Test that exported functions have expected signatures
      assert(typeof levelFromXp === 'function', 'levelFromXp should be a function');
      assert(typeof xpForNext === 'function', 'xpForNext should be a function');
      assert(typeof getAnimal === 'function', 'getAnimal should be a function');
      assert(typeof getStats === 'function', 'getStats should be a function');
      assert(typeof listAnimals === 'function', 'listAnimals should be a function');
    });

    it('should maintain return value structures', () => {
      // Test that functions return expected data structures
      const levelResult = levelFromXp(100);
      assert(typeof levelResult === 'object', 'levelFromXp should return object');
      assert('level' in levelResult, 'levelFromXp result should have level property');
      assert('xpIntoLevel' in levelResult, 'levelFromXp result should have xpIntoLevel property');

      const animal = getAnimal(listAnimals()[0].key);
      assert(typeof animal === 'object', 'getAnimal should return object');
      assert('name' in animal, 'Animal should have name property');
      assert('base' in animal, 'Animal should have base stats');

      const stats = getStats(listAnimals()[0].key, 1);
      assert(typeof stats === 'object', 'getStats should return object');
      assert('hp' in stats, 'Stats should have hp property');
      assert('atk' in stats, 'Stats should have atk property');
      assert('def' in stats, 'Stats should have def property');
      assert('spd' in stats, 'Stats should have spd property');
    });

    it('should handle error cases consistently', () => {
      // Test that error cases behave as expected
      assert.throws(() => getAnimal('nonexistent'), /Unknown animal key/);
      assert.throws(() => getAnimal(null), /Unknown animal key/);
      assert.throws(() => getAnimal(undefined), /Unknown animal key/);

      // Test that valid cases work
      const validAnimal = listAnimals()[0];
      assert.doesNotThrow(() => getAnimal(validAnimal.key));
      assert.doesNotThrow(() => getStats(validAnimal.key, 1));
    });
  });

  describe('Performance Baselines (Regression)', () => {
    it('should maintain reasonable execution times', async () => {
      const startTime = Date.now();

      // Perform operations that should complete quickly
      for (let i = 0; i < 100; i++) {
        levelFromXp(i);
        xpForNext(i % 10 + 1);
      }

      const animals = listAnimals();
      for (const animal of animals) {
        getStats(animal.key, 1);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (less than 100ms for 100+ operations)
      assert(duration < 100, `Operations took too long: ${duration}ms`);
    });

    it('should handle large datasets efficiently', () => {
      // Test that operations scale reasonably
      const startTime = Date.now();

      // Simulate processing many XP calculations
      for (let xp = 0; xp < 1000; xp += 10) {
        levelFromXp(xp);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      assert(duration < 50, `Large dataset processing took too long: ${duration}ms`);
    });
  });
});
