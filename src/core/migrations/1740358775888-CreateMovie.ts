import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovie1740358775888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movies" ( 
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "year" integer, 
                "title" varchar, 
                "winner" boolean NOT NULL
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies"`);
  }
}
