import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovieProducers1740368672374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE movies_producers_producers (
                moviesId INTEGER NOT NULL,
                producersId INTEGER NOT NULL,
                PRIMARY KEY (moviesId, producersId),
                FOREIGN KEY (moviesId) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (producersId) REFERENCES producers(id) ON DELETE CASCADE
            );  
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies_producers_producers"`);
  }
}
