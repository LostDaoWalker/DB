/**
 * Code-based Dynamic Database Schema System
 *
 * This system allows defining database schemas in code and dynamically
 * creating/updating tables, indexes, and constraints.
 */

// Schema definition types
export const ColumnType = {
  TEXT: 'TEXT',
  INTEGER: 'INTEGER',
  REAL: 'REAL',
  BLOB: 'BLOB',
  BOOLEAN: 'INTEGER', // SQLite stores booleans as integers
  DATETIME: 'INTEGER', // Unix timestamp
  JSON: 'TEXT' // JSON stored as text
};

export const Constraint = {
  PRIMARY_KEY: 'PRIMARY KEY',
  NOT_NULL: 'NOT NULL',
  UNIQUE: 'UNIQUE',
  AUTOINCREMENT: 'AUTOINCREMENT'
};

export const IndexType = {
  INDEX: 'INDEX',
  UNIQUE_INDEX: 'UNIQUE INDEX'
};

// Schema definition classes
export class Column {
  constructor(name, type, options = {}) {
    this.name = name;
    this.type = type;
    this.constraints = [];
    this.default = options.default;
    this.comment = options.comment;

    if (options.primaryKey) {
      this.constraints.push(Constraint.PRIMARY_KEY);
      // PRIMARY KEY implies NOT NULL in SQLite, don't add explicit NOT NULL
    }
    if (options.notNull && !options.primaryKey) this.constraints.push(Constraint.NOT_NULL);
    if (options.unique) this.constraints.push(Constraint.UNIQUE);
    if (options.autoIncrement) this.constraints.push(Constraint.AUTOINCREMENT);
  }

  toSQL() {
    let sql = `${this.name} ${this.type}`;

    if (this.constraints.length > 0) {
      sql += ` ${this.constraints.join(' ')}`;
    }

    if (this.default !== undefined) {
      if (typeof this.default === 'string') {
        sql += ` DEFAULT '${this.default}'`;
      } else {
        sql += ` DEFAULT ${this.default}`;
      }
    }

    return sql;
  }
}

export class Table {
  constructor(name, options = {}) {
    this.name = name;
    this.columns = [];
    this.indexes = [];
    this.comment = options.comment;
    this.version = options.version || 1;
  }

  addColumn(name, type, options = {}) {
    const column = new Column(name, type, options);
    this.columns.push(column);
    return this;
  }

  addIndex(columns, options = {}) {
    const columnArray = Array.isArray(columns) ? columns : [columns];
    const indexName = options.name || `idx_${this.name}_${columnArray.join('_')}`;
    const isUnique = options.unique || false;

    this.indexes.push({
      name: indexName,
      columns: columnArray,
      unique: isUnique
    });

    return this;
  }

  toSQL() {
    const columnDefs = this.columns.map(col => col.toSQL()).join(',\n  ');

    let sql = `CREATE TABLE IF NOT EXISTS ${this.name} (\n  ${columnDefs}\n)`;

    return sql;
  }

  getIndexSQL() {
    return this.indexes.map(index => {
      const unique = index.unique ? 'UNIQUE ' : '';
      const columns = index.columns.join(', ');
      return `CREATE ${unique}INDEX IF NOT EXISTS ${index.name} ON ${this.name}(${columns})`;
    });
  }
}

export class Schema {
  constructor(name, version = 1) {
    this.name = name;
    this.version = version;
    this.tables = new Map();
  }

  addTable(name, options = {}) {
    const table = new Table(name, { ...options, version: this.version });
    this.tables.set(name, table);
    return table;
  }

  getTable(name) {
    return this.tables.get(name);
  }

  getAllTables() {
    return Array.from(this.tables.values());
  }

  toSQL() {
    const tableSQL = [];
    const indexSQL = [];

    for (const table of this.tables.values()) {
      tableSQL.push(table.toSQL());
      indexSQL.push(...table.getIndexSQL());
    }

    return [...tableSQL, ...indexSQL];
  }
}

// Migration system
export class Migration {
  constructor(fromVersion, toVersion) {
    this.fromVersion = fromVersion;
    this.toVersion = toVersion;
    this.changes = [];
  }

  addColumn(tableName, column) {
    this.changes.push({
      type: 'ADD_COLUMN',
      table: tableName,
      column: column
    });
    return this;
  }

  dropColumn(tableName, columnName) {
    this.changes.push({
      type: 'DROP_COLUMN',
      table: tableName,
      column: columnName
    });
    return this;
  }

  renameColumn(tableName, oldName, newName) {
    this.changes.push({
      type: 'RENAME_COLUMN',
      table: tableName,
      oldName,
      newName
    });
    return this;
  }

  addIndex(tableName, indexDef) {
    this.changes.push({
      type: 'ADD_INDEX',
      table: tableName,
      index: indexDef
    });
    return this;
  }

  dropIndex(tableName, indexName) {
    this.changes.push({
      type: 'DROP_INDEX',
      table: tableName,
      indexName
    });
    return this;
  }

  createTable(table) {
    this.changes.push({
      type: 'CREATE_TABLE',
      table: table
    });
    return this;
  }

  dropTable(tableName) {
    this.changes.push({
      type: 'DROP_TABLE',
      table: tableName
    });
    return this;
  }

  toSQL() {
    return this.changes.map(change => {
      switch (change.type) {
        case 'ADD_COLUMN':
          return `ALTER TABLE ${change.table} ADD COLUMN ${change.column.toSQL()}`;
        case 'DROP_COLUMN':
          return `ALTER TABLE ${change.table} DROP COLUMN ${change.column}`;
        case 'RENAME_COLUMN':
          return `ALTER TABLE ${change.table} RENAME COLUMN ${change.oldName} TO ${change.newName}`;
        case 'ADD_INDEX':
          const unique = change.index.unique ? 'UNIQUE ' : '';
          const columns = change.index.columns.join(', ');
          return `CREATE ${unique}INDEX IF NOT EXISTS ${change.index.name} ON ${change.table}(${columns})`;
        case 'DROP_INDEX':
          return `DROP INDEX IF EXISTS ${change.indexName}`;
        case 'CREATE_TABLE':
          return change.table.toSQL();
        case 'DROP_TABLE':
          return `DROP TABLE IF EXISTS ${change.table}`;
        default:
          throw new Error(`Unknown migration change type: ${change.type}`);
      }
    });
  }
}

export class SchemaManager {
  constructor() {
    this.schemas = new Map();
    this.migrations = new Map();
  }

  defineSchema(name, version, schemaBuilder) {
    const schema = new Schema(name, version);
    schemaBuilder(schema);
    this.schemas.set(name, schema);
    return schema;
  }

  addMigration(fromVersion, toVersion, migrationBuilder) {
    const migration = new Migration(fromVersion, toVersion);
    migrationBuilder(migration);
    const key = `${fromVersion}_to_${toVersion}`;
    this.migrations.set(key, migration);
    return migration;
  }

  getSchema(name) {
    return this.schemas.get(name);
  }

  getMigration(fromVersion, toVersion) {
    const key = `${fromVersion}_to_${toVersion}`;
    return this.migrations.get(key);
  }

  getAllMigrations() {
    return Array.from(this.migrations.values()).sort((a, b) => a.toVersion - b.toVersion);
  }
}

// Global schema manager instance
export const schemaManager = new SchemaManager();

// Define the current schema
export const currentSchema = schemaManager.defineSchema('animal_rpg', 1, (schema) => {
  // Players table
  const playersTable = schema.addTable('players', {
    comment: 'Player profiles and statistics'
  });

  playersTable
    .addColumn('user_id', ColumnType.TEXT, {
      primaryKey: true,
      comment: 'Discord user ID'
    })
    .addColumn('animal_key', ColumnType.TEXT, {
      notNull: true,
      comment: 'Selected animal type'
    })
    .addColumn('xp', ColumnType.INTEGER, {
      notNull: true,
      default: 0,
      comment: 'Experience points'
    })
    .addColumn('last_battle_at', ColumnType.DATETIME, {
      notNull: true,
      default: 0,
      comment: 'Timestamp of last battle'
    })
    .addColumn('created_at', ColumnType.DATETIME, {
      notNull: true,
      comment: 'Account creation timestamp'
    })
    .addColumn('registered_at', ColumnType.DATETIME, {
      notNull: true,
      default: 0,
      comment: 'Registration timestamp'
    })
    .addColumn('last_command_used', ColumnType.TEXT, {
      default: '',
      comment: 'Last command executed'
    })
    .addColumn('last_command_at', ColumnType.DATETIME, {
      default: 0,
      comment: 'Timestamp of last command'
    })
    .addColumn('commands_used', ColumnType.INTEGER, {
      default: 0,
      comment: 'Total commands executed'
    })
    .addColumn('total_battles', ColumnType.INTEGER, {
      default: 0,
      comment: 'Total battles participated in'
    })
    .addColumn('total_wins', ColumnType.INTEGER, {
      default: 0,
      comment: 'Total battles won'
    })
    .addColumn('total_losses', ColumnType.INTEGER, {
      default: 0,
      comment: 'Total battles lost'
    })
    .addColumn('current_streak', ColumnType.INTEGER, {
      default: 0,
      comment: 'Current win/loss streak'
    })
    .addColumn('best_streak', ColumnType.INTEGER, {
      default: 0,
      comment: 'Best win streak achieved'
    })
    .addColumn('last_played_at', ColumnType.DATETIME, {
      default: 0,
      comment: 'Last activity timestamp'
    });

  // Add indexes for performance
  playersTable
    .addIndex('animal_key', { comment: 'Index for animal-based queries' })
    .addIndex('registered_at', { comment: 'Index for registration date queries' })
    .addIndex('xp', { comment: 'Index for leaderboard queries' })
    .addIndex(['xp', 'total_wins'], { comment: 'Composite index for leaderboard sorting' })
    .addIndex('last_played_at', { comment: 'Index for activity queries' });

  // Bot events table
  const eventsTable = schema.addTable('bot_events', {
    comment: 'System events and logging'
  });

  eventsTable
    .addColumn('id', ColumnType.INTEGER, {
      primaryKey: true,
      autoIncrement: true,
      comment: 'Auto-incrementing event ID'
    })
    .addColumn('event_type', ColumnType.TEXT, {
      notNull: true,
      comment: 'Type of event (error, startup, etc.)'
    })
    .addColumn('timestamp', ColumnType.DATETIME, {
      notNull: true,
      comment: 'When the event occurred'
    })
    .addColumn('details', ColumnType.JSON, {
      comment: 'Additional event data as JSON'
    });

  // Add indexes for events
  eventsTable
    .addIndex('event_type', { comment: 'Index for event type queries' })
    .addIndex('timestamp', { comment: 'Index for time-based queries' });
});
