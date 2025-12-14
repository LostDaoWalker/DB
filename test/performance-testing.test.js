import { describe, it } from 'node:test';
import assert from 'node:assert';
import { levelFromXp, xpForNext, applyXp } from '../src/game/leveling.js';
import { getAnimal, getStats, listAnimals } from '../src/game/species/index.js';
import { SchemaExecutor } from '../src/db/schema-executor.js';
import { currentSchema } from '../src/db/schema.js';

/**
 * Performance Testing Suite
 *
 * Measures and validates performance characteristics of the system
 * including execution times, memory usage, and scalability.
 */

describe('Performance Testing Suite', () => {
  describe('Core Function Performance', () => {
    it('should execute leveling functions efficiently', () => {
      const iterations = 10000;

      // Test levelFromXp performance
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        levelFromXp(i % 1000); // Vary input to prevent optimization
      }
      const levelFromXpTime = performance.now() - startTime;

      // Test xpForNext performance
      const startTime2 = performance.now();
      for (let i = 1; i <= iterations; i++) {
        xpForNext((i % 50) + 1); // Vary input to prevent optimization
      }
      const xpForNextTime = performance.now() - startTime2;

      // Each function should complete 10k iterations in reasonable time
      assert(levelFromXpTime < 100, `levelFromXp too slow: ${levelFromXpTime.toFixed(2)}ms for ${iterations} iterations`);
      assert(xpForNextTime < 100, `xpForNext too slow: ${xpForNextTime.toFixed(2)}ms for ${iterations} iterations`);

      // Log performance for monitoring
      console.log(`Performance: levelFromXp: ${(levelFromXpTime / iterations * 1000).toFixed(3)}μs/op`);
      console.log(`Performance: xpForNext: ${(xpForNextTime / iterations * 1000).toFixed(3)}μs/op`);
    });

    it('should handle stat calculations efficiently', () => {
      const animals = listAnimals();
      const iterations = 1000;

      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        const animal = animals[i % animals.length];
        const level = (i % 20) + 1;
        getStats(animal.key, level);
      }
      const totalTime = performance.now() - startTime;

      // Should handle 1k stat calculations quickly
      assert(totalTime < 50, `Stat calculations too slow: ${totalTime.toFixed(2)}ms for ${iterations} iterations`);

      console.log(`Performance: getStats: ${(totalTime / iterations * 1000).toFixed(3)}μs/op`);
    });

    it('should scale with input size appropriately', () => {
      // Test that performance degrades gracefully with larger inputs
      const testSizes = [100, 1000, 10000];

      for (const size of testSizes) {
        const startTime = performance.now();

        for (let i = 0; i < size; i++) {
          levelFromXp(i);
        }

        const time = performance.now() - startTime;
        const timePerOp = time / size;

        // Performance should not degrade exponentially
        assert(timePerOp < 0.1, `Performance degraded too much at size ${size}: ${timePerOp.toFixed(3)}ms/op`);

        console.log(`Performance scaling: ${size} ops = ${time.toFixed(2)}ms (${timePerOp.toFixed(3)}ms/op)`);
      }
    });
  });

  describe('Memory Usage', () => {
    it('should not have excessive memory growth', () => {
      // Test for memory leaks in repeated operations
      const iterations = 5000;

      if (typeof global !== 'undefined' && global.gc) {
        global.gc(); // Force garbage collection if available
      }

      const initialMemory = process.memoryUsage();

      // Perform many operations
      for (let i = 0; i < iterations; i++) {
        const animal = listAnimals()[i % listAnimals().length];
        getStats(animal.key, (i % 10) + 1);
        levelFromXp(i % 100);
        xpForNext((i % 20) + 1);
      }

      if (typeof global !== 'undefined' && global.gc) {
        global.gc(); // Force garbage collection
      }

      const finalMemory = process.memoryUsage();
      const memoryGrowth = finalMemory.heapUsed - initialMemory.heapUsed;

      // Allow some memory growth but not excessive
      const maxGrowth = 10 * 1024 * 1024; // 10MB
      assert(memoryGrowth < maxGrowth, `Excessive memory growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);

      console.log(`Memory: Initial ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB, Final ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB, Growth ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
    });

    it('should handle large datasets without memory issues', () => {
      // Test processing large amounts of data
      const largeDataset = [];
      for (let i = 0; i < 10000; i++) {
        largeDataset.push({
          xp: i,
          level: levelFromXp(i),
          stats: getStats('fox', (i % 10) + 1)
        });
      }

      assert(largeDataset.length === 10000, 'Should handle large dataset creation');
      assert(largeDataset.every(item => item.level && item.stats), 'All items should be properly processed');

      // Clear the dataset to free memory
      largeDataset.length = 0;
    });
  });

  describe('Database Schema Performance', () => {
    it('should generate schema SQL efficiently', () => {
      const startTime = performance.now();
      const sqlStatements = currentSchema.toSQL();
      const generationTime = performance.now() - startTime;

      assert(sqlStatements.length > 0, 'Should generate SQL statements');
      assert(generationTime < 10, `Schema generation too slow: ${generationTime.toFixed(2)}ms`);

      console.log(`Performance: Schema SQL generation: ${generationTime.toFixed(3)}ms for ${sqlStatements.length} statements`);
    });

    it('should validate schema quickly', async () => {
      // Mock database for performance testing
      class MockDatabase {
        constructor() {
          this.tables = new Map();
          this.indexes = new Map();
        }

        run(sql, callback) { setTimeout(() => callback(null), 1); }
        get(sql, params, callback) {
          if (sql.includes("SELECT name FROM sqlite_master WHERE type='table'")) {
            const tableName = params[0];
            setTimeout(() => callback(null, this.tables.has(tableName) ? { name: tableName } : null), 1);
            return;
          }
          setTimeout(() => callback(null, null), 1);
        }

        all(sql, params, callback) {
          if (sql.includes('PRAGMA table_info')) {
            const tableName = sql.match(/PRAGMA table_info\(([^)]+)\)/)?.[1] || params?.[0];
            setTimeout(() => callback(null, this.tables.get(tableName) || []), 1);
            return;
          }
          if (sql.includes("SELECT name, sql FROM sqlite_master WHERE type='index'")) {
            const tableName = params?.[0];
            setTimeout(() => callback(null, this.indexes.get(tableName) || []), 1);
            return;
          }
          setTimeout(() => callback(null, []), 1);
        }
      }

      const mockDb = new SchemaExecutor(new MockDatabase());
      const startTime = performance.now();
      await mockDb.validateSchema(currentSchema);
      const validationTime = performance.now() - startTime;

      assert(validationTime < 100, `Schema validation too slow: ${validationTime.toFixed(2)}ms`);
      console.log(`Performance: Schema validation: ${validationTime.toFixed(2)}ms`);
    });

    it('should repair schema efficiently', async () => {
      // Mock database with missing components
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
            setTimeout(() => callback(null, this.tables.has(tableName) ? { name: tableName } : null), 1);
            return;
          }
          setTimeout(() => callback(null, null), 1);
        }

        all(sql, params, callback) {
          if (sql.includes('PRAGMA table_info')) {
            const tableName = sql.match(/PRAGMA table_info\(([^)]+)\)/)?.[1] || params?.[0];
            setTimeout(() => callback(null, this.tables.get(tableName) || []), 1);
            return;
          }
          if (sql.includes("SELECT name, sql FROM sqlite_master WHERE type='index'")) {
            const tableName = params?.[0];
            setTimeout(() => callback(null, this.indexes.get(tableName) || []), 1);
            return;
          }
          setTimeout(() => callback(null, []), 1);
        }
      }

      const mockDb = new SchemaExecutor(new MockDatabase());

      // Create a schema that will need repairs
      const testSchema = currentSchema; // Use current schema

      const startTime = performance.now();
      const repairs = await mockDb.repairSchema(testSchema);
      const repairTime = performance.now() - startTime;

      // Should complete repairs quickly
      assert(repairTime < 200, `Schema repair too slow: ${repairTime.toFixed(2)}ms`);
      console.log(`Performance: Schema repair: ${repairTime.toFixed(2)}ms for ${repairs.length} repairs`);
    });
  });

  describe('Concurrent Operation Performance', () => {
    it('should handle concurrent operations efficiently', async () => {
      const operations = 100;
      const promises = [];

      // Create concurrent operations
      for (let i = 0; i < operations; i++) {
        promises.push(
          new Promise(resolve => {
            setTimeout(() => {
              levelFromXp(i);
              getStats('fox', (i % 10) + 1);
              resolve();
            }, Math.random() * 10); // Random delay to simulate real concurrency
          })
        );
      }

      const startTime = performance.now();
      await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      // Should complete all operations in reasonable time
      assert(totalTime < 500, `Concurrent operations too slow: ${totalTime.toFixed(2)}ms for ${operations} operations`);

      console.log(`Performance: Concurrent operations: ${totalTime.toFixed(2)}ms for ${operations} operations`);
    });

    it('should maintain performance under load', () => {
      // Test sustained performance
      const testDuration = 1000; // 1 second
      const startTime = performance.now();
      let operations = 0;

      while (performance.now() - startTime < testDuration) {
        levelFromXp(operations % 100);
        xpForNext((operations % 20) + 1);

        const animals = listAnimals();
        getStats(animals[operations % animals.length].key, (operations % 10) + 1);

        operations++;
      }

      const opsPerSecond = operations / (testDuration / 1000);

      assert(opsPerSecond > 1000, `Low throughput: ${opsPerSecond.toFixed(0)} ops/sec`);

      console.log(`Performance: Sustained load: ${opsPerSecond.toFixed(0)} ops/sec`);
    });
  });

  describe('Resource Efficiency', () => {
    it('should minimize redundant calculations', () => {
      // Test that repeated calls with same parameters are efficient
      const testCases = [
        { animal: 'fox', level: 5 },
        { animal: 'bear', level: 3 },
        { animal: 'rabbit', level: 7 }
      ];

      const startTime = performance.now();

      // Call same functions multiple times with same params
      for (let i = 0; i < 1000; i++) {
        for (const testCase of testCases) {
          getStats(testCase.animal, testCase.level);
          levelFromXp(100);
          xpForNext(5);
        }
      }

      const totalTime = performance.now() - startTime;

      // Should handle repeated calculations efficiently
      assert(totalTime < 200, `Repeated calculations too slow: ${totalTime.toFixed(2)}ms`);

      console.log(`Performance: Repeated calculations: ${totalTime.toFixed(2)}ms for ${3000} operations`);
    });

    it('should handle error conditions efficiently', () => {
      const startTime = performance.now();

      // Test error handling performance
      for (let i = 0; i < 1000; i++) {
        try {
          getAnimal('nonexistent');
        } catch (e) {
          // Expected error
        }

        try {
          getStats('invalid', 1);
        } catch (e) {
          // Expected error
        }
      }

      const totalTime = performance.now() - startTime;

      // Error handling should not be excessively slow
      assert(totalTime < 100, `Error handling too slow: ${totalTime.toFixed(2)}ms`);

      console.log(`Performance: Error handling: ${totalTime.toFixed(2)}ms for ${2000} error operations`);
    });
  });

  describe('Startup Performance', () => {
    it('should initialize schema system quickly', () => {
      const startTime = performance.now();

      // Test schema system initialization
      const schema = currentSchema;
      const tables = schema.getAllTables();
      const sql = schema.toSQL();

      const initTime = performance.now() - startTime;

      assert(tables.length >= 2, 'Should have tables');
      assert(sql.length > 0, 'Should generate SQL');
      assert(initTime < 20, `Schema initialization too slow: ${initTime.toFixed(2)}ms`);

      console.log(`Performance: Schema initialization: ${initTime.toFixed(2)}ms`);
    });

    it('should load animal data efficiently', () => {
      const startTime = performance.now();

      const animals = listAnimals();
      for (const animal of animals) {
        getAnimal(animal.key);
        getStats(animal.key, 1);
      }

      const loadTime = performance.now() - startTime;

      assert(animals.length > 0, 'Should load animals');
      assert(loadTime < 50, `Data loading too slow: ${loadTime.toFixed(2)}ms`);

      console.log(`Performance: Data loading: ${loadTime.toFixed(2)}ms for ${animals.length} animals`);
    });
  });
});
