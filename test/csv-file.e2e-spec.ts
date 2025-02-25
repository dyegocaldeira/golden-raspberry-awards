import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { MovieModule } from '../src/movie/movie.module';
import { ProducerModule } from '../src/producer/producer.module';
import { StudioModule } from '../src/studio/studio.module';
import { TestDatabaseModule } from './config/e2e-database.module';
import { Movies } from '../src/movie/movie.entity';
import { Repository } from 'typeorm';
import { Producers } from '../src/producer/producer.entity';
import { Studios } from '../src/studio/studio.entity';
import { ProducerEnum } from '../src/producer/producer.enum';
import { MovieEnum } from '../src/movie/movie.enum';
import { StudioEnum } from '../src/studio/studio.enum';

describe('ImportCSVProvider (e2e)', () => {
    let app: INestApplication;
    let moviesRepository: Repository<Movies>;
    let producerRepository: Repository<Producers>;
    let studioRepository: Repository<Studios>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                MovieModule,
                ProducerModule,
                StudioModule,
                TestDatabaseModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();

        moviesRepository = moduleFixture.get<Repository<Movies>>(MovieEnum.MOVIE_REPOSITORY);
        producerRepository = moduleFixture.get<Repository<Producers>>(ProducerEnum.PRODUCER_REPOSITORY);
        studioRepository = moduleFixture.get<Repository<Studios>>(StudioEnum.STUDIO_REPOSITORY);
    });

    it('should import CSV data and save movies', async () => {
        const countMovies = await moviesRepository.count();
        const countProducers = await producerRepository.count();
        const countStudios = await studioRepository.count();

        expect(countMovies).toBe(206);
        expect(countProducers).toBe(367);
        expect(countStudios).toBe(59);
    });

    afterAll(async () => {
        await app.close();
    });
});
