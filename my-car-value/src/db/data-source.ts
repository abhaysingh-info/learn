import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: Partial<DataSourceOptions> = {
  //   type: 'sqlite',
  //   database: 'db.sqlite',
  //   entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dataSourceOptions, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
    });
    break;
  case 'test':
    Object.assign(dataSourceOptions, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['./src/**/*.entity.ts'],
      migrations: ['migrations/*.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error(
      `Unknown Environment, Please set NODE_ENV to 'development', 'production', or 'test'`,
    );
    break;
}

const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);

export default dataSource;
