import { MigrationInterface, QueryRunner } from "typeorm";

export class init1674009552847 implements MigrationInterface {
    name = 'init1674009552847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE "user_id_seq"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" INT DEFAULT nextval('"user_id_seq"') NOT NULL, "phone" varchar(20) NOT NULL, "first_name" varchar(50) NOT NULL, "last_name" varchar(50) NOT NULL, "username" varchar(15) NOT NULL, "password" varchar(255) NOT NULL, "email" varchar(50) NOT NULL, "is_root" bool NOT NULL, "is_active" bool NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE "client_id_seq"`);
        await queryRunner.query(`CREATE TABLE "client" ("id" INT DEFAULT nextval('"client_id_seq"') NOT NULL, "first_name" varchar(50) NOT NULL, "last_name" varchar(50) NOT NULL, "phone" varchar(50) NOT NULL, "email" varchar(50) NOT NULL, "address" varchar(255) NOT NULL, "create_at" timestamptz NOT NULL DEFAULT current_timestamp(), "update_at" timestamptz NOT NULL DEFAULT current_timestamp(), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE "term_id_seq"`);
        await queryRunner.query(`CREATE TABLE "term" ("id" INT DEFAULT nextval('"term_id_seq"') NOT NULL, "periods" int2 NOT NULL, "annual_interest_rate" decimal NOT NULL, "late_payment_fee" decimal NOT NULL, "begin_to_apply_date" date NOT NULL, "cut_off_day" int2 NOT NULL, "create_at" timestamptz NOT NULL DEFAULT current_timestamp(), "update_at" timestamptz NOT NULL DEFAULT current_timestamp(), "loanId" int8, CONSTRAINT "PK_55b0479f0743f2e5d5ec414821e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4ad3974bada23aedf576d3fd29" ON "term" ("loanId") `);
        await queryRunner.query(`CREATE SEQUENCE "balance_id_seq"`);
        await queryRunner.query(`CREATE TABLE "balance" ("id" INT DEFAULT nextval('"balance_id_seq"') NOT NULL, "ammount" decimal NOT NULL, "create_at" timestamptz NOT NULL DEFAULT current_timestamp(), "update_at" timestamptz NOT NULL DEFAULT current_timestamp(), CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE "loan_id_seq"`);
        await queryRunner.query(`CREATE TABLE "loan" ("id" INT DEFAULT nextval('"loan_id_seq"') NOT NULL, "ammount" decimal NOT NULL, "start_date" date NOT NULL, "create_at" timestamptz NOT NULL DEFAULT current_timestamp(), "update_at" timestamptz NOT NULL DEFAULT current_timestamp(), "clientId" int8, "balance_id" int8, CONSTRAINT "REL_3b84a1785723e9a48be059d487" UNIQUE ("balance_id"), CONSTRAINT "PK_4ceda725a323d254a5fd48bf95f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f873513f98291a8440e255163" ON "loan" ("clientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b84a1785723e9a48be059d487" ON "loan" ("balance_id") `);
        await queryRunner.query(`CREATE SEQUENCE "payment_id_seq"`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" INT DEFAULT nextval('"payment_id_seq"') NOT NULL, "date" date NOT NULL, "ammount" decimal NOT NULL, "applied_to_interest" decimal NOT NULL, "applied_to_principal" decimal NOT NULL, "ending_balance" decimal NOT NULL, "extra_credit" decimal NOT NULL, "description" varchar(255) NOT NULL, "create_at" timestamptz NOT NULL DEFAULT current_timestamp(), "update_at" timestamptz NOT NULL DEFAULT current_timestamp(), "loanId" int8, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_47d8439ec0f7527bf93454c119" ON "payment" ("loanId") `);
        await queryRunner.query(`ALTER TABLE "term" ADD CONSTRAINT "FK_4ad3974bada23aedf576d3fd293" FOREIGN KEY ("loanId") REFERENCES "loan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan" ADD CONSTRAINT "FK_7f873513f98291a8440e255163f" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan" ADD CONSTRAINT "FK_3b84a1785723e9a48be059d487f" FOREIGN KEY ("balance_id") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_47d8439ec0f7527bf93454c1194" FOREIGN KEY ("loanId") REFERENCES "loan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_47d8439ec0f7527bf93454c1194"`);
        await queryRunner.query(`ALTER TABLE "loan" DROP CONSTRAINT "FK_3b84a1785723e9a48be059d487f"`);
        await queryRunner.query(`ALTER TABLE "loan" DROP CONSTRAINT "FK_7f873513f98291a8440e255163f"`);
        await queryRunner.query(`ALTER TABLE "term" DROP CONSTRAINT "FK_4ad3974bada23aedf576d3fd293"`);
        await queryRunner.query(`DROP INDEX "payment"@"IDX_47d8439ec0f7527bf93454c119" CASCADE`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP SEQUENCE "payment_id_seq"`);
        await queryRunner.query(`DROP INDEX "loan"@"IDX_3b84a1785723e9a48be059d487" CASCADE`);
        await queryRunner.query(`DROP INDEX "loan"@"IDX_7f873513f98291a8440e255163" CASCADE`);
        await queryRunner.query(`DROP TABLE "loan"`);
        await queryRunner.query(`DROP SEQUENCE "loan_id_seq"`);
        await queryRunner.query(`DROP TABLE "balance"`);
        await queryRunner.query(`DROP SEQUENCE "balance_id_seq"`);
        await queryRunner.query(`DROP INDEX "term"@"IDX_4ad3974bada23aedf576d3fd29" CASCADE`);
        await queryRunner.query(`DROP TABLE "term"`);
        await queryRunner.query(`DROP SEQUENCE "term_id_seq"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP SEQUENCE "client_id_seq"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP SEQUENCE "user_id_seq"`);
    }

}
