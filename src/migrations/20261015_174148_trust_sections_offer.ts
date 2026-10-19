import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_team_founders_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team_founders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_founders_certifications_order_idx\` ON \`pages_blocks_team_founders_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_founders_certifications_parent_id_idx\` ON \`pages_blocks_team_founders_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_founders_certifications_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team_founders_certifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_team_founders_certifications_locales_locale_par\` ON \`pages_blocks_team_founders_certifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_founders\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`years\` text,
  	\`photo_id\` integer,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_founders_order_idx\` ON \`pages_blocks_team_founders\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_founders_parent_id_idx\` ON \`pages_blocks_team_founders\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_founders_photo_idx\` ON \`pages_blocks_team_founders\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_founders_locales\` (
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team_founders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_team_founders_locales_locale_parent_id_unique\` ON \`pages_blocks_team_founders_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_past_work\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text,
  	\`permission\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_past_work_order_idx\` ON \`pages_blocks_team_past_work\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_past_work_parent_id_idx\` ON \`pages_blocks_team_past_work\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_past_work_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team_past_work\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_team_past_work_locales_locale_parent_id_unique\` ON \`pages_blocks_team_past_work_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_order_idx\` ON \`pages_blocks_team\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_parent_id_idx\` ON \`pages_blocks_team\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_team_path_idx\` ON \`pages_blocks_team\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_team_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`past_work_heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_team_locales_locale_parent_id_unique\` ON \`pages_blocks_team_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_samples_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`file_path\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_samples\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_samples_items_order_idx\` ON \`pages_blocks_samples_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_samples_items_parent_id_idx\` ON \`pages_blocks_samples_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_samples_items_file_idx\` ON \`pages_blocks_samples_items\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_samples_items_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_samples_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_samples_items_locales_locale_parent_id_unique\` ON \`pages_blocks_samples_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_samples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_samples_order_idx\` ON \`pages_blocks_samples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_samples_parent_id_idx\` ON \`pages_blocks_samples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_samples_path_idx\` ON \`pages_blocks_samples\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_samples_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_samples\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_samples_locales_locale_parent_id_unique\` ON \`pages_blocks_samples_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_growth\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_growth_order_idx\` ON \`pages_blocks_growth\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_growth_parent_id_idx\` ON \`pages_blocks_growth\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_growth_path_idx\` ON \`pages_blocks_growth\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_growth_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_growth\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_growth_locales_locale_parent_id_unique\` ON \`pages_blocks_growth_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_offer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'page',
  	\`link_appearance\` text DEFAULT 'primary',
  	\`link_page_id\` integer,
  	\`link_path\` text,
  	\`link_url\` text,
  	\`link_contact\` text,
  	\`link_new_tab\` integer,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`link_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_offer_order_idx\` ON \`pages_blocks_offer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offer_parent_id_idx\` ON \`pages_blocks_offer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offer_path_idx\` ON \`pages_blocks_offer\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offer_link_link_page_idx\` ON \`pages_blocks_offer\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_offer_locales\` (
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_offer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_offer_locales_locale_parent_id_unique\` ON \`pages_blocks_offer_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_founders_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team_founders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_founders_certifications_order_idx\` ON \`_pages_v_blocks_team_founders_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_founders_certifications_parent_id_idx\` ON \`_pages_v_blocks_team_founders_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_founders_certifications_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team_founders_certifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_team_founders_certifications_locales_locale_\` ON \`_pages_v_blocks_team_founders_certifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_founders\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`years\` text,
  	\`photo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_founders_order_idx\` ON \`_pages_v_blocks_team_founders\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_founders_parent_id_idx\` ON \`_pages_v_blocks_team_founders\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_founders_photo_idx\` ON \`_pages_v_blocks_team_founders\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_founders_locales\` (
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team_founders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_team_founders_locales_locale_parent_id_uniqu\` ON \`_pages_v_blocks_team_founders_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_past_work\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`url\` text,
  	\`permission\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_past_work_order_idx\` ON \`_pages_v_blocks_team_past_work\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_past_work_parent_id_idx\` ON \`_pages_v_blocks_team_past_work\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_past_work_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team_past_work\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_team_past_work_locales_locale_parent_id_uniq\` ON \`_pages_v_blocks_team_past_work_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_order_idx\` ON \`_pages_v_blocks_team\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_parent_id_idx\` ON \`_pages_v_blocks_team\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_team_path_idx\` ON \`_pages_v_blocks_team\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_team_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`past_work_heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_team_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_team_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_samples_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`file_path\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_samples\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_samples_items_order_idx\` ON \`_pages_v_blocks_samples_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_samples_items_parent_id_idx\` ON \`_pages_v_blocks_samples_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_samples_items_file_idx\` ON \`_pages_v_blocks_samples_items\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_samples_items_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_samples_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_samples_items_locales_locale_parent_id_uniqu\` ON \`_pages_v_blocks_samples_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_samples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_samples_order_idx\` ON \`_pages_v_blocks_samples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_samples_parent_id_idx\` ON \`_pages_v_blocks_samples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_samples_path_idx\` ON \`_pages_v_blocks_samples\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_samples_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_samples\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_samples_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_samples_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_growth\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_growth_order_idx\` ON \`_pages_v_blocks_growth\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_growth_parent_id_idx\` ON \`_pages_v_blocks_growth\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_growth_path_idx\` ON \`_pages_v_blocks_growth\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_growth_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_growth\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_growth_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_growth_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_offer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'page',
  	\`link_appearance\` text DEFAULT 'primary',
  	\`link_page_id\` integer,
  	\`link_path\` text,
  	\`link_url\` text,
  	\`link_contact\` text,
  	\`link_new_tab\` integer,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`link_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offer_order_idx\` ON \`_pages_v_blocks_offer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offer_parent_id_idx\` ON \`_pages_v_blocks_offer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offer_path_idx\` ON \`_pages_v_blocks_offer\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offer_link_link_page_idx\` ON \`_pages_v_blocks_offer\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_offer_locales\` (
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_offer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_offer_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_offer_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`growth_offer_growth_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`channel\` text DEFAULT 'instagram' NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`growth_offer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`growth_offer_growth_metrics_order_idx\` ON \`growth_offer_growth_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`growth_offer_growth_metrics_parent_id_idx\` ON \`growth_offer_growth_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`growth_offer_growth_metrics_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`growth_offer_growth_metrics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`growth_offer_growth_metrics_locales_locale_parent_id_unique\` ON \`growth_offer_growth_metrics_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`growth_offer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`offer_enabled\` integer DEFAULT true,
  	\`offer_spots\` numeric DEFAULT 5,
  	\`offer_discount\` numeric,
  	\`offer_months\` numeric DEFAULT 3,
  	\`offer_spots_left\` numeric,
  	\`offer_show_spots_left\` integer DEFAULT false,
  	\`offer_show_audit\` integer DEFAULT true,
  	\`offer_show_trial\` integer DEFAULT true,
  	\`growth_last_updated\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`_growth_offer_v_version_growth_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`channel\` text DEFAULT 'instagram' NOT NULL,
  	\`value\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_growth_offer_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_growth_offer_v_version_growth_metrics_order_idx\` ON \`_growth_offer_v_version_growth_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_growth_offer_v_version_growth_metrics_parent_id_idx\` ON \`_growth_offer_v_version_growth_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_growth_offer_v_version_growth_metrics_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_growth_offer_v_version_growth_metrics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_growth_offer_v_version_growth_metrics_locales_locale_parent\` ON \`_growth_offer_v_version_growth_metrics_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_growth_offer_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_offer_enabled\` integer DEFAULT true,
  	\`version_offer_spots\` numeric DEFAULT 5,
  	\`version_offer_discount\` numeric,
  	\`version_offer_months\` numeric DEFAULT 3,
  	\`version_offer_spots_left\` numeric,
  	\`version_offer_show_spots_left\` integer DEFAULT false,
  	\`version_offer_show_audit\` integer DEFAULT true,
  	\`version_offer_show_trial\` integer DEFAULT true,
  	\`version_growth_last_updated\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_growth_offer_v_created_at_idx\` ON \`_growth_offer_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_growth_offer_v_updated_at_idx\` ON \`_growth_offer_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`ui_trust\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`ui_trust_locales\` (
  	\`trust_sample_label\` text,
  	\`trust_preview\` text,
  	\`trust_download\` text,
  	\`trust_sample_note\` text,
  	\`trust_preview_unavailable\` text,
  	\`trust_years\` text,
  	\`trust_certifications\` text,
  	\`trust_photo_of\` text,
  	\`trust_last_updated\` text,
  	\`trust_channel_instagram\` text,
  	\`trust_channel_website\` text,
  	\`trust_offer_badge\` text,
  	\`trust_offer_text\` text,
  	\`trust_spots_left\` text,
  	\`trust_offer_cta\` text,
  	\`trust_audit_note\` text,
  	\`trust_trial_note\` text,
  	\`trust_finder_link\` text,
  	\`trust_package_groups\` text,
  	\`trust_term\` text,
  	\`trust_reply_time\` text,
  	\`trust_finder_message\` text,
  	\`trust_theme_tooltip\` text,
  	\`trust_sample_report_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ui_trust\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`ui_trust_locales_locale_parent_id_unique\` ON \`ui_trust_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ui_trust_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_ui_trust_v_created_at_idx\` ON \`_ui_trust_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ui_trust_v_updated_at_idx\` ON \`_ui_trust_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_ui_trust_v_locales\` (
  	\`version_trust_sample_label\` text,
  	\`version_trust_preview\` text,
  	\`version_trust_download\` text,
  	\`version_trust_sample_note\` text,
  	\`version_trust_preview_unavailable\` text,
  	\`version_trust_years\` text,
  	\`version_trust_certifications\` text,
  	\`version_trust_photo_of\` text,
  	\`version_trust_last_updated\` text,
  	\`version_trust_channel_instagram\` text,
  	\`version_trust_channel_website\` text,
  	\`version_trust_offer_badge\` text,
  	\`version_trust_offer_text\` text,
  	\`version_trust_spots_left\` text,
  	\`version_trust_offer_cta\` text,
  	\`version_trust_audit_note\` text,
  	\`version_trust_trial_note\` text,
  	\`version_trust_finder_link\` text,
  	\`version_trust_package_groups\` text,
  	\`version_trust_term\` text,
  	\`version_trust_reply_time\` text,
  	\`version_trust_finder_message\` text,
  	\`version_trust_theme_tooltip\` text,
  	\`version_trust_sample_report_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ui_trust_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_ui_trust_v_locales_locale_parent_id_unique\` ON \`_ui_trust_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`side_card\` text DEFAULT 'offer';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero_locales\` ADD \`proof_line\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_package_preview\` ADD \`show_guide_link\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq_items\` ADD \`open_by_default\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`side_card\` text DEFAULT 'offer';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero_locales\` ADD \`proof_line\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_package_preview\` ADD \`show_guide_link\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq_items\` ADD \`open_by_default\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_team_founders_certifications\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_founders_certifications_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_founders\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_founders_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_past_work\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_past_work_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_team_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_samples_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_samples_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_samples\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_samples_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_growth\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_growth_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offer\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offer_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_founders_certifications\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_founders_certifications_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_founders\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_founders_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_past_work\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_past_work_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_team_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_samples_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_samples_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_samples\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_samples_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_growth\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_growth_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offer\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offer_locales\`;`)
  await db.run(sql`DROP TABLE \`growth_offer_growth_metrics\`;`)
  await db.run(sql`DROP TABLE \`growth_offer_growth_metrics_locales\`;`)
  await db.run(sql`DROP TABLE \`growth_offer\`;`)
  await db.run(sql`DROP TABLE \`_growth_offer_v_version_growth_metrics\`;`)
  await db.run(sql`DROP TABLE \`_growth_offer_v_version_growth_metrics_locales\`;`)
  await db.run(sql`DROP TABLE \`_growth_offer_v\`;`)
  await db.run(sql`DROP TABLE \`ui_trust\`;`)
  await db.run(sql`DROP TABLE \`ui_trust_locales\`;`)
  await db.run(sql`DROP TABLE \`_ui_trust_v\`;`)
  await db.run(sql`DROP TABLE \`_ui_trust_v_locales\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` DROP COLUMN \`side_card\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero_locales\` DROP COLUMN \`proof_line\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_package_preview\` DROP COLUMN \`show_guide_link\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq_items\` DROP COLUMN \`open_by_default\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` DROP COLUMN \`side_card\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero_locales\` DROP COLUMN \`proof_line\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_package_preview\` DROP COLUMN \`show_guide_link\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq_items\` DROP COLUMN \`open_by_default\`;`)
}
