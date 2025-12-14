import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SchemaExecutor } from '../src/db/schema-executor.js';
import { Schema, ColumnType, Constraint } from '../src/db/schema.js';

// Mock database for testing
class MockDatabase {
  constructor() {
    this.tables = new Map();
    this.indexes = new Map();
    this.executedSQL = [];
  }

  run(sql, callback) {
    this.executedSQL.push(sql);
    // Simulate successful execution
    setTimeout(() => callback(null), 1);
  }

  get(sql, params, callback) {
    // Mock table existence check
    if (sql.includes("SELECT name FROM sqlite_master WHERE type='table'")) {
      const tableName = params[0];
      const exists = this.tables.has(tableName);
      setTimeout(() => callback(null, exists ? { name: tableName } : null), 1);
      return;
    }
    setTimeout(() => callback(null, null), 1);
  }

  all(sql, params, callback) {
    // Mock PRAGMA table_info
    if (sql.includes('PRAGMA table_info')) {
      const tableName = sql.match(/PRAGMA table_info\(([^)]+)\)/)?.[1] || params?.[0];
      const tableInfo = this.tables.get(tableName) || [];
      setTimeout(() => callback(null, tableInfo), 1);
      return;
    }

    // Mock index queries
    if (sql.includes("SELECT name, sql FROM sqlite_master WHERE type='index'")) {
      const tableName = params?.[0];
      const indexes = this.indexes.get(tableName) || [];
      setTimeout(() => callback(null, indexes), 1);
      return;
    }

    setTimeout(() => callback(null, []), 1);
  }
}

describe('Schema Repair Tests', () => {
  it('should detect missing tables', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a schema with one table
    const schema = new Schema('test', 1);
    const table = schema.addTable('missing_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });

    const issues = await executor.validateSchema(schema);

    assert(issues.length > 0, 'Should detect missing table');
    assert(issues[0].includes('does not exist'), 'Should report table missing');
  });

  it('should detect missing columns', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a table with existing columns
    mockDb.tables.set('test_table', [
      { name: 'id', type: 'INTEGER', notnull: 1, pk: 1 }
    ]);

    // Schema expects an additional column
    const schema = new Schema('test', 1);
    const table = schema.addTable('test_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    table.addColumn('name', ColumnType.TEXT, { notNull: true });

    const issues = await executor.validateSchema(schema);

    assert(issues.length > 0, 'Should detect missing column');
    assert(issues.some(issue => issue.includes('missing') && issue.includes('name')), 'Should report name column missing');
  });

  it('should detect missing indexes', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a table with no indexes
    mockDb.tables.set('test_table', [
      { name: 'id', type: 'INTEGER', notnull: 1, pk: 1 },
      { name: 'name', type: 'TEXT', notnull: 1, pk: 0 }
    ]);
    mockDb.indexes.set('test_table', []);

    // Schema expects an index
    const schema = new Schema('test', 1);
    const table = schema.addTable('test_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    table.addColumn('name', ColumnType.TEXT, { notNull: true });
    table.addIndex('name');

    const issues = await executor.validateSchema(schema);

    assert(issues.length > 0, 'Should detect missing index');
    assert(issues.some(issue => issue.includes('Index') && issue.includes('missing')), 'Should report index missing');
  });

  it('should repair missing tables', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a schema with a missing table
    const schema = new Schema('test', 1);
    const table = schema.addTable('new_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    table.addColumn('name', ColumnType.TEXT);

    const repairs = await executor.repairSchema(schema);

    assert(repairs.length > 0, 'Should perform repairs');
    assert(repairs[0].includes('Created missing table'), 'Should create missing table');
    assert(mockDb.executedSQL.length > 0, 'Should execute SQL statements');

    // Check that CREATE TABLE was executed
    const createTableSQL = mockDb.executedSQL.find(sql => sql.includes('CREATE TABLE'));
    assert(createTableSQL, 'Should execute CREATE TABLE statement');
    assert(createTableSQL.includes('new_table'), 'Should create the correct table');
  });

  it('should repair missing columns', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a table with existing columns
    mockDb.tables.set('test_table', [
      { name: 'id', type: 'INTEGER', notnull: 1, pk: 1 }
    ]);

    // Schema expects an additional column
    const schema = new Schema('test', 1);
    const table = schema.addTable('test_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    table.addColumn('name', ColumnType.TEXT, { notNull: true });

    const repairs = await executor.repairSchema(schema);

    assert(repairs.length > 0, 'Should perform repairs');

    // Find the column repair message
    const columnRepair = repairs.find(r => r.includes('Added missing column'));
    assert(columnRepair, 'Should add missing column');
    assert(columnRepair.includes('name'), 'Should add the correct column');

    // Check that ALTER TABLE was executed
    const alterTableSQL = mockDb.executedSQL.find(sql => sql.includes('ALTER TABLE'));
    assert(alterTableSQL, 'Should execute ALTER TABLE statement');
    assert(alterTableSQL.includes('ADD COLUMN'), 'Should add column');
    assert(alterTableSQL.includes('name'), 'Should add the correct column name');
  });

  it('should repair missing indexes', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a table with columns but no indexes
    mockDb.tables.set('test_table', [
      { name: 'id', type: 'INTEGER', notnull: 1, pk: 1 },
      { name: 'name', type: 'TEXT', notnull: 1, pk: 0 }
    ]);
    mockDb.indexes.set('test_table', []);

    // Schema expects an index
    const schema = new Schema('test', 1);
    const table = schema.addTable('test_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    table.addColumn('name', ColumnType.TEXT, { notNull: true });
    table.addIndex('name', { name: 'idx_name' });

    const repairs = await executor.repairSchema(schema);

    assert(repairs.length > 0, 'Should perform repairs');

    // Find the index repair message
    const indexRepair = repairs.find(r => r.includes('Added missing index'));
    assert(indexRepair, 'Should add missing index');
    assert(indexRepair.includes('idx_name'), 'Should add the correct index');

    // Check that CREATE INDEX was executed
    const createIndexSQL = mockDb.executedSQL.find(sql => sql.includes('CREATE INDEX'));
    assert(createIndexSQL, 'Should execute CREATE INDEX statement');
    assert(createIndexSQL.includes('idx_name'), 'Should create the correct index');
  });

  it('should handle successful validation with no repairs needed', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Create a complete table with all expected components
    // Note: PRIMARY KEY columns automatically get NOT NULL constraint
    mockDb.tables.set('complete_table', [
      { name: 'id', type: 'INTEGER', notnull: 1, pk: 1 }, // PRIMARY KEY implies NOT NULL
      { name: 'name', type: 'TEXT', notnull: 1, pk: 0 }   // Explicitly NOT NULL
    ]);
    mockDb.indexes.set('complete_table', [
      { name: 'idx_name', sql: 'CREATE INDEX idx_name ON complete_table(name)' }
    ]);

    // Schema matches the database exactly
    const schema = new Schema('test', 1);
    const table = schema.addTable('complete_table');
    table.addColumn('id', ColumnType.INTEGER, { primaryKey: true }); // Automatically gets NOT NULL
    table.addColumn('name', ColumnType.TEXT, { notNull: true });
    table.addIndex('name', { name: 'idx_name' });

    const issues = await executor.validateSchema(schema);
    assert.equal(issues.length, 0, 'Should have no validation issues');

    const repairs = await executor.repairSchema(schema);
    assert.equal(repairs.length, 0, 'Should need no repairs');

    assert.equal(mockDb.executedSQL.length, 0, 'Should execute no SQL statements');
  });

  it('should handle complex schema repairs', async () => {
    const mockDb = new MockDatabase();
    const executor = new SchemaExecutor(mockDb);

    // Database has only one table
    mockDb.tables.set('existing_table', [
      { name: 'id', type: 'INTEGER', notnull: 1, pk: 1 }
    ]);
    mockDb.indexes.set('existing_table', []);

    // Schema has two tables with various missing components
    const schema = new Schema('test', 1);

    // Existing table missing column and index
    const existingTable = schema.addTable('existing_table');
    existingTable.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    existingTable.addColumn('data', ColumnType.TEXT);
    existingTable.addIndex('data');

    // Completely missing table
    const newTable = schema.addTable('new_table');
    newTable.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
    newTable.addColumn('value', ColumnType.INTEGER);
    newTable.addIndex('value');

    const repairs = await executor.repairSchema(schema);

    // Should have 4 repairs: 1 column, 1 index, 1 table creation (with implicit index)
    assert(repairs.length >= 3, 'Should perform multiple repairs');

    // Check repair types
    const hasColumnRepair = repairs.some(r => r.includes('Added missing column'));
    const hasIndexRepair = repairs.some(r => r.includes('Added missing index'));
    const hasTableRepair = repairs.some(r => r.includes('Created missing table'));

    assert(hasColumnRepair, 'Should repair missing column');
    assert(hasIndexRepair, 'Should repair missing index');
    assert(hasTableRepair, 'Should create missing table');

    // Should have executed multiple SQL statements
    assert(mockDb.executedSQL.length >= 3, 'Should execute multiple SQL statements');
  });
});
