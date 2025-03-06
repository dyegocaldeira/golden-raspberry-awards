import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { TestDatabaseModule } from "./config/e2e-database.module";
import request from 'supertest';
import { CsvService } from "../src/core/csv-file/csv.service";
import { DataSource } from "typeorm";

describe('Producer (e2e)', () => {
    let app: INestApplication;
    let csvService: CsvService;
    let dataSource: DataSource;

    beforeEach(async () => {

        jest.clearAllMocks();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                TestDatabaseModule
            ],
        })
            .overrideProvider(CsvService)
            .useValue({
                readCSV: jest.fn()
            })
            .compile();

        app = moduleFixture.createNestApplication();

        csvService = moduleFixture.get<CsvService>(CsvService);
        dataSource = moduleFixture.get<DataSource>('DATA_SOURCE');
    });

    afterEach(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }

        await app.close();
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }

        await app.close();
    });

    describe('/api/producer/range-awards (GET)', () => {

        it('should return the producer with the smallest and the largest interval between wins', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1990, "title": "Movie A", "studios": "Studio 1", "producers": "Producer X", "winner": true },
                { "year": 1992, "title": "Movie B", "studios": "Studio 2", "producers": "Producer X", "winner": true },
                { "year": 2000, "title": "Movie C", "studios": "Studio 3", "producers": "Producer Y", "winner": true },
                { "year": 2010, "title": "Movie D", "studios": "Studio 4", "producers": "Producer Y", "winner": true },
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer X",
                        "interval": 2,
                        "previousWin": 1990,
                        "followingWin": 1992
                    }
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer Y",
                        "interval": 10,
                        "previousWin": 2000,
                        "followingWin": 2010
                    }
                ])
            });
        });

        it('should return two producers with the smallest interval and one with the largest interval', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1991, "title": "Movie A", "studios": "Studio 1", "producers": "Producer X", "winner": true },
                { "year": 1992, "title": "Movie B", "studios": "Studio 2", "producers": "Producer X", "winner": true },
                { "year": 2005, "title": "Movie F", "studios": "Studio 6", "producers": "Producer Z", "winner": true },
                { "year": 2006, "title": "Movie G", "studios": "Studio 7", "producers": "Producer Z", "winner": true },
                { "year": 2000, "title": "Movie C", "studios": "Studio 3", "producers": "Producer Y", "winner": true },
                { "year": 2010, "title": "Movie D", "studios": "Studio 4", "producers": "Producer Y", "winner": true }
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer X",
                        "interval": 1,
                        "previousWin": 1991,
                        "followingWin": 1992
                    },
                    {
                        "producer": "Producer Z",
                        "interval": 1,
                        "previousWin": 2005,
                        "followingWin": 2006
                    }
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer Y",
                        "interval": 10,
                        "previousWin": 2000,
                        "followingWin": 2010
                    }
                ])
            });
        });

        it('should return one producer with the smallest interval and two with the largest interval', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1990, "title": "Movie A", "studios": "Studio 1", "producers": "Producer X", "winner": true },
                { "year": 1992, "title": "Movie B", "studios": "Studio 2", "producers": "Producer X", "winner": true },
                { "year": 2000, "title": "Movie D", "studios": "Studio 4", "producers": "Producer Y", "winner": true },
                { "year": 2020, "title": "Movie E", "studios": "Studio 5", "producers": "Producer Y", "winner": true },
                { "year": 1995, "title": "Movie H", "studios": "Studio 8", "producers": "Producer W", "winner": true },
                { "year": 2015, "title": "Movie I", "studios": "Studio 9", "producers": "Producer W", "winner": true }
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer X",
                        "interval": 2,
                        "previousWin": 1990,
                        "followingWin": 1992
                    }
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer Y",
                        "interval": 20,
                        "previousWin": 2000,
                        "followingWin": 2020
                    },
                    {
                        "producer": "Producer W",
                        "interval": 20,
                        "previousWin": 1995,
                        "followingWin": 2015
                    }
                ])
            });
        });

        it('should return two producers with the smallest interval and two with the largest interval', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1991, "title": "Movie A", "studios": "Studio 1", "producers": "Producer X", "winner": true },
                { "year": 1992, "title": "Movie B", "studios": "Studio 2", "producers": "Producer X", "winner": true },
                { "year": 2005, "title": "Movie F", "studios": "Studio 6", "producers": "Producer Z", "winner": true },
                { "year": 2006, "title": "Movie G", "studios": "Studio 7", "producers": "Producer Z", "winner": true },
                { "year": 2000, "title": "Movie D", "studios": "Studio 4", "producers": "Producer Y", "winner": true },
                { "year": 2020, "title": "Movie E", "studios": "Studio 5", "producers": "Producer Y", "winner": true },
                { "year": 1995, "title": "Movie H", "studios": "Studio 8", "producers": "Producer W", "winner": true },
                { "year": 2015, "title": "Movie I", "studios": "Studio 9", "producers": "Producer W", "winner": true }
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer X",
                        "interval": 1,
                        "previousWin": 1991,
                        "followingWin": 1992
                    },
                    {
                        "producer": "Producer Z",
                        "interval": 1,
                        "previousWin": 2005,
                        "followingWin": 2006
                    }
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer Y",
                        "interval": 20,
                        "previousWin": 2000,
                        "followingWin": 2020
                    },
                    {
                        "producer": "Producer W",
                        "interval": 20,
                        "previousWin": 1995,
                        "followingWin": 2015
                    }
                ])
            });
        });

        it('should return two smallest intervals and one largest interval considering multiple producers', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1995, "title": "Movie A", "studios": "Studio 1", "producers": "Producer X and Producer Y", "winner": true },
                { "year": 1997, "title": "Movie B", "studios": "Studio 2", "producers": "Producer X and Producer Y", "winner": true },
                { "year": 2000, "title": "Movie C", "studios": "Studio 3 and Studio 4", "producers": "Producer Z", "winner": true },
                { "year": 2015, "title": "Movie D", "studios": "Studio 5", "producers": "Producer Z", "winner": true }
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer Y",
                        "interval": 2,
                        "previousWin": 1995,
                        "followingWin": 1997
                    },
                    {
                        "producer": "Producer X",
                        "interval": 2,
                        "previousWin": 1995,
                        "followingWin": 1997
                    },
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer Z",
                        "interval": 15,
                        "previousWin": 2000,
                        "followingWin": 2015
                    }
                ])
            });
        });

        it('should return the smallest interval with multiple producers and the largest interval for a single producer', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1988, "title": "Movie E", "studios": "Studio 1 and Studio 2", "producers": "Producer A", "winner": true },
                { "year": 1989, "title": "Movie F", "studios": "Studio 3", "producers": "Producer A", "winner": true },
                { "year": 1990, "title": "Movie G", "studios": "Studio 4", "producers": "Producer B and Producer C", "winner": true },
                { "year": 1991, "title": "Movie H", "studios": "Studio 5", "producers": "Producer B, Producer C and Producer D", "winner": true },
                { "year": 2020, "title": "Movie J", "studios": "Studio 8", "producers": "Producer D", "winner": true }
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer A",
                        "interval": 1,
                        "previousWin": 1988,
                        "followingWin": 1989
                    },
                    {
                        "producer": "Producer C",
                        "interval": 1,
                        "previousWin": 1990,
                        "followingWin": 1991
                    },
                    {
                        "producer": "Producer B",
                        "interval": 1,
                        "previousWin": 1990,
                        "followingWin": 1991
                    }
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer D",
                        "interval": 29,
                        "previousWin": 1991,
                        "followingWin": 2020
                    }
                ])
            });
        });

        it('should return one smallest interval and two largest intervals with multiple producers', async () => {
            csvService.readCSV = jest.fn().mockResolvedValue([
                { "year": 1992, "title": "Movie K", "studios": "Studio 1 and Studio 3", "producers": "Producer X", "winner": true },
                { "year": 1994, "title": "Movie L", "studios": "Studio 2 and Studio 4", "producers": "Producer X", "winner": true },
                { "year": 2000, "title": "Movie M", "studios": "Studio 5", "producers": "Producer Y and Producer Z", "winner": true },
                { "year": 2018, "title": "Movie N", "studios": "Studio 6", "producers": "Producer Y and Producer Z", "winner": true },
                { "year": 2022, "title": "Movie O", "studios": "Studio 7 and Studio 8", "producers": "Producer W", "winner": true },
                { "year": 2025, "title": "Movie P", "studios": "Studio 9", "producers": "Producer W", "winner": true }
            ]);

            await app.init();

            const response = await request(app.getHttpServer()).get('/api/producer/range-awards');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "min": expect.arrayContaining([
                    {
                        "producer": "Producer X",
                        "interval": 2,
                        "previousWin": 1992,
                        "followingWin": 1994
                    }
                ]),
                "max": expect.arrayContaining([
                    {
                        "producer": "Producer Z",
                        "interval": 18,
                        "previousWin": 2000,
                        "followingWin": 2018
                    },
                    {
                        "producer": "Producer Y",
                        "interval": 18,
                        "previousWin": 2000,
                        "followingWin": 2018
                    }
                ])
            });
        });
    });
});
