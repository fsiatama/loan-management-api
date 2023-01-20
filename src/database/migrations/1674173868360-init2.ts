import { MigrationInterface, QueryRunner } from "typeorm";

export class init21674173868360 implements MigrationInterface {
    name = 'init21674173868360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance" RENAME COLUMN "ammount" TO "amount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance" RENAME COLUMN "amount" TO "ammount"`);
    }

}
