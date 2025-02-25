import { DataSource } from 'typeorm';
import { Movies } from './movie.entity';
import { MovieEnum } from './movie.enum';

export const movieProviders = [
  {
    provide: MovieEnum.MOVIE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Movies),
    inject: [MovieEnum.DATA_SOURCE],
  },
];
