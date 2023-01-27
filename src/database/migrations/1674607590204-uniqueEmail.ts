import { MigrationInterface, QueryRunner } from "typeorm";

export class uniqueEmail1674607590204 implements MigrationInterface {
    name = 'uniqueEmail1674607590204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "user"@"UQ_e12875dfb3b1d92d7d7c5377e22" CASCADE`);
    }

}
