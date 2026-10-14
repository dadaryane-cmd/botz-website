import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`ui_general_locales\` ADD \`common_switch_to_light\` text;`)
  await db.run(sql`ALTER TABLE \`ui_general_locales\` ADD \`common_switch_to_dark\` text;`)
  await db.run(sql`ALTER TABLE \`ui_general_locales\` ADD \`common_pull_hint\` text;`)
  await db.run(sql`ALTER TABLE \`_ui_general_v_locales\` ADD \`version_common_switch_to_light\` text;`)
  await db.run(sql`ALTER TABLE \`_ui_general_v_locales\` ADD \`version_common_switch_to_dark\` text;`)
  await db.run(sql`ALTER TABLE \`_ui_general_v_locales\` ADD \`version_common_pull_hint\` text;`)
  await db.run(sql`ALTER TABLE \`ui_pricing_locales\` ADD \`pricing_see_details\` text;`)
  await db.run(sql`ALTER TABLE \`_ui_pricing_v_locales\` ADD \`version_pricing_see_details\` text;`)
  await db.run(sql`ALTER TABLE \`ui_forms_locales\` ADD \`form_choose\` text;`)
  await db.run(sql`ALTER TABLE \`_ui_forms_v_locales\` ADD \`version_form_choose\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`ui_general_locales\` DROP COLUMN \`common_switch_to_light\`;`)
  await db.run(sql`ALTER TABLE \`ui_general_locales\` DROP COLUMN \`common_switch_to_dark\`;`)
  await db.run(sql`ALTER TABLE \`ui_general_locales\` DROP COLUMN \`common_pull_hint\`;`)
  await db.run(sql`ALTER TABLE \`_ui_general_v_locales\` DROP COLUMN \`version_common_switch_to_light\`;`)
  await db.run(sql`ALTER TABLE \`_ui_general_v_locales\` DROP COLUMN \`version_common_switch_to_dark\`;`)
  await db.run(sql`ALTER TABLE \`_ui_general_v_locales\` DROP COLUMN \`version_common_pull_hint\`;`)
  await db.run(sql`ALTER TABLE \`ui_pricing_locales\` DROP COLUMN \`pricing_see_details\`;`)
  await db.run(sql`ALTER TABLE \`_ui_pricing_v_locales\` DROP COLUMN \`version_pricing_see_details\`;`)
  await db.run(sql`ALTER TABLE \`ui_forms_locales\` DROP COLUMN \`form_choose\`;`)
  await db.run(sql`ALTER TABLE \`_ui_forms_v_locales\` DROP COLUMN \`version_form_choose\`;`)
}
