import { Inject, Injectable } from '@nestjs/common';
import { Movies } from './movie.entity';
import { MovieEnum } from './movie.enum';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MovieEnum.MOVIE_REPOSITORY)
    private readonly movieRepository: Repository<Movies>,
  ) {}

  async findAll(): Promise<Movies[]> {
    return this.movieRepository.find({
      relations: ['producers', 'studios'],
    });
  }

  async saveMovies(movies: Movies[]): Promise<Movies[]> {
    return this.movieRepository.save(movies);
  }

  async getRangeAwards(): Promise<Movies[]> {
    const databaseWinnerMovies = this.movieRepository.find({
      where: {
        winner: true,
      },
    });

    return databaseWinnerMovies;
  }
}
