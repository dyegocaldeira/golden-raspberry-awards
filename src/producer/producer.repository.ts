import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Producers } from './producer.entity';
import { IProducerRepository } from './producer.interface';

@Injectable()
export class ProducerRepository implements IProducerRepository {
    constructor(private readonly repository: Repository<Producers>) { }

    async findByName(name: string): Promise<Producers | null> {
        return this.repository.findOne({ where: { name } });
    }

    async save(producer: Producers): Promise<Producers> {
        return this.repository.save(producer);
    }

    async findWinningProducers(): Promise<Producers[]> {
        return this.repository
            .createQueryBuilder('producer')
            .leftJoinAndSelect('producer.movies', 'movie')
            .where('movie.winner = :winner', { winner: true })
            .getMany();
    }

    async count(): Promise<number> {
        return this.repository.count();
    }
}
