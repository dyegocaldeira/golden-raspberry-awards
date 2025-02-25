import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { TestDatabaseModule } from "./config/e2e-database.module";
import * as request from 'supertest';

describe('Producer (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                TestDatabaseModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();
    });

    it('/api/producer/range-awards (GET)', async () => {

        const response = await request(app.getHttpServer())
            .get('/api/producer/range-awards')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({
                "min": [
                    {
                        "producer": "Joel Silver",
                        "interval": 1,
                        "previousWin": 1990,
                        "followingWin": 1991
                    }
                ],
                "max": [
                    {
                        "producer": "Matthew Vaughn",
                        "interval": 13,
                        "previousWin": 2002,
                        "followingWin": 2015
                    }
                ]
            });

        return response;
    });

    afterAll(async () => {
        await app.close();
    });
});
