import { DataSource } from 'typeorm';
import { Movies } from '../../src/movie/movie.entity';
import { Producers } from '../../src/producer/producer.entity';
import { Studios } from '../../src/studio/studio.entity';

export const testDatabaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'sqlite',
                database: ':memory:',
                entities: [Movies, Producers, Studios],
                synchronize: true,
                dropSchema: true
            });

            return dataSource.initialize();
        },
    }
];
