import { MigrationInterface, QueryRunner } from "typeorm"

export class OauthUser1689276255853 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE oauth_user (
        id uuid DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR,
        avatar VARCHAR,
        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE oauth_user;');
  }

}
