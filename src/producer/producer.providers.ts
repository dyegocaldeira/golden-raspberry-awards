import { DataSource } from 'typeorm';
import { ProducerEnum } from './producer.enum';
import { Producers } from './producer.entity';
import { ProducerRepository } from './producer.repository';

export const producerProviders = [
  {
    provide: ProducerEnum.PRODUCER_REPOSITORY,
    useFactory: (dataSource: DataSource) => new ProducerRepository(dataSource.getRepository(Producers)),
    inject: [ProducerEnum.DATA_SOURCE],
  },
];