import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { MovieModule } from '../src/movie/movie.module';
import { ProducerModule } from '../src/producer/producer.module';
import { StudioModule } from '../src/studio/studio.module';
import { TestDatabaseModule } from './config/e2e-database.module';
import { Movies } from '../src/movie/movie.entity';
import { DataSource, Repository } from 'typeorm';
import { Studios } from '../src/studio/studio.entity';
import { ProducerEnum } from '../src/producer/producer.enum';
import { MovieEnum } from '../src/movie/movie.enum';
import { StudioEnum } from '../src/studio/studio.enum';
import { IProducerRepository } from '../src/producer/producer.interface';

jest.setTimeout(10000);

describe('ImportCSVProvider (e2e)', () => {
    let app: INestApplication;
    let moviesRepository: Repository<Movies>;
    let producerRepository: IProducerRepository;
    let studioRepository: Repository<Studios>;
    let dataSource: DataSource;

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
        producerRepository = moduleFixture.get<IProducerRepository>(ProducerEnum.PRODUCER_REPOSITORY);;
        studioRepository = moduleFixture.get<Repository<Studios>>(StudioEnum.STUDIO_REPOSITORY);
        dataSource = moduleFixture.get<DataSource>('DATA_SOURCE');

    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }

        await app.close();
    });

    it('should read CSV, structure the data and insert it into the database.', async () => {
        const countMovies = await moviesRepository.count();
        const countProducers = await producerRepository.count();
        const countStudios = await studioRepository.count();

        expect(countMovies).toBe(206);
        expect(countProducers).toBe(367);
        expect(countStudios).toBe(59);
    });
});
