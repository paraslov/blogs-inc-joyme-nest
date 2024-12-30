import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1735572025219 implements MigrationInterface {
    name = 'InitMigration1735572025219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_89cd1ceb17c3a4868a42ee00d4" ON "likes" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4e87d7bb503878ba410f379aa" ON "blogs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_60818528127866f5002e7f826d" ON "posts" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_60818528127866f5002e7f826d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4e87d7bb503878ba410f379aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89cd1ceb17c3a4868a42ee00d4"`);
    }

}
