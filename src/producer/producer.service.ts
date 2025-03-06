import { Inject, Injectable } from '@nestjs/common';
import { ProducerEnum } from './producer.enum';
import { Producers } from './producer.entity';
import { IProducerAwards, IProducerRepository, IResultsProducerAwards } from './producer.interface';

@Injectable()
export class ProducerService {
  constructor(
    @Inject(ProducerEnum.PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository
  ) { }

  public async upsertProducer(producer: Producers): Promise<Producers> {
    return (await this.producerRepository.findByName(producer.name)) ?? this.producerRepository.save(producer);
  }

  public async getProducerWithAwardRange(): Promise<IResultsProducerAwards> {
    const databaseWinnerProducers = await this.producerRepository.findWinningProducers();

    const producerAwards = this.calculateAwardIntervals(databaseWinnerProducers);
    const awardIntervals = [...new Set(producerAwards.map(({ interval }) => interval))];
    const [minInterval, maxInterval] = [Math.min(...awardIntervals), Math.max(...awardIntervals)];

    return this.filterAwardsByInterval(minInterval, maxInterval, producerAwards);
  }

  private filterAwardsByInterval(minInterval: number, maxInterval: number, producerAwards: IProducerAwards[]): IResultsProducerAwards {

    return producerAwards.reduce(
      (acc, award) => {
        if (award.interval === minInterval) acc.min.push(award);
        if (award.interval === maxInterval) acc.max.push(award);
        return acc;
      },
      { min: [], max: [] } as IResultsProducerAwards
    );
  }

  private calculateAwardIntervals(winnerProducers: Producers[]): IProducerAwards[] {

    return winnerProducers.flatMap(({ name, movies }) => {
      if (movies.length < 2) return [];

      const sortedMovies = [...movies].sort((a, b) => a.year - b.year);
      return sortedMovies.slice(1).map((movie, i) => ({
        producer: name,
        interval: movie.year - sortedMovies[i].year,
        previousWin: sortedMovies[i].year,
        followingWin: movie.year,
      }));
    });
  }
}
