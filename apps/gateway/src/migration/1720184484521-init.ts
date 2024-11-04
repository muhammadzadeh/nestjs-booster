import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1720184484521 implements MigrationInterface {
  name = 'Init1720184484521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('not_read', 'read')`);
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_group_type_enum" AS ENUM('success', 'inform', 'failure')`,
    );
    await queryRunner.query(`CREATE TYPE "public"."notifications_priority_enum" AS ENUM('low', 'medium', 'high')`);
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_alert_status_enum" AS ENUM('none', 'not_read', 'read')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event" character varying NOT NULL, "version" character varying NOT NULL DEFAULT '1.0', "user_id" uuid, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'not_read', "group_type" "public"."notifications_group_type_enum" NOT NULL, "priority" "public"."notifications_priority_enum" NOT NULL, "alert_status" "public"."notifications_alert_status_enum" NOT NULL DEFAULT 'none', "show_as_alert" boolean NOT NULL, "notification_center_data" jsonb, "email_data" jsonb, "push_data" jsonb, "sms_data" jsonb, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "notifications_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "notifications_user_id_idx" ON "notifications" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "notifications_status_idx" ON "notifications" ("status") `);
    await queryRunner.query(`CREATE TYPE "public"."notification_push_tokens_provider_enum" AS ENUM('fcm', 'apn')`);
    await queryRunner.query(
      `CREATE TABLE "notification_push_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" character varying NOT NULL, "provider" "public"."notification_push_tokens_provider_enum" NOT NULL DEFAULT 'fcm', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "notification_push_tokens_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city_regions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "city_id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "city_regions_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state_id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "cities_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "iso3" character(3) NOT NULL, "iso2" character(2) NOT NULL, "numeric_code" character(3) NOT NULL, "phone_code" character varying NOT NULL, "currency" character varying NOT NULL, "currency_name" character varying NOT NULL, "currency_symbol" character varying NOT NULL, "native" character varying, "region" character varying NOT NULL, "subregion" character varying NOT NULL, "nationality" character varying NOT NULL, "timezones" jsonb, "translations" jsonb NOT NULL, "emoji" character varying NOT NULL, "emojiU" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "countries_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_id" uuid NOT NULL, "name" character varying NOT NULL, "state_code" character varying NOT NULL, "type" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "states_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."otp_logs_type_enum" AS ENUM('code', 'token')`);
    await queryRunner.query(`CREATE TYPE "public"."otp_logs_reason_enum" AS ENUM('login', 'verify', 'reset_password')`);
    await queryRunner.query(
      `CREATE TABLE "otp_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "destination" character varying NOT NULL, "otp" character varying NOT NULL, "user_id" uuid NOT NULL, "type" "public"."otp_logs_type_enum" NOT NULL, "reason" "public"."otp_logs_reason_enum" NOT NULL, "expire_at" TIMESTAMP WITH TIME ZONE, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "otp_logs_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."attachments_visibility_enum" AS ENUM('public', 'private')`);
    await queryRunner.query(
      `CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "name" character varying NOT NULL, "original_name" character varying, "visibility" "public"."attachments_visibility_enum" NOT NULL, "mime_type" jsonb, "uploader_id" uuid NOT NULL, "is_draft" boolean NOT NULL, "is_shared" boolean NOT NULL, "share_token" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "attachments_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "attachments_uploader_id_idx" ON "attachments" ("uploader_id") `);
    await queryRunner.query(`CREATE INDEX "attachments_uploader_share_token_idx" ON "attachments" ("share_token") `);
    await queryRunner.query(
      `CREATE TABLE "attachment_users" ("attachment_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "attachment_users_attachment_id_user_id_pkey" PRIMARY KEY ("attachment_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "permissions" character varying array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, "is_system_role" boolean NOT NULL, CONSTRAINT "roles_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fist_name" character varying, "last_name" character varying, "full_name" character varying, "email" character varying, "mobile" character varying, "avatar" character varying, "avatar_id" uuid, "password" character varying, "username" character varying, "is_blocked" boolean NOT NULL DEFAULT false, "is_email_verified" boolean NOT NULL DEFAULT false, "is_mobile_verified" boolean NOT NULL DEFAULT false, "role_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, "last_logged_in_at" TIMESTAMP WITH TIME ZONE, "password_updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "users_mobile_u" UNIQUE ("mobile"), CONSTRAINT "users_email_u" UNIQUE ("email"), CONSTRAINT "users_identifier_check" CHECK (email IS NOT NULL OR mobile IS NOT NULL), CONSTRAINT "users_id_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email") `);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_MOBILE" ON "users" ("mobile") `);
    await queryRunner.query(
      `ALTER TABLE "city_regions" ADD CONSTRAINT "city_regions_city_id_cities_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_states_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ADD CONSTRAINT "states_country_id_countries_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "states_country_id_countries_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "cities_state_id_states_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "city_regions" DROP CONSTRAINT "city_regions_city_id_cities_id_fkey"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_USERS_MOBILE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_USERS_EMAIL"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "attachment_users"`);
    await queryRunner.query(`DROP INDEX "public"."attachments_uploader_share_token_idx"`);
    await queryRunner.query(`DROP INDEX "public"."attachments_uploader_id_idx"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(`DROP TYPE "public"."attachments_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "otp_logs"`);
    await queryRunner.query(`DROP TYPE "public"."otp_logs_reason_enum"`);
    await queryRunner.query(`DROP TYPE "public"."otp_logs_type_enum"`);
    await queryRunner.query(`DROP TABLE "states"`);
    await queryRunner.query(`DROP TABLE "countries"`);
    await queryRunner.query(`DROP TABLE "cities"`);
    await queryRunner.query(`DROP TABLE "city_regions"`);
    await queryRunner.query(`DROP TABLE "notification_push_tokens"`);
    await queryRunner.query(`DROP TYPE "public"."notification_push_tokens_provider_enum"`);
    await queryRunner.query(`DROP INDEX "public"."notifications_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."notifications_user_id_idx"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_alert_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_group_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
  }
}
