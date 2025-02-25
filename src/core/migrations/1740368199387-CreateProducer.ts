import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducer1740368199387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "producers" ( 
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "name" varchar NOT NULL 
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "producers"`);
  }
}
