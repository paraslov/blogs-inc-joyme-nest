import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1735384814289 implements MigrationInterface {
    name = 'InitMigration1735384814289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(10) NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."likes_status_enum" AS ENUM('Like', 'None', 'Dislike')`);
        await queryRunner.query(`CREATE TABLE "likes" ("parent_id" character varying NOT NULL, "status" "public"."likes_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "user_login" character varying(10) NOT NULL, CONSTRAINT "PK_f6d27f7c00f1230c886a605c393" PRIMARY KEY ("parent_id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "devices" ("device_id" uuid NOT NULL, "device_name" character varying(255) NOT NULL, "user_id" uuid NOT NULL, "ip" character varying(255) NOT NULL, "iat" integer, "exp" integer, CONSTRAINT "PK_2667f40edb344d6f274a0d42b6f" PRIMARY KEY ("device_id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parent_id" uuid NOT NULL, "content" character varying(300) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "user_login" character varying(10) NOT NULL, "likes_count" integer, "dislikes_count" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) NOT NULL, "description" character varying(500) NOT NULL, "website_url" character varying(100) NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "is_membership" boolean, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(30) NOT NULL, "short_description" character varying(100) NOT NULL, "content" character varying(1000) NOT NULL, "blog_id" uuid NOT NULL, "blog_name" character varying(15) NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "likes_count" integer, "dislikes_count" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_confirmation_info" ("user_id" uuid NOT NULL, "confirmation_code" uuid NOT NULL, "confirmation_code_expiration_date" TIMESTAMP NOT NULL, "is_confirmed" boolean NOT NULL, "password_recovery_code" uuid, "password_recovery_code_expiration_date" TIMESTAMP, "is_password_recovery_confirmed" boolean, CONSTRAINT "UQ_3ec143e93b12a89147c8d8a78fe" UNIQUE ("confirmation_code"), CONSTRAINT "UQ_dedbe413c6c93781f2937502749" UNIQUE ("password_recovery_code"), CONSTRAINT "PK_5a3f4854acc5803fa69447df8d2" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_confirmation_info" ADD CONSTRAINT "FK_5a3f4854acc5803fa69447df8d2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_confirmation_info" DROP CONSTRAINT "FK_5a3f4854acc5803fa69447df8d2"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7689491fe4377a8090576a799a0"`);
        await queryRunner.query(`DROP TABLE "users_confirmation_info"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TYPE "public"."likes_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
