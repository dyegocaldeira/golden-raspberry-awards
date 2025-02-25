import { DataSource } from 'typeorm';
import { join } from 'path';
import { ProducerEnum } from '../../src/producer/producer.enum';

export const testDatabaseProviders = [
    {
        provide: ProducerEnum.DATA_SOURCE,
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'sqlite',
                database: ':memory:',
                entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
                synchronize: true,
                dropSchema: true
            });

            return dataSource.initialize();
        },
    },
];
