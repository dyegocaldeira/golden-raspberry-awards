import { DataSource } from 'typeorm';
import { ProducerEnum } from './producer.enum';
import { Producers } from './producer.entity';

export const producerProviders = [
  {
    provide: ProducerEnum.PRODUCER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Producers),
    inject: [ProducerEnum.DATA_SOURCE],
  },
];
