import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovieStudios1740368676366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE movies_studios_studios (
                moviesId INTEGER NOT NULL,
                studiosId INTEGER NOT NULL,
                PRIMARY KEY (moviesId, studiosId),
                FOREIGN KEY (moviesId) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (studiosId) REFERENCES studios(id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies_studios_studios"`);
  }
}
