import sqlite3 from 'sqlite3';
import { logger } from '../logger.js';
import { currentSchema, schemaManager } from './schema.js';

/**
 * Schema Executor - Applies code-defined schemas to the database
 */
export class SchemaExecutor {
  constructor(db) {
    this.db = db;
  }

  /**
   * Execute all SQL statements from a schema
   */
  async executeSchema(schema) {
    const statements = schema.toSQL();

    for (const sql of statements) {
      await this.runSQL(sql);
    }

    logger.info({ tableCount: schema.tables.size, statements: statements.length }, 'Schema executed successfully');
  }

  /**
   * Execute a migration
   */
  async executeMigration(migration) {
    const statements = migration.toSQL();

    for (const sql of statements) {
      await this.runSQL(sql);
    }

    logger.info({
      fromVersion: migration.fromVersion,
      toVersion: migration.toVersion,
      changes: statements.length
    }, 'Migration executed successfully');
  }

  /**
   * Run a single SQL statement
   */
  runSQL(sql) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          logger.error({ err, sql }, 'Failed to execute SQL');
          reject(err);
        } else {
          logger.debug({ sql: sql.substring(0, 100) + '...' }, 'SQL executed');
          resolve();
        }
      });
    });
  }

  /**
   * Run a SQL query and get results
   */
  getSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          logger.error({ err, sql }, 'Failed to execute query');
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Run a SQL query and get all results
   */
  allSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error({ err, sql }, 'Failed to execute query');
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Check if a table exists
   */
  async tableExists(tableName) {
    const result = await this.getSQL(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName]
    );
    return !!result;
  }

  /**
   * Get table schema information
   */
  async getTableInfo(tableName) {
    return await this.allSQL(`PRAGMA table_info(${tableName})`);
  }

  /**
   * Get all indexes for a table
   */
  async getTableIndexes(tableName) {
    return await this.allSQL(
      "SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name=? AND name NOT LIKE 'sqlite_%'",
      [tableName]
    );
  }

  /**
   * Validate that the current database matches the expected schema
   */
  async validateSchema(schema) {
    const issues = [];

    for (const table of schema.getAllTables()) {
      // Check if table exists
      const tableExists = await this.tableExists(table.name);
      if (!tableExists) {
        issues.push(`Table '${table.name}' does not exist`);
        continue;
      }

      // Check columns
      const tableInfo = await this.getTableInfo(table.name);
      const existingColumns = new Map(tableInfo.map(col => [col.name, col]));

      for (const expectedColumn of table.columns) {
        const existingColumn = existingColumns.get(expectedColumn.name);

        if (!existingColumn) {
          issues.push(`Column '${expectedColumn.name}' missing in table '${table.name}'`);
          continue;
        }

        // Check column type
        if (existingColumn.type !== expectedColumn.type) {
          issues.push(`Column '${expectedColumn.name}' type mismatch: expected ${expectedColumn.type}, got ${existingColumn.type}`);
        }

        // Check constraints
        const expectedNotNull = expectedColumn.constraints.includes('NOT NULL');
        const actualNotNull = existingColumn.notnull === 1;

        if (expectedNotNull !== actualNotNull) {
          issues.push(`Column '${expectedColumn.name}' NOT NULL constraint mismatch`);
        }

        const expectedPK = expectedColumn.constraints.includes('PRIMARY KEY');
        const actualPK = existingColumn.pk === 1;

        if (expectedPK !== actualPK) {
          issues.push(`Column '${expectedColumn.name}' PRIMARY KEY constraint mismatch`);
        }
      }

      // Check indexes
      const existingIndexes = await this.getTableIndexes(table.name);
      const existingIndexNames = new Set(existingIndexes.map(idx => idx.name));

      for (const expectedIndex of table.indexes) {
        if (!existingIndexNames.has(expectedIndex.name)) {
          issues.push(`Index '${expectedIndex.name}' missing on table '${table.name}'`);
        }
      }
    }

    return issues;
  }

  /**
   * Repair schema by adding missing tables, columns, and indexes
   */
  async repairSchema(schema) {
    const repairs = [];

    for (const table of schema.getAllTables()) {
      // Check if table exists
      const tableExists = await this.tableExists(table.name);
      if (!tableExists) {
        // Create missing table
        await this.runSQL(table.toSQL());
        repairs.push(`Created missing table '${table.name}'`);
        continue;
      }

      // Check columns
      const tableInfo = await this.getTableInfo(table.name);
      const existingColumns = new Map(tableInfo.map(col => [col.name, col]));

      for (const expectedColumn of table.columns) {
        const existingColumn = existingColumns.get(expectedColumn.name);

        if (!existingColumn) {
          // Add missing column
          await this.runSQL(`ALTER TABLE ${table.name} ADD COLUMN ${expectedColumn.toSQL()}`);
          repairs.push(`Added missing column '${expectedColumn.name}' to table '${table.name}'`);
        }
        // Note: We don't modify existing columns to avoid data loss
        // Type/constraint mismatches should be handled manually
      }

      // Check indexes
      const existingIndexes = await this.getTableIndexes(table.name);
      const existingIndexNames = new Set(existingIndexes.map(idx => idx.name));

      for (const expectedIndex of table.indexes) {
        if (!existingIndexNames.has(expectedIndex.name)) {
          // Add missing index
          const indexSQL = table.getIndexSQL().find(sql => sql.includes(expectedIndex.name));
          if (indexSQL) {
            await this.runSQL(indexSQL);
            repairs.push(`Added missing index '${expectedIndex.name}' to table '${table.name}'`);
          }
        }
      }
    }

    return repairs;
  }

  /**
   * Initialize database with current schema
   */
  async initialize() {
    try {
      // Configure SQLite pragmas for performance
      await this.runSQL('PRAGMA journal_mode = WAL');
      await this.runSQL('PRAGMA synchronous = NORMAL');
      await this.runSQL('PRAGMA temp_store = MEMORY');
      await this.runSQL('PRAGMA cache_size = 5000');
      await this.runSQL('PRAGMA foreign_keys = ON');

      // First, try to execute the schema (creates tables if they don't exist)
      await this.executeSchema(currentSchema);

      // Then validate and repair any missing components
      const issues = await this.validateSchema(currentSchema);

      if (issues.length > 0) {
        logger.warn({ issues }, 'Schema validation found issues, attempting repair');

        const repairs = await this.repairSchema(currentSchema);

        if (repairs.length > 0) {
          logger.info({ repairs }, 'Schema repairs applied successfully');

          // Validate again after repairs
          const remainingIssues = await this.validateSchema(currentSchema);
          if (remainingIssues.length > 0) {
            logger.warn({ remainingIssues }, 'Some schema issues could not be automatically resolved');
          } else {
            logger.info('Schema fully repaired and validated');
          }
        } else {
          logger.warn('No automatic repairs were applied');
        }
      } else {
        logger.info('Schema validation passed - no repairs needed');
      }

    } catch (err) {
      logger.error({ err }, 'Failed to initialize database schema');
      throw err;
    }
  }
}
