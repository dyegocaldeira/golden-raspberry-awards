import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudio1740368205720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "studios" ( 
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "name" varchar NOT NULL 
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "studios"`);
  }
}
