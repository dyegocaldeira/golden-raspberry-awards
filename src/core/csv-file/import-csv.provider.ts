import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MovieService } from '../../movie/movie.service';
import { CsvService } from './csv.service';
import * as path from 'path';
import { Movies } from '../../movie/movie.entity';
import { StudioService } from '../../studio/studio.service';
import { ProducerService } from '../../producer/producer.service';
import { CsvType } from './csv.type';
import { Producers } from '../../producer/producer.entity';
import { Studios } from '../../studio/studio.entity';

@Injectable()
export class ImportCSVProvider implements OnModuleInit {

  private readonly logger = new Logger(ImportCSVProvider.name);

  constructor(
    private readonly csvService: CsvService,
    private readonly movieService: MovieService,
    private readonly studioService: StudioService,
    private readonly producerService: ProducerService,
  ) { }

  async onModuleInit() {
    const filePath = path.resolve(
      __dirname,
      process.env.NODE_ENV === 'test'
        ? '../../../test/data/__e2e__.csv'
        : '../../../data/movielist.csv',
    );

    this.logger.log('Iniciando importação de CSV...');

    try {
      const movieList: CsvType[] = await this.csvService.readCSV(filePath);

      if (movieList.length) {
        for (const movieData of movieList) {
          const fittedMovie = await this.fitMovieData(movieData);

          await this.movieService.saveMovies([fittedMovie]);
        }
        this.logger.log(
          `Importação concluída! ${movieList.length} registros inseridos.`,
        );
      } else {
        this.logger.log('Nenhum dado válido encontrado no CSV.');
      }
    } catch (error) {
      this.logger.error('Erro ao importar CSV:', error);
    }
  }

  private async fitMovieData(movieData: CsvType): Promise<Movies> {
    const movie = new Movies();
    movie.year = movieData.year;
    movie.title = movieData.title;
    movie.winner = movieData.winner as boolean;

    const producerArray = this.extractEntities(movieData.producers);
    const studioArray = this.extractEntities(movieData.studios);

    const [producers, studios] = await Promise.all([
      this.upsertProducers(producerArray),
      this.upsertStudios(studioArray),
    ]);

    movie.producers = producers;
    movie.studios = studios;

    return movie;
  }

  private async upsertProducers(names: string[]): Promise<Producers[]> {
    return Promise.all(
      names.map(async (name) =>
        this.producerService.upsertProducer(new Producers(name)),
      ),
    );
  }

  private async upsertStudios(names: string[]): Promise<Studios[]> {
    return Promise.all(
      names.map(async (name) =>
        this.studioService.upsertStudio(new Studios(name)),
      ),
    );
  }

  private extractEntities(data: string): string[] {
    return data
      .split(/,|and/)
      .map((entity) => entity.trim())
      .filter((entity) => entity !== '');
  }
}
