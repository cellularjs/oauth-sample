import { MigrationInterface, QueryRunner } from "typeorm"

export class OauthApp1689276261388 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE oauth_app (
        id uuid DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        "desc" VARCHAR,
        "website" VARCHAR,
        logo VARCHAR,
        secret VARCHAR NOT NULL,
        "redirectURIs" TEXT,
        "ownerId" uuid NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE oauth_app;');
  }

}
