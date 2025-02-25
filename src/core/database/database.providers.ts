import * as path from 'path';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        entities: [path.resolve(__dirname, '../../**/*.entity{.ts,.js}')],
        synchronize: false,
        migrations: [
          path.resolve(__dirname, '../../core/migrations/*{.ts,.js}'),
        ],
        migrationsRun: true,
      });

      return dataSource.initialize();
    },
  },
];
