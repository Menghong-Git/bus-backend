import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSeatHoldExpiryNullable1762673758719 implements MigrationInterface {
    name = 'UpdateSeatHoldExpiryNullable1762673758719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seats" ADD "row" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "seats" ADD "position" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seats" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "seats" DROP COLUMN "row"`);
    }

}
