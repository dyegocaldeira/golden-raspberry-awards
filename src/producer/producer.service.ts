import { Inject, Injectable } from '@nestjs/common';
import { ProducerEnum } from './producer.enum';
import { Repository } from 'typeorm';
import { Producers } from './producer.entity';

@Injectable()
export class ProducerService {
  constructor(
    @Inject(ProducerEnum.PRODUCER_REPOSITORY)
    private readonly producerRepository: Repository<Producers>,
  ) {}

  public async saveProducer(producer: Producers): Promise<Producers> {
    return this.producerRepository.save(producer);
  }

  public async upsertProducer(producer: Producers): Promise<Producers> {
    const databaseProducer = await this.producerRepository.findOne({
      where: {
        name: producer.name,
      },
    });

    return databaseProducer ?? this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producers[]> {
    return this.producerRepository
      .createQueryBuilder('producer')
      .leftJoinAndSelect('producer.movies', 'movie')
      .where('movie.winner = :winner', { winner: true })
      .getMany();
  }

  public async getProducerWithAwardRange(): Promise<ResultsProducerAwards> {
    const databaseWinnerProducers = await this.producerRepository
      .createQueryBuilder('producer')
      .leftJoinAndSelect('producer.movies', 'movie')
      .where('movie.winner = :winner', { winner: true })
      .getMany();

    const resultsProducerAwards: ResultsProducerAwards = {
      min: [],
      max: [],
    };

    resultsProducerAwards.min = this.getMinRange(databaseWinnerProducers);
    resultsProducerAwards.max = this.getMaxRange(databaseWinnerProducers);

    return resultsProducerAwards;
  }

  private getMinRange(winnerProducers: Producers[]): ProducerAwards[] {
    const producerAwards = this.calculateProducerAwards(
      winnerProducers,
      (a, b) => a < b,
      Number.MAX_SAFE_INTEGER,
    );
    const minInterval = Math.min(
      ...producerAwards.map((producer) => producer.interval),
    );
    return producerAwards.filter(
      (producer) => producer.interval === minInterval,
    );
  }

  private getMaxRange(winnerProducers: Producers[]): ProducerAwards[] {
    const producerAwards = this.calculateProducerAwards(
      winnerProducers,
      (a, b) => a > b,
      0,
    );
    const maxInterval = Math.max(
      ...producerAwards.map((producer) => producer.interval),
    );

    return producerAwards.filter(
      (producer) => producer.interval === maxInterval,
    );
  }

  private calculateProducerAwards(
    winnerProducers: Producers[],
    comparator: (a: number, b: number) => boolean,
    initialValue: number,
  ): ProducerAwards[] {
    const results = winnerProducers
      .filter((producer) => producer.movies.length > 1)
      .map((producer) => {
        const producerMovies = producer.movies.sort((a, b) => a.year - b.year);
        let bestInterval = initialValue;
        let previousWin = 0;
        let followingWin = 0;

        for (let i = 1; i < producerMovies.length; i++) {
          const interval = producerMovies[i].year - producerMovies[i - 1].year;
          if (comparator(interval, bestInterval)) {
            bestInterval = interval;
            previousWin = producerMovies[i - 1].year;
            followingWin = producerMovies[i].year;
          }
        }

        return {
          producer: producer.name,
          interval: bestInterval,
          previousWin,
          followingWin,
        };
      });

    return results;
  }
}
