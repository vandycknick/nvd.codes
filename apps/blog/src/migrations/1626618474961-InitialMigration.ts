import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialMigration1626618474961 implements MigrationInterface {
  name = "InitialMigration1626618474961"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" varchar2(255), "title" varchar2(255) NOT NULL, "description" varchar2(255) NOT NULL, "date" timestamp NOT NULL, "draft" number, "content" clob NOT NULL, "categories" clob NOT NULL, "slug" varchar2(255) NOT NULL, "readingTime" varchar2(255) NOT NULL, "cover" varchar2(255) NOT NULL, "placeholder" clob NOT NULL, "placeholderCss" clob NOT NULL, "editUrl" varchar2(255) NOT NULL, "sha256" varchar2(255) NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "images" ("id" varchar2(255), "url" varchar2(255) NOT NULL, "placeholder" clob NOT NULL, "sha256" varchar2(255) NOT NULL, "postId" varchar2(255), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "syncpostsjob" ("id" varchar2(255), "repository" varchar2(255) NOT NULL, "branch" varchar2(255) NOT NULL, "commitSha" varchar2(255) NOT NULL, "startedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "finishedAt" timestamp, "messages" clob NOT NULL, "error" varchar2(255), CONSTRAINT "PK_5842e41d3c8f1b1b46fb549aed0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_3ccad79db4407727f9c81f84905" FOREIGN KEY ("postId") REFERENCES "posts" ("id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_3ccad79db4407727f9c81f84905"`,
    )
    await queryRunner.query(`DROP TABLE "syncpostsjob"`)
    await queryRunner.query(`DROP TABLE "images"`)
    await queryRunner.query(`DROP TABLE "posts"`)
  }
}
