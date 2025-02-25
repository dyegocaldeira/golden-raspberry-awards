import { DataSource } from 'typeorm';
import { StudioEnum } from './studio.enum';
import { Studios } from './studio.entity';

export const studioProviders = [
  {
    provide: StudioEnum.STUDIO_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Studios),
    inject: [StudioEnum.DATA_SOURCE],
  },
];
