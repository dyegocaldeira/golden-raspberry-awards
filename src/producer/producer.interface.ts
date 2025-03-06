import { Producers } from "./producer.entity";

export interface IProducerAwards {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IResultsProducerAwards {
  min: IProducerAwards[];
  max: IProducerAwards[];
}

export interface IProducerRepository {
  findByName(name: string): Promise<Producers | null>;
  save(producer: Producers): Promise<Producers>;
  findWinningProducers(): Promise<Producers[]>;
  count(): Promise<number>;
}