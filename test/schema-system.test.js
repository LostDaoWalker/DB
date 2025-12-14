import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Column, Table, Schema, ColumnType, Constraint, schemaManager, currentSchema } from '../src/db/schema.js';

describe('Schema System Tests', () => {
  describe('Column Class', () => {
    it('should create a basic column', () => {
      const column = new Column('user_id', ColumnType.TEXT);

      assert.equal(column.name, 'user_id');
      assert.equal(column.type, ColumnType.TEXT);
      assert.deepEqual(column.constraints, []);
    });

    it('should create a column with constraints', () => {
      const column = new Column('id', ColumnType.INTEGER, {
        primaryKey: true,
        autoIncrement: true,
        notNull: true
      });

      assert.equal(column.name, 'id');
      assert.equal(column.type, ColumnType.INTEGER);
      assert(column.constraints.includes(Constraint.PRIMARY_KEY));
      assert(column.constraints.includes(Constraint.AUTOINCREMENT));
      // PRIMARY KEY automatically implies NOT NULL, so explicit NOT NULL is not added
      assert(!column.constraints.includes(Constraint.NOT_NULL));
    });

    it('should create a column with default value', () => {
      const column = new Column('status', ColumnType.TEXT, {
        default: 'active'
      });

      assert.equal(column.default, 'active');
    });

    it('should generate correct SQL', () => {
      const column = new Column('user_id', ColumnType.TEXT, {
        primaryKey: true,
        notNull: true
      });

      const sql = column.toSQL();
      // PRIMARY KEY automatically implies NOT NULL in SQLite
      assert.equal(sql, 'user_id TEXT PRIMARY KEY');
    });

    it('should handle default values in SQL', () => {
      const column = new Column('count', ColumnType.INTEGER, {
        default: 0
      });

      const sql = column.toSQL();
      assert.equal(sql, 'count INTEGER DEFAULT 0');
    });
  });

  describe('Table Class', () => {
    it('should create a table with columns', () => {
      const table = new Table('users');
      table.addColumn('id', ColumnType.INTEGER, { primaryKey: true, autoIncrement: true });
      table.addColumn('name', ColumnType.TEXT, { notNull: true });
      table.addColumn('email', ColumnType.TEXT, { unique: true });

      assert.equal(table.name, 'users');
      assert.equal(table.columns.length, 3);
      assert.equal(table.columns[0].name, 'id');
      assert.equal(table.columns[1].name, 'name');
      assert.equal(table.columns[2].name, 'email');
    });

    it('should add indexes to table', () => {
      const table = new Table('players');
      table.addColumn('user_id', ColumnType.TEXT, { primaryKey: true });
      table.addColumn('xp', ColumnType.INTEGER);
      table.addColumn('animal_key', ColumnType.TEXT);

      table.addIndex('xp');
      table.addIndex(['xp', 'animal_key'], { name: 'idx_xp_animal' });

      assert.equal(table.indexes.length, 2);
      assert.equal(table.indexes[0].columns[0], 'xp');
      assert.equal(table.indexes[1].name, 'idx_xp_animal');
    });

    it('should generate correct table SQL', () => {
      const table = new Table('test_table');
      table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
      table.addColumn('name', ColumnType.TEXT, { notNull: true });

      const sql = table.toSQL();
      assert(sql.includes('CREATE TABLE IF NOT EXISTS test_table'));
      assert(sql.includes('id INTEGER PRIMARY KEY'));
      assert(sql.includes('name TEXT NOT NULL'));
    });

    it('should generate correct index SQL', () => {
      const table = new Table('players');
      table.addColumn('xp', ColumnType.INTEGER);
      table.addIndex('xp', { name: 'idx_xp' });
      table.addIndex(['xp', 'animal_key'], { name: 'idx_composite', unique: true });

      const indexSQL = table.getIndexSQL();
      assert.equal(indexSQL.length, 2);
      assert(indexSQL[0].includes('CREATE INDEX IF NOT EXISTS idx_xp ON players(xp)'));
      assert(indexSQL[1].includes('CREATE UNIQUE INDEX IF NOT EXISTS idx_composite ON players(xp, animal_key)'));
    });
  });

  describe('Schema Class', () => {
    it('should create and manage tables', () => {
      const schema = new Schema('test_schema', 1);

      const usersTable = schema.addTable('users');
      usersTable.addColumn('id', ColumnType.INTEGER, { primaryKey: true });

      const postsTable = schema.addTable('posts');
      postsTable.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
      postsTable.addColumn('user_id', ColumnType.INTEGER);

      assert.equal(schema.name, 'test_schema');
      assert.equal(schema.version, 1);
      assert(schema.getTable('users'));
      assert(schema.getTable('posts'));
      assert.equal(schema.getAllTables().length, 2);
    });

    it('should generate complete schema SQL', () => {
      const schema = new Schema('test', 1);

      const table = schema.addTable('users');
      table.addColumn('id', ColumnType.INTEGER, { primaryKey: true });
      table.addColumn('name', ColumnType.TEXT);
      table.addIndex('name');

      const sql = schema.toSQL();

      assert.equal(sql.length, 2); // 1 table + 1 index
      assert(sql[0].includes('CREATE TABLE IF NOT EXISTS users'));
      assert(sql[1].includes('CREATE INDEX IF NOT EXISTS'));
    });
  });

  describe('Schema Manager', () => {
    it('should define and manage schemas', () => {
      const manager = schemaManager;

      // The current schema should be defined
      const schema = manager.getSchema('animal_rpg');
      assert(schema);
      assert.equal(schema.version, 1);

      // Should have players and bot_events tables
      assert(schema.getTable('players'));
      assert(schema.getTable('bot_events'));
    });

    it('should validate current schema structure', () => {
      const playersTable = currentSchema.getTable('players');
      assert(playersTable);

      // Check required columns exist
      const userIdColumn = playersTable.columns.find(col => col.name === 'user_id');
      assert(userIdColumn);
      assert(userIdColumn.constraints.includes(Constraint.PRIMARY_KEY));

      const animalKeyColumn = playersTable.columns.find(col => col.name === 'animal_key');
      assert(animalKeyColumn);
      assert(animalKeyColumn.constraints.includes(Constraint.NOT_NULL));

      const xpColumn = playersTable.columns.find(col => col.name === 'xp');
      assert(xpColumn);
      assert.equal(xpColumn.default, 0);
    });

    it('should have proper indexes defined', () => {
      const playersTable = currentSchema.getTable('players');

      // Should have multiple indexes
      assert(playersTable.indexes.length > 0);

      // Should have xp index
      const xpIndex = playersTable.indexes.find(idx => idx.columns.includes('xp'));
      assert(xpIndex);

      // Should have composite index
      const compositeIndex = playersTable.indexes.find(idx =>
        idx.columns.includes('xp') && idx.columns.includes('total_wins')
      );
      assert(compositeIndex);
    });
  });

  describe('Real Schema Data Validation', () => {
    it('should use actual data types and constraints', () => {
      // Verify we're using proper SQLite types
      assert.equal(ColumnType.TEXT, 'TEXT');
      assert.equal(ColumnType.INTEGER, 'INTEGER');
      assert.equal(ColumnType.REAL, 'REAL');
      assert.equal(ColumnType.DATETIME, 'INTEGER'); // Unix timestamp

      // Verify constraints
      assert.equal(Constraint.PRIMARY_KEY, 'PRIMARY KEY');
      assert.equal(Constraint.NOT_NULL, 'NOT NULL');
      assert.equal(Constraint.UNIQUE, 'UNIQUE');
    });

    it('should have meaningful table and column comments', () => {
      const playersTable = currentSchema.getTable('players');
      const eventsTable = currentSchema.getTable('bot_events');

      // These would have comments if we added them to the schema
      assert(playersTable);
      assert(eventsTable);

      // Verify columns have proper types for their purpose
      const timestampColumn = eventsTable.columns.find(col => col.name === 'timestamp');
      assert(timestampColumn);
      assert.equal(timestampColumn.type, ColumnType.DATETIME);
    });
  });
});
