import { Inject, Injectable } from '@nestjs/common';
import { Movies } from './movie.entity';
import { MovieEnum } from './movie.enum';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MovieEnum.MOVIE_REPOSITORY)
    private readonly movieRepository: Repository<Movies>,
  ) { }

  async saveMovies(movies: Movies[]): Promise<Movies[]> {
    return this.movieRepository.save(movies);
  }
}
