import { TypeOrmModuleOptions } from '@nestjs/typeorm';

type DBConfigs = {
  local: TypeOrmModuleOptions;
  test: TypeOrmModuleOptions;
  dev: TypeOrmModuleOptions;
};

const dbConfigs: DBConfigs = {
  local: {
    type: 'sqlite',
    database: 'data/local.sqlite',
    entities: ['dist/entities/**/*.entity.js'],
    migrations: ['dist/migrations/**/*.js'],
    logging: true,
    synchronize: true,
    extra: {
      timezone: '+09:00',
      charset: 'utf8mb4_bin',
    },
    cli: {
      migrationsDir: 'dist/migrations',
    },
  },
  test: {
    type: 'sqlite',
    database: 'data/test.sqlite',
    entities: ['src/entities/**/*.entity.ts'],
    migrations: ['src/migrations/**/*.ts'],
    logging: true,
    synchronize: true,
    extra: {
      timezone: '+09:00',
      charset: 'utf8mb4_bin',
    },
  },
  dev: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/entities/**/*.entity.js'],
    migrations: ['dist/migrations/**/*.js'],
    logging: true,
    synchronize: false,
    extra: {
      timezone: '+09:00',
      charset: 'utf8mb4_bin',
    },
    cli: {
      migrationsDir: 'dist/migrations',
    },
  },
};

const dbConfig: TypeOrmModuleOptions =
  dbConfigs[process.env.NODE_ENV || 'local'];
module.exports = dbConfig;
