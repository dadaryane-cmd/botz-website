import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_enabled_locales\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_enabled_locales_order_idx\` ON \`pages_enabled_locales\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_enabled_locales_parent_idx\` ON \`pages_enabled_locales\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_buttons_order_idx\` ON \`pages_blocks_hero_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_buttons_parent_id_idx\` ON \`pages_blocks_hero_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_buttons_page_idx\` ON \`pages_blocks_hero_buttons\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_buttons_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hero_buttons_locales_locale_parent_id_unique\` ON \`pages_blocks_hero_buttons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_ticker_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_ticker_items_order_idx\` ON \`pages_blocks_hero_ticker_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_ticker_items_parent_id_idx\` ON \`pages_blocks_hero_ticker_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_ticker_items_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero_ticker_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hero_ticker_items_locales_locale_parent_id_uniq\` ON \`pages_blocks_hero_ticker_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'mark',
  	\`media_id\` integer,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_media_idx\` ON \`pages_blocks_hero\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`subheading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hero_locales_locale_parent_id_unique\` ON \`pages_blocks_hero_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_points_order_idx\` ON \`pages_blocks_split_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_points_parent_id_idx\` ON \`pages_blocks_split_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_points_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split_points\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_split_points_locales_locale_parent_id_unique\` ON \`pages_blocks_split_points_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_buttons_order_idx\` ON \`pages_blocks_split_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_buttons_parent_id_idx\` ON \`pages_blocks_split_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_buttons_page_idx\` ON \`pages_blocks_split_buttons\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_buttons_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_split_buttons_locales_locale_parent_id_unique\` ON \`pages_blocks_split_buttons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_split_order_idx\` ON \`pages_blocks_split\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_parent_id_idx\` ON \`pages_blocks_split\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_split_path_idx\` ON \`pages_blocks_split\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_split_locales\` (
  	\`eyebrow\` text,
  	\`statement\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_split\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_split_locales_locale_parent_id_unique\` ON \`pages_blocks_split_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_order_idx\` ON \`pages_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_parent_id_idx\` ON \`pages_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_path_idx\` ON \`pages_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_rich_text_locales_locale_parent_id_unique\` ON \`pages_blocks_rich_text_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`aspect\` text DEFAULT 'auto',
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_order_idx\` ON \`pages_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_parent_id_idx\` ON \`pages_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_path_idx\` ON \`pages_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_media_idx\` ON \`pages_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_block_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_media_block\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_media_block_locales_locale_parent_id_unique\` ON \`pages_blocks_media_block_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_items_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_items_highlights_order_idx\` ON \`pages_blocks_services_items_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_items_highlights_parent_id_idx\` ON \`pages_blocks_services_items_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_items_highlights_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services_items_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_services_items_highlights_locales_locale_parent\` ON \`pages_blocks_services_items_highlights_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service\` text,
  	\`index\` text,
  	\`link_type\` text DEFAULT 'page',
  	\`link_appearance\` text DEFAULT 'primary',
  	\`link_page_id\` integer,
  	\`link_path\` text,
  	\`link_url\` text,
  	\`link_contact\` text,
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`link_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_items_order_idx\` ON \`pages_blocks_services_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_items_parent_id_idx\` ON \`pages_blocks_services_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_items_link_link_page_idx\` ON \`pages_blocks_services_items\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_items_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_services_items_locales_locale_parent_id_unique\` ON \`pages_blocks_services_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_services_order_idx\` ON \`pages_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_parent_id_idx\` ON \`pages_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_path_idx\` ON \`pages_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_services_locales_locale_parent_id_unique\` ON \`pages_blocks_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_package_preview_categories\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages_blocks_package_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_package_preview_categories_order_idx\` ON \`pages_blocks_package_preview_categories\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_package_preview_categories_parent_idx\` ON \`pages_blocks_package_preview_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_package_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`duration\` text DEFAULT '12',
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
  await db.run(sql`CREATE INDEX \`pages_blocks_package_preview_order_idx\` ON \`pages_blocks_package_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_package_preview_parent_id_idx\` ON \`pages_blocks_package_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_package_preview_path_idx\` ON \`pages_blocks_package_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_package_preview_link_link_page_idx\` ON \`pages_blocks_package_preview\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_package_preview_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_package_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_package_preview_locales_locale_parent_id_unique\` ON \`pages_blocks_package_preview_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_pricing\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`default_category\` text DEFAULT 'smm',
  	\`default_duration\` text DEFAULT '6',
  	\`lock_category\` integer,
  	\`show_addons\` integer DEFAULT true,
  	\`show_comparison\` integer DEFAULT true,
  	\`show_terms\` integer DEFAULT true,
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
  await db.run(sql`CREATE INDEX \`pages_blocks_pricing_order_idx\` ON \`pages_blocks_pricing\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pricing_parent_id_idx\` ON \`pages_blocks_pricing\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pricing_path_idx\` ON \`pages_blocks_pricing\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_pricing_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_pricing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_pricing_locales_locale_parent_id_unique\` ON \`pages_blocks_pricing_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category\` text DEFAULT 'smm',
  	\`default_duration\` text DEFAULT '6',
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
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_order_idx\` ON \`pages_blocks_comparison\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_parent_id_idx\` ON \`pages_blocks_comparison\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparison_path_idx\` ON \`pages_blocks_comparison\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparison_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparison\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_comparison_locales_locale_parent_id_unique\` ON \`pages_blocks_comparison_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_guide\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_guide_order_idx\` ON \`pages_blocks_guide\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_guide_parent_id_idx\` ON \`pages_blocks_guide\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_guide_path_idx\` ON \`pages_blocks_guide\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_guide_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_guide_locales_locale_parent_id_unique\` ON \`pages_blocks_guide_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_process_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_process\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_process_steps_order_idx\` ON \`pages_blocks_process_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_process_steps_parent_id_idx\` ON \`pages_blocks_process_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_process_steps_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_process_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_process_steps_locales_locale_parent_id_unique\` ON \`pages_blocks_process_steps_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_process\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_process_order_idx\` ON \`pages_blocks_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_process_parent_id_idx\` ON \`pages_blocks_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_process_path_idx\` ON \`pages_blocks_process\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_process_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_process\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_process_locales_locale_parent_id_unique\` ON \`pages_blocks_process_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_order_idx\` ON \`pages_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_parent_id_idx\` ON \`pages_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_items_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_faq_items_locales_locale_parent_id_unique\` ON \`pages_blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`structured_data\` integer DEFAULT true,
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
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_faq_locales_locale_parent_id_unique\` ON \`pages_blocks_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_people\` integer DEFAULT true,
  	\`show_form\` integer DEFAULT true,
  	\`show_direct\` integer DEFAULT true,
  	\`default_service\` text,
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
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_order_idx\` ON \`pages_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_parent_id_idx\` ON \`pages_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_path_idx\` ON \`pages_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_contact_locales_locale_parent_id_unique\` ON \`pages_blocks_contact_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_buttons_order_idx\` ON \`pages_blocks_cta_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_buttons_parent_id_idx\` ON \`pages_blocks_cta_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_buttons_page_idx\` ON \`pages_blocks_cta_buttons\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_buttons_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_cta_buttons_locales_locale_parent_id_unique\` ON \`pages_blocks_cta_buttons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_cta_locales_locale_parent_id_unique\` ON \`pages_blocks_cta_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_collection_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'caseStudies',
  	\`limit\` numeric DEFAULT 6,
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
  await db.run(sql`CREATE INDEX \`pages_blocks_collection_list_order_idx\` ON \`pages_blocks_collection_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_collection_list_parent_id_idx\` ON \`pages_blocks_collection_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_collection_list_path_idx\` ON \`pages_blocks_collection_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_collection_list_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_collection_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_collection_list_locales_locale_parent_id_unique\` ON \`pages_blocks_collection_list_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`page_type\` text DEFAULT 'standard',
  	\`seed_key\` text,
  	\`meta_noindex\` integer,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_seed_key_idx\` ON \`pages\` (\`seed_key\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_locales\` (
  	\`title\` text,
  	\`slug\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_slug_idx\` ON \`pages_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_texts_order_parent\` ON \`pages_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_enabled_locales\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_enabled_locales_order_idx\` ON \`_pages_v_version_enabled_locales\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_enabled_locales_parent_idx\` ON \`_pages_v_version_enabled_locales\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_buttons_order_idx\` ON \`_pages_v_blocks_hero_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_buttons_parent_id_idx\` ON \`_pages_v_blocks_hero_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_buttons_page_idx\` ON \`_pages_v_blocks_hero_buttons\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_buttons_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hero_buttons_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_hero_buttons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_ticker_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_ticker_items_order_idx\` ON \`_pages_v_blocks_hero_ticker_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_ticker_items_parent_id_idx\` ON \`_pages_v_blocks_hero_ticker_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_ticker_items_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero_ticker_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hero_ticker_items_locales_locale_parent_id_u\` ON \`_pages_v_blocks_hero_ticker_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text DEFAULT 'mark',
  	\`media_id\` integer,
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_media_idx\` ON \`_pages_v_blocks_hero\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`subheading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hero_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_hero_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_points_order_idx\` ON \`_pages_v_blocks_split_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_points_parent_id_idx\` ON \`_pages_v_blocks_split_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_points_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split_points\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_split_points_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_split_points_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_buttons_order_idx\` ON \`_pages_v_blocks_split_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_buttons_parent_id_idx\` ON \`_pages_v_blocks_split_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_buttons_page_idx\` ON \`_pages_v_blocks_split_buttons\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_buttons_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_split_buttons_locales_locale_parent_id_uniqu\` ON \`_pages_v_blocks_split_buttons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_order_idx\` ON \`_pages_v_blocks_split\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_parent_id_idx\` ON \`_pages_v_blocks_split\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_split_path_idx\` ON \`_pages_v_blocks_split\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_split_locales\` (
  	\`eyebrow\` text,
  	\`statement\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_split\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_split_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_split_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_order_idx\` ON \`_pages_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_parent_id_idx\` ON \`_pages_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_path_idx\` ON \`_pages_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_rich_text_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_rich_text_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`aspect\` text DEFAULT 'auto',
  	\`settings_background\` text DEFAULT 'default',
  	\`settings_align\` text DEFAULT 'start',
  	\`settings_width\` text DEFAULT 'normal',
  	\`settings_anchor\` text,
  	\`settings_padding_top\` text DEFAULT 'md',
  	\`settings_padding_bottom\` text DEFAULT 'md',
  	\`settings_hidden\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_order_idx\` ON \`_pages_v_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_parent_id_idx\` ON \`_pages_v_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_path_idx\` ON \`_pages_v_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_media_idx\` ON \`_pages_v_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_block_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_media_block\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_media_block_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_media_block_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_items_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_services_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_items_highlights_order_idx\` ON \`_pages_v_blocks_services_items_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_items_highlights_parent_id_idx\` ON \`_pages_v_blocks_services_items_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_items_highlights_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_services_items_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_services_items_highlights_locales_locale_par\` ON \`_pages_v_blocks_services_items_highlights_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`service\` text,
  	\`index\` text,
  	\`link_type\` text DEFAULT 'page',
  	\`link_appearance\` text DEFAULT 'primary',
  	\`link_page_id\` integer,
  	\`link_path\` text,
  	\`link_url\` text,
  	\`link_contact\` text,
  	\`link_new_tab\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`link_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_items_order_idx\` ON \`_pages_v_blocks_services_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_items_parent_id_idx\` ON \`_pages_v_blocks_services_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_items_link_link_page_idx\` ON \`_pages_v_blocks_services_items\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_items_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_services_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_services_items_locales_locale_parent_id_uniq\` ON \`_pages_v_blocks_services_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_order_idx\` ON \`_pages_v_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_parent_id_idx\` ON \`_pages_v_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_services_path_idx\` ON \`_pages_v_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_services_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_services_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_package_preview_categories\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v_blocks_package_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_package_preview_categories_order_idx\` ON \`_pages_v_blocks_package_preview_categories\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_package_preview_categories_parent_idx\` ON \`_pages_v_blocks_package_preview_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_package_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`duration\` text DEFAULT '12',
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_package_preview_order_idx\` ON \`_pages_v_blocks_package_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_package_preview_parent_id_idx\` ON \`_pages_v_blocks_package_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_package_preview_path_idx\` ON \`_pages_v_blocks_package_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_package_preview_link_link_page_idx\` ON \`_pages_v_blocks_package_preview\` (\`link_page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_package_preview_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_package_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_package_preview_locales_locale_parent_id_uni\` ON \`_pages_v_blocks_package_preview_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_pricing\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`default_category\` text DEFAULT 'smm',
  	\`default_duration\` text DEFAULT '6',
  	\`lock_category\` integer,
  	\`show_addons\` integer DEFAULT true,
  	\`show_comparison\` integer DEFAULT true,
  	\`show_terms\` integer DEFAULT true,
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pricing_order_idx\` ON \`_pages_v_blocks_pricing\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pricing_parent_id_idx\` ON \`_pages_v_blocks_pricing\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pricing_path_idx\` ON \`_pages_v_blocks_pricing\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_pricing_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_pricing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_pricing_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_pricing_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category\` text DEFAULT 'smm',
  	\`default_duration\` text DEFAULT '6',
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_order_idx\` ON \`_pages_v_blocks_comparison\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_parent_id_idx\` ON \`_pages_v_blocks_comparison\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparison_path_idx\` ON \`_pages_v_blocks_comparison\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparison_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparison\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_comparison_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_comparison_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_guide\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_guide_order_idx\` ON \`_pages_v_blocks_guide\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_guide_parent_id_idx\` ON \`_pages_v_blocks_guide\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_guide_path_idx\` ON \`_pages_v_blocks_guide\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_guide_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_guide_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_guide_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_process_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_process\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_process_steps_order_idx\` ON \`_pages_v_blocks_process_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_process_steps_parent_id_idx\` ON \`_pages_v_blocks_process_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_process_steps_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_process_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_process_steps_locales_locale_parent_id_uniqu\` ON \`_pages_v_blocks_process_steps_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_process\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_process_order_idx\` ON \`_pages_v_blocks_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_process_parent_id_idx\` ON \`_pages_v_blocks_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_process_path_idx\` ON \`_pages_v_blocks_process\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_process_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_process\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_process_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_process_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_order_idx\` ON \`_pages_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_parent_id_idx\` ON \`_pages_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_items_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_faq_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`structured_data\` integer DEFAULT true,
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_faq_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_people\` integer DEFAULT true,
  	\`show_form\` integer DEFAULT true,
  	\`show_direct\` integer DEFAULT true,
  	\`default_service\` text,
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_order_idx\` ON \`_pages_v_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_parent_id_idx\` ON \`_pages_v_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_path_idx\` ON \`_pages_v_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_contact_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_contact_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_buttons_order_idx\` ON \`_pages_v_blocks_cta_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_buttons_parent_id_idx\` ON \`_pages_v_blocks_cta_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_buttons_page_idx\` ON \`_pages_v_blocks_cta_buttons\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_buttons_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_cta_buttons_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_cta_buttons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_cta_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_cta_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_collection_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'caseStudies',
  	\`limit\` numeric DEFAULT 6,
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_collection_list_order_idx\` ON \`_pages_v_blocks_collection_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_collection_list_parent_id_idx\` ON \`_pages_v_blocks_collection_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_collection_list_path_idx\` ON \`_pages_v_blocks_collection_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_collection_list_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_collection_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_collection_list_locales_locale_parent_id_uni\` ON \`_pages_v_blocks_collection_list_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_page_type\` text DEFAULT 'standard',
  	\`version_seed_key\` text,
  	\`version_meta_noindex\` integer,
  	\`version_meta_canonical\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_seed_key_idx\` ON \`_pages_v\` (\`version_seed_key\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_published_locale_idx\` ON \`_pages_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_locales\` (
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v_locales\` (\`version_slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_texts_order_parent\` ON \`_pages_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category\` text,
  	\`folder_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumb_url\` text,
  	\`sizes_thumb_width\` numeric,
  	\`sizes_thumb_height\` numeric,
  	\`sizes_thumb_mime_type\` text,
  	\`sizes_thumb_filesize\` numeric,
  	\`sizes_thumb_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_wide_url\` text,
  	\`sizes_wide_width\` numeric,
  	\`sizes_wide_height\` numeric,
  	\`sizes_wide_mime_type\` text,
  	\`sizes_wide_filesize\` numeric,
  	\`sizes_wide_filename\` text,
  	FOREIGN KEY (\`folder_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`media_folder_idx\` ON \`media\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumb_sizes_thumb_filename_idx\` ON \`media\` (\`sizes_thumb_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_wide_sizes_wide_filename_idx\` ON \`media\` (\`sizes_wide_filename\`);`)
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_services\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_services_order_idx\` ON \`case_studies_services\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_services_parent_idx\` ON \`case_studies_services\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_gallery_order_idx\` ON \`case_studies_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_gallery_parent_id_idx\` ON \`case_studies_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_gallery_media_idx\` ON \`case_studies_gallery\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_gallery_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`case_studies_gallery_locales_locale_parent_id_unique\` ON \`case_studies_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`verified\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_results_order_idx\` ON \`case_studies_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_results_parent_id_idx\` ON \`case_studies_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_results_locales\` (
  	\`metric\` text,
  	\`timeframe\` text,
  	\`context\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies_results\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`case_studies_results_locales_locale_parent_id_unique\` ON \`case_studies_results_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client\` text,
  	\`permission_confirmed\` integer,
  	\`permission_note\` text,
  	\`cover_id\` integer,
  	\`preview_video_id\` integer,
  	\`featured\` integer,
  	\`published_at\` text,
  	\`meta_noindex\` integer,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`preview_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_cover_idx\` ON \`case_studies\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_preview_video_idx\` ON \`case_studies\` (\`preview_video_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_updated_at_idx\` ON \`case_studies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_created_at_idx\` ON \`case_studies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies__status_idx\` ON \`case_studies\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_locales\` (
  	\`title\` text,
  	\`slug\` text,
  	\`summary\` text,
  	\`challenge\` text,
  	\`work\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_slug_idx\` ON \`case_studies_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_meta_meta_image_idx\` ON \`case_studies_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`case_studies_locales_locale_parent_id_unique\` ON \`case_studies_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_version_services\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_case_studies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_services_order_idx\` ON \`_case_studies_v_version_services\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_services_parent_idx\` ON \`_case_studies_v_version_services\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_gallery_order_idx\` ON \`_case_studies_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_gallery_parent_id_idx\` ON \`_case_studies_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_gallery_media_idx\` ON \`_case_studies_v_version_gallery\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_version_gallery_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_v_version_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_case_studies_v_version_gallery_locales_locale_parent_id_uni\` ON \`_case_studies_v_version_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_version_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`verified\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_results_order_idx\` ON \`_case_studies_v_version_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_results_parent_id_idx\` ON \`_case_studies_v_version_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_version_results_locales\` (
  	\`metric\` text,
  	\`timeframe\` text,
  	\`context\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_v_version_results\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_case_studies_v_version_results_locales_locale_parent_id_uni\` ON \`_case_studies_v_version_results_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_client\` text,
  	\`version_permission_confirmed\` integer,
  	\`version_permission_note\` text,
  	\`version_cover_id\` integer,
  	\`version_preview_video_id\` integer,
  	\`version_featured\` integer,
  	\`version_published_at\` text,
  	\`version_meta_noindex\` integer,
  	\`version_meta_canonical\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_preview_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_parent_idx\` ON \`_case_studies_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_cover_idx\` ON \`_case_studies_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_preview_video_idx\` ON \`_case_studies_v\` (\`version_preview_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_updated_at_idx\` ON \`_case_studies_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_created_at_idx\` ON \`_case_studies_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version__status_idx\` ON \`_case_studies_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_created_at_idx\` ON \`_case_studies_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_updated_at_idx\` ON \`_case_studies_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_snapshot_idx\` ON \`_case_studies_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_published_locale_idx\` ON \`_case_studies_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_latest_idx\` ON \`_case_studies_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_autosave_idx\` ON \`_case_studies_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_locales\` (
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_summary\` text,
  	\`version_challenge\` text,
  	\`version_work\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_slug_idx\` ON \`_case_studies_v_locales\` (\`version_slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_meta_version_meta_image_idx\` ON \`_case_studies_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_case_studies_v_locales_locale_parent_id_unique\` ON \`_case_studies_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text,
  	\`company\` text,
  	\`photo_id\` integer,
  	\`source\` text,
  	\`permission_confirmed\` integer,
  	\`permission_note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_photo_idx\` ON \`testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials__status_idx\` ON \`testimonials\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`testimonials_locales\` (
  	\`quote\` text,
  	\`role\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`testimonials_locales_locale_parent_id_unique\` ON \`testimonials_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_testimonials_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_author\` text,
  	\`version_company\` text,
  	\`version_photo_id\` integer,
  	\`version_source\` text,
  	\`version_permission_confirmed\` integer,
  	\`version_permission_note\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_testimonials_v_parent_idx\` ON \`_testimonials_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version_photo_idx\` ON \`_testimonials_v\` (\`version_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version_updated_at_idx\` ON \`_testimonials_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version_created_at_idx\` ON \`_testimonials_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version__status_idx\` ON \`_testimonials_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_created_at_idx\` ON \`_testimonials_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_updated_at_idx\` ON \`_testimonials_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_snapshot_idx\` ON \`_testimonials_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_published_locale_idx\` ON \`_testimonials_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_latest_idx\` ON \`_testimonials_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_autosave_idx\` ON \`_testimonials_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_testimonials_v_locales\` (
  	\`version_quote\` text,
  	\`version_role\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_testimonials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_testimonials_v_locales_locale_parent_id_unique\` ON \`_testimonials_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cover_id\` integer,
  	\`author\` text,
  	\`published_at\` text,
  	\`meta_noindex\` integer,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_cover_idx\` ON \`posts\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`posts_locales\` (
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_slug_idx\` ON \`posts_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_cover_id\` integer,
  	\`version_author\` text,
  	\`version_published_at\` text,
  	\`version_meta_noindex\` integer,
  	\`version_meta_canonical\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_cover_idx\` ON \`_posts_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_snapshot_idx\` ON \`_posts_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_published_locale_idx\` ON \`_posts_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_autosave_idx\` ON \`_posts_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_locales\` (
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v_locales\` (\`version_slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`body\` text NOT NULL,
  	\`author\` text,
  	\`at\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_notes_order_idx\` ON \`leads_notes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leads_notes_parent_id_idx\` ON \`leads_notes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads_activity\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`at\` text,
  	\`by\` text,
  	\`change\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_activity_order_idx\` ON \`leads_activity\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leads_activity_parent_id_idx\` ON \`leads_activity\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`assigned_to\` text,
  	\`service\` text,
  	\`name\` text NOT NULL,
  	\`email\` text,
  	\`phone\` text,
  	\`message\` text NOT NULL,
  	\`preferred_contact\` text,
  	\`locale\` text,
  	\`source\` text,
  	\`selection\` text,
  	\`estimate_token\` text,
  	\`notification_status\` text,
  	\`notification_error\` text,
  	\`notification_attempted_at\` text,
  	\`submission_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_status_idx\` ON \`leads\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`leads_assigned_to_idx\` ON \`leads\` (\`assigned_to\`);`)
  await db.run(sql`CREATE INDEX \`leads_service_idx\` ON \`leads\` (\`service\`);`)
  await db.run(sql`CREATE INDEX \`leads_locale_idx\` ON \`leads\` (\`locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`leads_submission_id_idx\` ON \`leads\` (\`submission_id\`);`)
  await db.run(sql`CREATE INDEX \`leads_updated_at_idx\` ON \`leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leads_created_at_idx\` ON \`leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`_leads_v_version_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`body\` text NOT NULL,
  	\`author\` text,
  	\`at\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_leads_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_leads_v_version_notes_order_idx\` ON \`_leads_v_version_notes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_notes_parent_id_idx\` ON \`_leads_v_version_notes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_leads_v_version_activity\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`at\` text,
  	\`by\` text,
  	\`change\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_leads_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_leads_v_version_activity_order_idx\` ON \`_leads_v_version_activity\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_activity_parent_id_idx\` ON \`_leads_v_version_activity\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_leads_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_status\` text DEFAULT 'new' NOT NULL,
  	\`version_assigned_to\` text,
  	\`version_service\` text,
  	\`version_name\` text NOT NULL,
  	\`version_email\` text,
  	\`version_phone\` text,
  	\`version_message\` text NOT NULL,
  	\`version_preferred_contact\` text,
  	\`version_locale\` text,
  	\`version_source\` text,
  	\`version_selection\` text,
  	\`version_estimate_token\` text,
  	\`version_notification_status\` text,
  	\`version_notification_error\` text,
  	\`version_notification_attempted_at\` text,
  	\`version_submission_id\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_leads_v_parent_idx\` ON \`_leads_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_status_idx\` ON \`_leads_v\` (\`version_status\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_assigned_to_idx\` ON \`_leads_v\` (\`version_assigned_to\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_service_idx\` ON \`_leads_v\` (\`version_service\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_locale_idx\` ON \`_leads_v\` (\`version_locale\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_submission_id_idx\` ON \`_leads_v\` (\`version_submission_id\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_updated_at_idx\` ON \`_leads_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_version_version_created_at_idx\` ON \`_leads_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_created_at_idx\` ON \`_leads_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_leads_v_updated_at_idx\` ON \`_leads_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`estimates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`token\` text NOT NULL,
  	\`expires_at\` text NOT NULL,
  	\`revoked\` integer,
  	\`locale\` text,
  	\`selection\` text NOT NULL,
  	\`snapshot\` text NOT NULL,
  	\`catalog_version\` text,
  	\`views\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`estimates_token_idx\` ON \`estimates\` (\`token\`);`)
  await db.run(sql`CREATE INDEX \`estimates_updated_at_idx\` ON \`estimates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`estimates_created_at_idx\` ON \`estimates\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`lead_person\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`redirects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to_type\` text DEFAULT 'reference',
  	\`to_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`redirects_from_idx\` ON \`redirects\` (\`from\`);`)
  await db.run(sql`CREATE INDEX \`redirects_updated_at_idx\` ON \`redirects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`redirects_created_at_idx\` ON \`redirects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`redirects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`redirects_rels_order_idx\` ON \`redirects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_parent_idx\` ON \`redirects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_path_idx\` ON \`redirects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_pages_id_idx\` ON \`redirects_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_folders_folder_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_folders_folder_type_order_idx\` ON \`payload_folders_folder_type\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_folders_folder_type_parent_idx\` ON \`payload_folders_folder_type\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_folders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`folder_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`folder_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_folders_name_idx\` ON \`payload_folders\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`payload_folders_folder_idx\` ON \`payload_folders\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_folders_updated_at_idx\` ON \`payload_folders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_folders_created_at_idx\` ON \`payload_folders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`media_id\` integer,
  	\`case_studies_id\` integer,
  	\`testimonials_id\` integer,
  	\`posts_id\` integer,
  	\`leads_id\` integer,
  	\`estimates_id\` integer,
  	\`users_id\` integer,
  	\`redirects_id\` integer,
  	\`payload_folders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`case_studies_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`estimates_id\`) REFERENCES \`estimates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_case_studies_id_idx\` ON \`payload_locked_documents_rels\` (\`case_studies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_estimates_id_idx\` ON \`payload_locked_documents_rels\` (\`estimates_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages_components\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_components_order_idx\` ON \`pricing_catalog_packages_components\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_components_parent_id_idx\` ON \`pricing_catalog_packages_components\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature_key\` text,
  	\`status\` text DEFAULT 'included',
  	\`quantity\` numeric,
  	\`quantity_max\` numeric,
  	\`cadence\` text,
  	\`replaced_by\` text,
  	\`order\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_features_order_idx\` ON \`pricing_catalog_packages_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_features_parent_id_idx\` ON \`pricing_catalog_packages_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages_features_locales\` (
  	\`unit\` text,
  	\`detail\` text,
  	\`note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_packages_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_catalog_packages_features_locales_locale_parent_id_u\` ON \`pricing_catalog_packages_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages_boundaries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_boundaries_order_idx\` ON \`pricing_catalog_packages_boundaries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_boundaries_parent_id_idx\` ON \`pricing_catalog_packages_boundaries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages_boundaries_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_packages_boundaries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_catalog_packages_boundaries_locales_locale_parent_id\` ON \`pricing_catalog_packages_boundaries_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`category\` text,
  	\`order\` numeric DEFAULT 10,
  	\`visible\` integer DEFAULT true,
  	\`prices_m1\` numeric,
  	\`prices_m3\` numeric,
  	\`prices_m6\` numeric,
  	\`prices_m9\` numeric,
  	\`prices_m12\` numeric,
  	\`one_time_price\` numeric,
  	\`price_is_from\` integer,
  	\`recommended\` integer,
  	\`contact\` text,
  	\`inherits\` text,
  	\`inherit_boundaries\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_order_idx\` ON \`pricing_catalog_packages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_packages_parent_id_idx\` ON \`pricing_catalog_packages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_packages_locales\` (
  	\`name\` text,
  	\`tagline\` text,
  	\`summary\` text,
  	\`badge\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_catalog_packages_locales_locale_parent_id_unique\` ON \`pricing_catalog_packages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_addons_applies_to\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pricing_catalog_addons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_addons_applies_to_order_idx\` ON \`pricing_catalog_addons_applies_to\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_addons_applies_to_parent_idx\` ON \`pricing_catalog_addons_applies_to\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_addons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`price\` numeric,
  	\`price_is_from\` integer,
  	\`units\` numeric,
  	\`order\` numeric DEFAULT 10,
  	\`visible\` integer DEFAULT true,
  	\`related_feature_key\` text,
  	\`contact\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_addons_order_idx\` ON \`pricing_catalog_addons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_addons_parent_id_idx\` ON \`pricing_catalog_addons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_addons_locales\` (
  	\`name\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_addons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_catalog_addons_locales_locale_parent_id_unique\` ON \`pricing_catalog_addons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`group\` text,
  	\`order\` numeric,
  	\`compare\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_features_order_idx\` ON \`pricing_catalog_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_features_parent_id_idx\` ON \`pricing_catalog_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_features_locales\` (
  	\`name\` text,
  	\`unit\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_catalog_features_locales_locale_parent_id_unique\` ON \`pricing_catalog_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_terms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_terms_order_idx\` ON \`pricing_catalog_terms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_terms_parent_id_idx\` ON \`pricing_catalog_terms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_terms_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog_terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_catalog_terms_locales_locale_parent_id_unique\` ON \`pricing_catalog_terms_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog_review_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	\`done\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_catalog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog_review_checklist_order_idx\` ON \`pricing_catalog_review_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_catalog_review_checklist_parent_id_idx\` ON \`pricing_catalog_review_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_catalog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`approval_state\` text DEFAULT 'proposed',
  	\`currency\` text DEFAULT 'AMD',
  	\`review_notes\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_catalog__status_idx\` ON \`pricing_catalog\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages_components\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_components_order_idx\` ON \`_pricing_catalog_v_version_packages_components\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_components_parent_id_idx\` ON \`_pricing_catalog_v_version_packages_components\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`feature_key\` text,
  	\`status\` text DEFAULT 'included',
  	\`quantity\` numeric,
  	\`quantity_max\` numeric,
  	\`cadence\` text,
  	\`replaced_by\` text,
  	\`order\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_features_order_idx\` ON \`_pricing_catalog_v_version_packages_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_features_parent_id_idx\` ON \`_pricing_catalog_v_version_packages_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages_features_locales\` (
  	\`unit\` text,
  	\`detail\` text,
  	\`note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_packages_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pricing_catalog_v_version_packages_features_locales_locale_\` ON \`_pricing_catalog_v_version_packages_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages_boundaries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_boundaries_order_idx\` ON \`_pricing_catalog_v_version_packages_boundaries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_boundaries_parent_id_idx\` ON \`_pricing_catalog_v_version_packages_boundaries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages_boundaries_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_packages_boundaries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pricing_catalog_v_version_packages_boundaries_locales_local\` ON \`_pricing_catalog_v_version_packages_boundaries_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`category\` text,
  	\`order\` numeric DEFAULT 10,
  	\`visible\` integer DEFAULT true,
  	\`prices_m1\` numeric,
  	\`prices_m3\` numeric,
  	\`prices_m6\` numeric,
  	\`prices_m9\` numeric,
  	\`prices_m12\` numeric,
  	\`one_time_price\` numeric,
  	\`price_is_from\` integer,
  	\`recommended\` integer,
  	\`contact\` text,
  	\`inherits\` text,
  	\`inherit_boundaries\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_order_idx\` ON \`_pricing_catalog_v_version_packages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_packages_parent_id_idx\` ON \`_pricing_catalog_v_version_packages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_packages_locales\` (
  	\`name\` text,
  	\`tagline\` text,
  	\`summary\` text,
  	\`badge\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pricing_catalog_v_version_packages_locales_locale_parent_id\` ON \`_pricing_catalog_v_version_packages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_addons_applies_to\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pricing_catalog_v_version_addons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_addons_applies_to_order_idx\` ON \`_pricing_catalog_v_version_addons_applies_to\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_addons_applies_to_parent_idx\` ON \`_pricing_catalog_v_version_addons_applies_to\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_addons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`price\` numeric,
  	\`price_is_from\` integer,
  	\`units\` numeric,
  	\`order\` numeric DEFAULT 10,
  	\`visible\` integer DEFAULT true,
  	\`related_feature_key\` text,
  	\`contact\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_addons_order_idx\` ON \`_pricing_catalog_v_version_addons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_addons_parent_id_idx\` ON \`_pricing_catalog_v_version_addons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_addons_locales\` (
  	\`name\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_addons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pricing_catalog_v_version_addons_locales_locale_parent_id_u\` ON \`_pricing_catalog_v_version_addons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`group\` text,
  	\`order\` numeric,
  	\`compare\` integer DEFAULT true,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_features_order_idx\` ON \`_pricing_catalog_v_version_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_features_parent_id_idx\` ON \`_pricing_catalog_v_version_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_features_locales\` (
  	\`name\` text,
  	\`unit\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pricing_catalog_v_version_features_locales_locale_parent_id\` ON \`_pricing_catalog_v_version_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_terms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_terms_order_idx\` ON \`_pricing_catalog_v_version_terms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_terms_parent_id_idx\` ON \`_pricing_catalog_v_version_terms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_terms_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v_version_terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pricing_catalog_v_version_terms_locales_locale_parent_id_un\` ON \`_pricing_catalog_v_version_terms_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v_version_review_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`item\` text,
  	\`done\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_catalog_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_review_checklist_order_idx\` ON \`_pricing_catalog_v_version_review_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_review_checklist_parent_id_idx\` ON \`_pricing_catalog_v_version_review_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_catalog_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_approval_state\` text DEFAULT 'proposed',
  	\`version_currency\` text DEFAULT 'AMD',
  	\`version_review_notes\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_version_version__status_idx\` ON \`_pricing_catalog_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_created_at_idx\` ON \`_pricing_catalog_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_updated_at_idx\` ON \`_pricing_catalog_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_snapshot_idx\` ON \`_pricing_catalog_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_published_locale_idx\` ON \`_pricing_catalog_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_catalog_v_latest_idx\` ON \`_pricing_catalog_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_questions_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`budget_max\` numeric,
  	\`months\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`package_guide_questions_options_order_idx\` ON \`package_guide_questions_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`package_guide_questions_options_parent_id_idx\` ON \`package_guide_questions_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_questions_options_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide_questions_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`package_guide_questions_options_locales_locale_parent_id_uni\` ON \`package_guide_questions_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`role\` text DEFAULT 'normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`package_guide_questions_order_idx\` ON \`package_guide_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`package_guide_questions_parent_id_idx\` ON \`package_guide_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_questions_locales\` (
  	\`label\` text,
  	\`help\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`package_guide_questions_locales_locale_parent_id_unique\` ON \`package_guide_questions_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_rules_when\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`package_guide_rules_when_order_idx\` ON \`package_guide_rules_when\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`package_guide_rules_when_parent_id_idx\` ON \`package_guide_rules_when\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`package_key\` text,
  	\`points\` numeric DEFAULT 1,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`package_guide_rules_order_idx\` ON \`package_guide_rules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`package_guide_rules_parent_id_idx\` ON \`package_guide_rules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_rules_locales\` (
  	\`reason\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`package_guide_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`package_guide_rules_locales_locale_parent_id_unique\` ON \`package_guide_rules_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`package_guide\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`package_guide__status_idx\` ON \`package_guide\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`package_guide_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`package_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`package_guide_texts_order_parent\` ON \`package_guide_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_questions_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`budget_max\` numeric,
  	\`months\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v_version_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_questions_options_order_idx\` ON \`_package_guide_v_version_questions_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_questions_options_parent_id_idx\` ON \`_package_guide_v_version_questions_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_questions_options_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v_version_questions_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_package_guide_v_version_questions_options_locales_locale_pa\` ON \`_package_guide_v_version_questions_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`role\` text DEFAULT 'normal',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_questions_order_idx\` ON \`_package_guide_v_version_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_questions_parent_id_idx\` ON \`_package_guide_v_version_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_questions_locales\` (
  	\`label\` text,
  	\`help\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v_version_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_package_guide_v_version_questions_locales_locale_parent_id_\` ON \`_package_guide_v_version_questions_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_rules_when\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v_version_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_rules_when_order_idx\` ON \`_package_guide_v_version_rules_when\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_rules_when_parent_id_idx\` ON \`_package_guide_v_version_rules_when\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`package_key\` text,
  	\`points\` numeric DEFAULT 1,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_rules_order_idx\` ON \`_package_guide_v_version_rules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_rules_parent_id_idx\` ON \`_package_guide_v_version_rules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_version_rules_locales\` (
  	\`reason\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_package_guide_v_version_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_package_guide_v_version_rules_locales_locale_parent_id_uniq\` ON \`_package_guide_v_version_rules_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_package_guide_v_version_version__status_idx\` ON \`_package_guide_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_created_at_idx\` ON \`_package_guide_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_updated_at_idx\` ON \`_package_guide_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_snapshot_idx\` ON \`_package_guide_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_published_locale_idx\` ON \`_package_guide_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_package_guide_v_latest_idx\` ON \`_package_guide_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_package_guide_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_package_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_package_guide_v_texts_order_parent\` ON \`_package_guide_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_contacts_people_services\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings_contacts_people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_contacts_people_services_order_idx\` ON \`site_settings_contacts_people_services\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_contacts_people_services_parent_idx\` ON \`site_settings_contacts_people_services\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_contacts_people\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`phone_e164\` text,
  	\`whatsapp_number\` text,
  	\`email\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_contacts_people_order_idx\` ON \`site_settings_contacts_people\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_contacts_people_parent_id_idx\` ON \`site_settings_contacts_people\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_contacts_people_locales\` (
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_contacts_people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_contacts_people_locales_locale_parent_id_uniqu\` ON \`site_settings_contacts_people_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_seo_organization_same_as\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_seo_organization_same_as_order_idx\` ON \`site_settings_seo_organization_same_as\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_organization_same_as_parent_id_idx\` ON \`site_settings_seo_organization_same_as\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_analytics_events\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_analytics_events_order_idx\` ON \`site_settings_analytics_events\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_analytics_events_parent_idx\` ON \`site_settings_analytics_events\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`default_locale\` text DEFAULT 'hy' NOT NULL,
  	\`contacts_phone_display\` text DEFAULT '+374 91 003099' NOT NULL,
  	\`contacts_phone_e164\` text DEFAULT '+37491003099' NOT NULL,
  	\`contacts_whatsapp_number\` text DEFAULT '37491003099' NOT NULL,
  	\`contacts_email\` text DEFAULT 'botz.marketingagency@gmail.com' NOT NULL,
  	\`contacts_instagram_url\` text,
  	\`contacts_mobile_bar_enabled\` integer DEFAULT true,
  	\`contacts_mobile_bar_show_call\` integer DEFAULT true,
  	\`contacts_mobile_bar_show_whatsapp\` integer DEFAULT true,
  	\`contacts_mobile_bar_show_email\` integer DEFAULT false,
  	\`forms_notify_emails\` text,
  	\`forms_rate_limit_per_hour\` numeric DEFAULT 6,
  	\`forms_share_enabled\` integer DEFAULT true,
  	\`forms_share_expiry_days\` numeric DEFAULT 30,
  	\`seo_default_image_id\` integer,
  	\`seo_allow_indexing\` integer DEFAULT true,
  	\`seo_extra_disallow\` text,
  	\`seo_organization_legal_name\` text,
  	\`seo_organization_area_served\` text DEFAULT 'Armenia',
  	\`analytics_require_consent\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_default_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_seo_seo_default_image_idx\` ON \`site_settings\` (\`seo_default_image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_locales\` (
  	\`site_name\` text DEFAULT 'BOTZ Marketing Agency' NOT NULL,
  	\`seo_title_suffix\` text DEFAULT ' — BOTZ Marketing Agency',
  	\`seo_default_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_locales_locale_parent_id_unique\` ON \`site_settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_contacts_people_services\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_site_settings_v_version_contacts_people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_contacts_people_services_order_idx\` ON \`_site_settings_v_version_contacts_people_services\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_contacts_people_services_parent_idx\` ON \`_site_settings_v_version_contacts_people_services\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_contacts_people\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`phone_e164\` text,
  	\`whatsapp_number\` text,
  	\`email\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_contacts_people_order_idx\` ON \`_site_settings_v_version_contacts_people\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_contacts_people_parent_id_idx\` ON \`_site_settings_v_version_contacts_people\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_contacts_people_locales\` (
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v_version_contacts_people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_site_settings_v_version_contacts_people_locales_locale_pare\` ON \`_site_settings_v_version_contacts_people_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_seo_organization_same_as\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_seo_organization_same_as_order_idx\` ON \`_site_settings_v_version_seo_organization_same_as\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_seo_organization_same_as_parent_id_idx\` ON \`_site_settings_v_version_seo_organization_same_as\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_analytics_events\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_analytics_events_order_idx\` ON \`_site_settings_v_version_analytics_events\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_analytics_events_parent_idx\` ON \`_site_settings_v_version_analytics_events\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_default_locale\` text DEFAULT 'hy' NOT NULL,
  	\`version_contacts_phone_display\` text DEFAULT '+374 91 003099' NOT NULL,
  	\`version_contacts_phone_e164\` text DEFAULT '+37491003099' NOT NULL,
  	\`version_contacts_whatsapp_number\` text DEFAULT '37491003099' NOT NULL,
  	\`version_contacts_email\` text DEFAULT 'botz.marketingagency@gmail.com' NOT NULL,
  	\`version_contacts_instagram_url\` text,
  	\`version_contacts_mobile_bar_enabled\` integer DEFAULT true,
  	\`version_contacts_mobile_bar_show_call\` integer DEFAULT true,
  	\`version_contacts_mobile_bar_show_whatsapp\` integer DEFAULT true,
  	\`version_contacts_mobile_bar_show_email\` integer DEFAULT false,
  	\`version_forms_notify_emails\` text,
  	\`version_forms_rate_limit_per_hour\` numeric DEFAULT 6,
  	\`version_forms_share_enabled\` integer DEFAULT true,
  	\`version_forms_share_expiry_days\` numeric DEFAULT 30,
  	\`version_seo_default_image_id\` integer,
  	\`version_seo_allow_indexing\` integer DEFAULT true,
  	\`version_seo_extra_disallow\` text,
  	\`version_seo_organization_legal_name\` text,
  	\`version_seo_organization_area_served\` text DEFAULT 'Armenia',
  	\`version_analytics_require_consent\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_seo_default_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_seo_version_seo_default_image_idx\` ON \`_site_settings_v\` (\`version_seo_default_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_locales\` (
  	\`version_site_name\` text DEFAULT 'BOTZ Marketing Agency' NOT NULL,
  	\`version_seo_title_suffix\` text DEFAULT ' — BOTZ Marketing Agency',
  	\`version_seo_default_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_site_settings_v_locales_locale_parent_id_unique\` ON \`_site_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logos_logo_light_id\` integer,
  	\`logos_logo_dark_id\` integer,
  	\`logos_mark_id\` integer,
  	\`logos_favicon_id\` integer,
  	\`default_mode\` text DEFAULT 'system',
  	\`light_bg\` text DEFAULT '#FDF6EC' NOT NULL,
  	\`light_surface\` text DEFAULT '#F4EADB' NOT NULL,
  	\`light_border\` text DEFAULT '#E0D3C0' NOT NULL,
  	\`light_text\` text DEFAULT '#141414' NOT NULL,
  	\`light_muted\` text DEFAULT '#5C5650' NOT NULL,
  	\`light_accent\` text DEFAULT '#FF4F0F' NOT NULL,
  	\`light_accent_text\` text DEFAULT '#B83300' NOT NULL,
  	\`light_on_accent\` text DEFAULT '#141414' NOT NULL,
  	\`light_inverse_bg\` text DEFAULT '#0E0E0F' NOT NULL,
  	\`light_inverse_text\` text DEFAULT '#FDF6EC' NOT NULL,
  	\`dark_bg\` text DEFAULT '#0E0E0F' NOT NULL,
  	\`dark_surface\` text DEFAULT '#1A1A1C' NOT NULL,
  	\`dark_border\` text DEFAULT '#2E2D2F' NOT NULL,
  	\`dark_text\` text DEFAULT '#F7F2EA' NOT NULL,
  	\`dark_muted\` text DEFAULT '#ABA49B' NOT NULL,
  	\`dark_accent\` text DEFAULT '#FF5A1F' NOT NULL,
  	\`dark_accent_text\` text DEFAULT '#FF7A45' NOT NULL,
  	\`dark_on_accent\` text DEFAULT '#0E0E0F' NOT NULL,
  	\`dark_inverse_bg\` text DEFAULT '#FDF6EC' NOT NULL,
  	\`dark_inverse_text\` text DEFAULT '#141414' NOT NULL,
  	\`type_display_font\` text DEFAULT 'unbounded',
  	\`type_body_font\` text DEFAULT 'manrope',
  	\`type_heading_scale\` text DEFAULT 'xl',
  	\`type_button_radius\` numeric DEFAULT 999,
  	\`type_card_radius\` numeric DEFAULT 28,
  	\`type_button_style\` text DEFAULT 'solid',
  	\`motion_intensity\` text DEFAULT 'expressive' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logos_logo_light_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logos_logo_dark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logos_mark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logos_favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_logos_logos_logo_light_idx\` ON \`theme\` (\`logos_logo_light_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_logos_logos_logo_dark_idx\` ON \`theme\` (\`logos_logo_dark_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_logos_logos_mark_idx\` ON \`theme\` (\`logos_mark_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_logos_logos_favicon_idx\` ON \`theme\` (\`logos_favicon_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_logos_logo_light_id\` integer,
  	\`version_logos_logo_dark_id\` integer,
  	\`version_logos_mark_id\` integer,
  	\`version_logos_favicon_id\` integer,
  	\`version_default_mode\` text DEFAULT 'system',
  	\`version_light_bg\` text DEFAULT '#FDF6EC' NOT NULL,
  	\`version_light_surface\` text DEFAULT '#F4EADB' NOT NULL,
  	\`version_light_border\` text DEFAULT '#E0D3C0' NOT NULL,
  	\`version_light_text\` text DEFAULT '#141414' NOT NULL,
  	\`version_light_muted\` text DEFAULT '#5C5650' NOT NULL,
  	\`version_light_accent\` text DEFAULT '#FF4F0F' NOT NULL,
  	\`version_light_accent_text\` text DEFAULT '#B83300' NOT NULL,
  	\`version_light_on_accent\` text DEFAULT '#141414' NOT NULL,
  	\`version_light_inverse_bg\` text DEFAULT '#0E0E0F' NOT NULL,
  	\`version_light_inverse_text\` text DEFAULT '#FDF6EC' NOT NULL,
  	\`version_dark_bg\` text DEFAULT '#0E0E0F' NOT NULL,
  	\`version_dark_surface\` text DEFAULT '#1A1A1C' NOT NULL,
  	\`version_dark_border\` text DEFAULT '#2E2D2F' NOT NULL,
  	\`version_dark_text\` text DEFAULT '#F7F2EA' NOT NULL,
  	\`version_dark_muted\` text DEFAULT '#ABA49B' NOT NULL,
  	\`version_dark_accent\` text DEFAULT '#FF5A1F' NOT NULL,
  	\`version_dark_accent_text\` text DEFAULT '#FF7A45' NOT NULL,
  	\`version_dark_on_accent\` text DEFAULT '#0E0E0F' NOT NULL,
  	\`version_dark_inverse_bg\` text DEFAULT '#FDF6EC' NOT NULL,
  	\`version_dark_inverse_text\` text DEFAULT '#141414' NOT NULL,
  	\`version_type_display_font\` text DEFAULT 'unbounded',
  	\`version_type_body_font\` text DEFAULT 'manrope',
  	\`version_type_heading_scale\` text DEFAULT 'xl',
  	\`version_type_button_radius\` numeric DEFAULT 999,
  	\`version_type_card_radius\` numeric DEFAULT 28,
  	\`version_type_button_style\` text DEFAULT 'solid',
  	\`version_motion_intensity\` text DEFAULT 'expressive' NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_logos_logo_light_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logos_logo_dark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logos_mark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logos_favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_logos_version_logos_logo_light_idx\` ON \`_theme_v\` (\`version_logos_logo_light_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_logos_version_logos_logo_dark_idx\` ON \`_theme_v\` (\`version_logos_logo_dark_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_logos_version_logos_mark_idx\` ON \`_theme_v\` (\`version_logos_mark_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_logos_version_logos_favicon_idx\` ON \`_theme_v\` (\`version_logos_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`navigation_header\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_header_order_idx\` ON \`navigation_header\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_header_parent_id_idx\` ON \`navigation_header\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_header_page_idx\` ON \`navigation_header\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_header_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_header_locales_locale_parent_id_unique\` ON \`navigation_header_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_order_idx\` ON \`navigation_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_parent_id_idx\` ON \`navigation_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_page_idx\` ON \`navigation_footer_columns_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_columns_links_locales_locale_parent_id_uni\` ON \`navigation_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_order_idx\` ON \`navigation_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_parent_id_idx\` ON \`navigation_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_locales\` (
  	\`title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_columns_locales_locale_parent_id_unique\` ON \`navigation_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`header_cta_type\` text DEFAULT 'page',
  	\`header_cta_appearance\` text DEFAULT 'primary',
  	\`header_cta_page_id\` integer,
  	\`header_cta_path\` text,
  	\`header_cta_url\` text,
  	\`header_cta_contact\` text,
  	\`header_cta_new_tab\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`header_cta_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_header_cta_header_cta_page_idx\` ON \`navigation\` (\`header_cta_page_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_locales\` (
  	\`header_cta_label\` text,
  	\`footer_statement\` text,
  	\`footer_note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_locales_locale_parent_id_unique\` ON \`navigation_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_header\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_order_idx\` ON \`_navigation_v_version_header\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_parent_id_idx\` ON \`_navigation_v_version_header\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_page_idx\` ON \`_navigation_v_version_header\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_header_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_header_locales_locale_parent_id_unique\` ON \`_navigation_v_version_header_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`appearance\` text DEFAULT 'primary',
  	\`page_id\` integer,
  	\`path\` text,
  	\`url\` text,
  	\`contact\` text,
  	\`new_tab\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_links_order_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_links_parent_id_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_links_page_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_columns_links_locales_locale_pa\` ON \`_navigation_v_version_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_order_idx\` ON \`_navigation_v_version_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_parent_id_idx\` ON \`_navigation_v_version_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns_locales\` (
  	\`title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_columns_locales_locale_parent_i\` ON \`_navigation_v_version_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_header_cta_type\` text DEFAULT 'page',
  	\`version_header_cta_appearance\` text DEFAULT 'primary',
  	\`version_header_cta_page_id\` integer,
  	\`version_header_cta_path\` text,
  	\`version_header_cta_url\` text,
  	\`version_header_cta_contact\` text,
  	\`version_header_cta_new_tab\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_header_cta_page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_cta_version_header_cta_page_idx\` ON \`_navigation_v\` (\`version_header_cta_page_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_locales\` (
  	\`version_header_cta_label\` text,
  	\`version_footer_statement\` text,
  	\`version_footer_note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_locales_locale_parent_id_unique\` ON \`_navigation_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ui_general\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`ui_general_locales\` (
  	\`common_skip_to_content\` text,
  	\`common_menu\` text,
  	\`common_close\` text,
  	\`common_language\` text,
  	\`common_theme\` text,
  	\`common_theme_light\` text,
  	\`common_theme_dark\` text,
  	\`common_not_available_in_language\` text,
  	\`common_go_to_language_home\` text,
  	\`common_learn_more\` text,
  	\`common_optional\` text,
  	\`common_draft_banner\` text,
  	\`common_exit_preview\` text,
  	\`common_breadcrumb_home\` text,
  	\`services_smm\` text,
  	\`services_seo\` text,
  	\`services_bundle\` text,
  	\`services_website\` text,
  	\`services_addon\` text,
  	\`services_other\` text,
  	\`contact_contact_person\` text,
  	\`contact_call\` text,
  	\`contact_whatsapp\` text,
  	\`contact_email\` text,
  	\`contact_phone_label\` text,
  	\`contact_shared_line\` text,
  	\`contact_handles\` text,
  	\`contact_either_contact\` text,
  	\`contact_mobile_bar_label\` text,
  	\`estimate_page_title\` text,
  	\`estimate_created_on\` text,
  	\`estimate_valid_until\` text,
  	\`estimate_expired\` text,
  	\`estimate_revoked\` text,
  	\`estimate_prices_changed\` text,
  	\`estimate_recalc\` text,
  	\`estimate_start_new\` text,
  	\`footer_rights\` text,
  	\`footer_contact_title\` text,
  	\`consent_text\` text,
  	\`consent_accept\` text,
  	\`consent_decline\` text,
  	\`errors_not_found_title\` text,
  	\`errors_not_found_text\` text,
  	\`errors_back_home\` text,
  	\`work_title\` text,
  	\`work_challenge\` text,
  	\`work_work_done\` text,
  	\`work_results\` text,
  	\`work_view_case\` text,
  	\`work_services\` text,
  	\`blog_title\` text,
  	\`blog_read_more\` text,
  	\`whatsapp_greeting\` text,
  	\`whatsapp_interest\` text,
  	\`whatsapp_package\` text,
  	\`whatsapp_addons\` text,
  	\`whatsapp_estimate\` text,
  	\`whatsapp_closing\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ui_general\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`ui_general_locales_locale_parent_id_unique\` ON \`ui_general_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ui_general_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_ui_general_v_created_at_idx\` ON \`_ui_general_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ui_general_v_updated_at_idx\` ON \`_ui_general_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_ui_general_v_locales\` (
  	\`version_common_skip_to_content\` text,
  	\`version_common_menu\` text,
  	\`version_common_close\` text,
  	\`version_common_language\` text,
  	\`version_common_theme\` text,
  	\`version_common_theme_light\` text,
  	\`version_common_theme_dark\` text,
  	\`version_common_not_available_in_language\` text,
  	\`version_common_go_to_language_home\` text,
  	\`version_common_learn_more\` text,
  	\`version_common_optional\` text,
  	\`version_common_draft_banner\` text,
  	\`version_common_exit_preview\` text,
  	\`version_common_breadcrumb_home\` text,
  	\`version_services_smm\` text,
  	\`version_services_seo\` text,
  	\`version_services_bundle\` text,
  	\`version_services_website\` text,
  	\`version_services_addon\` text,
  	\`version_services_other\` text,
  	\`version_contact_contact_person\` text,
  	\`version_contact_call\` text,
  	\`version_contact_whatsapp\` text,
  	\`version_contact_email\` text,
  	\`version_contact_phone_label\` text,
  	\`version_contact_shared_line\` text,
  	\`version_contact_handles\` text,
  	\`version_contact_either_contact\` text,
  	\`version_contact_mobile_bar_label\` text,
  	\`version_estimate_page_title\` text,
  	\`version_estimate_created_on\` text,
  	\`version_estimate_valid_until\` text,
  	\`version_estimate_expired\` text,
  	\`version_estimate_revoked\` text,
  	\`version_estimate_prices_changed\` text,
  	\`version_estimate_recalc\` text,
  	\`version_estimate_start_new\` text,
  	\`version_footer_rights\` text,
  	\`version_footer_contact_title\` text,
  	\`version_consent_text\` text,
  	\`version_consent_accept\` text,
  	\`version_consent_decline\` text,
  	\`version_errors_not_found_title\` text,
  	\`version_errors_not_found_text\` text,
  	\`version_errors_back_home\` text,
  	\`version_work_title\` text,
  	\`version_work_challenge\` text,
  	\`version_work_work_done\` text,
  	\`version_work_results\` text,
  	\`version_work_view_case\` text,
  	\`version_work_services\` text,
  	\`version_blog_title\` text,
  	\`version_blog_read_more\` text,
  	\`version_whatsapp_greeting\` text,
  	\`version_whatsapp_interest\` text,
  	\`version_whatsapp_package\` text,
  	\`version_whatsapp_addons\` text,
  	\`version_whatsapp_estimate\` text,
  	\`version_whatsapp_closing\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ui_general_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_ui_general_v_locales_locale_parent_id_unique\` ON \`_ui_general_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ui_pricing\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`ui_pricing_locales\` (
  	\`pricing_filter_label\` text,
  	\`pricing_cat_smm\` text,
  	\`pricing_cat_seo\` text,
  	\`pricing_cat_bundle\` text,
  	\`pricing_cat_website\` text,
  	\`pricing_cat_addon\` text,
  	\`pricing_duration_label\` text,
  	\`pricing_month1\` text,
  	\`pricing_months_n\` text,
  	\`pricing_per_month\` text,
  	\`pricing_one_time\` text,
  	\`pricing_total_for\` text,
  	\`pricing_total_for1\` text,
  	\`pricing_you_save\` text,
  	\`pricing_no_savings\` text,
  	\`pricing_save_up_to\` text,
  	\`pricing_unavailable\` text,
  	\`pricing_unavailable_short\` text,
  	\`pricing_available_for\` text,
  	\`pricing_from\` text,
  	\`pricing_recommended\` text,
  	\`pricing_everything_in\` text,
  	\`pricing_bundle_of\` text,
  	\`pricing_show_details\` text,
  	\`pricing_hide_details\` text,
  	\`pricing_boundaries\` text,
  	\`pricing_scope_in_proposal\` text,
  	\`pricing_select\` text,
  	\`pricing_selected\` text,
  	\`pricing_compare\` text,
  	\`pricing_comparing\` text,
  	\`pricing_compare_now\` text,
  	\`pricing_compare_limit\` text,
  	\`pricing_clear\` text,
  	\`pricing_addons_title\` text,
  	\`pricing_addons_intro\` text,
  	\`pricing_already_included\` text,
  	\`pricing_each_price\` text,
  	\`pricing_bundle_units\` text,
  	\`pricing_quantity\` text,
  	\`pricing_add\` text,
  	\`pricing_remove\` text,
  	\`pricing_estimate_title\` text,
  	\`pricing_recurring_fees\` text,
  	\`pricing_one_time_fees\` text,
  	\`pricing_combined_estimate\` text,
  	\`pricing_minimum_note\` text,
  	\`pricing_not_contract\` text,
  	\`pricing_request_proposal\` text,
  	\`pricing_discuss_whatsapp\` text,
  	\`pricing_share_estimate\` text,
  	\`pricing_share_copied\` text,
  	\`pricing_share_ready\` text,
  	\`pricing_share_failed\` text,
  	\`pricing_no_selection\` text,
  	\`pricing_terms_title\` text,
  	\`pricing_included\` text,
  	\`pricing_not_included\` text,
  	\`pricing_not_specified\` text,
  	\`pricing_replaced_by\` text,
  	\`pricing_up_to\` text,
  	\`pricing_range\` text,
  	\`pricing_changed_from\` text,
  	\`pricing_cadence_monthly\` text,
  	\`pricing_cadence_first_month\` text,
  	\`pricing_cadence_quarterly\` text,
  	\`pricing_cadence_one_time\` text,
  	\`pricing_cadence_ongoing\` text,
  	\`pricing_cadence_per_project\` text,
  	\`pricing_group_scope\` text,
  	\`pricing_group_setup\` text,
  	\`pricing_group_content\` text,
  	\`pricing_group_platforms\` text,
  	\`pricing_group_production\` text,
  	\`pricing_group_ads\` text,
  	\`pricing_group_reporting\` text,
  	\`pricing_group_support\` text,
  	\`pricing_group_delivery\` text,
  	\`compare_title\` text,
  	\`compare_feature\` text,
  	\`compare_price\` text,
  	\`compare_total\` text,
  	\`compare_savings\` text,
  	\`compare_choose\` text,
  	\`compare_empty\` text,
  	\`compare_legend\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ui_pricing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`ui_pricing_locales_locale_parent_id_unique\` ON \`ui_pricing_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ui_pricing_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_ui_pricing_v_created_at_idx\` ON \`_ui_pricing_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ui_pricing_v_updated_at_idx\` ON \`_ui_pricing_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_ui_pricing_v_locales\` (
  	\`version_pricing_filter_label\` text,
  	\`version_pricing_cat_smm\` text,
  	\`version_pricing_cat_seo\` text,
  	\`version_pricing_cat_bundle\` text,
  	\`version_pricing_cat_website\` text,
  	\`version_pricing_cat_addon\` text,
  	\`version_pricing_duration_label\` text,
  	\`version_pricing_month1\` text,
  	\`version_pricing_months_n\` text,
  	\`version_pricing_per_month\` text,
  	\`version_pricing_one_time\` text,
  	\`version_pricing_total_for\` text,
  	\`version_pricing_total_for1\` text,
  	\`version_pricing_you_save\` text,
  	\`version_pricing_no_savings\` text,
  	\`version_pricing_save_up_to\` text,
  	\`version_pricing_unavailable\` text,
  	\`version_pricing_unavailable_short\` text,
  	\`version_pricing_available_for\` text,
  	\`version_pricing_from\` text,
  	\`version_pricing_recommended\` text,
  	\`version_pricing_everything_in\` text,
  	\`version_pricing_bundle_of\` text,
  	\`version_pricing_show_details\` text,
  	\`version_pricing_hide_details\` text,
  	\`version_pricing_boundaries\` text,
  	\`version_pricing_scope_in_proposal\` text,
  	\`version_pricing_select\` text,
  	\`version_pricing_selected\` text,
  	\`version_pricing_compare\` text,
  	\`version_pricing_comparing\` text,
  	\`version_pricing_compare_now\` text,
  	\`version_pricing_compare_limit\` text,
  	\`version_pricing_clear\` text,
  	\`version_pricing_addons_title\` text,
  	\`version_pricing_addons_intro\` text,
  	\`version_pricing_already_included\` text,
  	\`version_pricing_each_price\` text,
  	\`version_pricing_bundle_units\` text,
  	\`version_pricing_quantity\` text,
  	\`version_pricing_add\` text,
  	\`version_pricing_remove\` text,
  	\`version_pricing_estimate_title\` text,
  	\`version_pricing_recurring_fees\` text,
  	\`version_pricing_one_time_fees\` text,
  	\`version_pricing_combined_estimate\` text,
  	\`version_pricing_minimum_note\` text,
  	\`version_pricing_not_contract\` text,
  	\`version_pricing_request_proposal\` text,
  	\`version_pricing_discuss_whatsapp\` text,
  	\`version_pricing_share_estimate\` text,
  	\`version_pricing_share_copied\` text,
  	\`version_pricing_share_ready\` text,
  	\`version_pricing_share_failed\` text,
  	\`version_pricing_no_selection\` text,
  	\`version_pricing_terms_title\` text,
  	\`version_pricing_included\` text,
  	\`version_pricing_not_included\` text,
  	\`version_pricing_not_specified\` text,
  	\`version_pricing_replaced_by\` text,
  	\`version_pricing_up_to\` text,
  	\`version_pricing_range\` text,
  	\`version_pricing_changed_from\` text,
  	\`version_pricing_cadence_monthly\` text,
  	\`version_pricing_cadence_first_month\` text,
  	\`version_pricing_cadence_quarterly\` text,
  	\`version_pricing_cadence_one_time\` text,
  	\`version_pricing_cadence_ongoing\` text,
  	\`version_pricing_cadence_per_project\` text,
  	\`version_pricing_group_scope\` text,
  	\`version_pricing_group_setup\` text,
  	\`version_pricing_group_content\` text,
  	\`version_pricing_group_platforms\` text,
  	\`version_pricing_group_production\` text,
  	\`version_pricing_group_ads\` text,
  	\`version_pricing_group_reporting\` text,
  	\`version_pricing_group_support\` text,
  	\`version_pricing_group_delivery\` text,
  	\`version_compare_title\` text,
  	\`version_compare_feature\` text,
  	\`version_compare_price\` text,
  	\`version_compare_total\` text,
  	\`version_compare_savings\` text,
  	\`version_compare_choose\` text,
  	\`version_compare_empty\` text,
  	\`version_compare_legend\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ui_pricing_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_ui_pricing_v_locales_locale_parent_id_unique\` ON \`_ui_pricing_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ui_forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`ui_forms_locales\` (
  	\`form_title\` text,
  	\`form_name\` text,
  	\`form_email\` text,
  	\`form_phone\` text,
  	\`form_contact_hint\` text,
  	\`form_service\` text,
  	\`form_message\` text,
  	\`form_message_placeholder\` text,
  	\`form_preferred_contact\` text,
  	\`form_either\` text,
  	\`form_selected_estimate\` text,
  	\`form_remove_estimate\` text,
  	\`form_submit\` text,
  	\`form_sending\` text,
  	\`form_success_title\` text,
  	\`form_success_text\` text,
  	\`form_team_name\` text,
  	\`form_error_generic\` text,
  	\`form_error_validation\` text,
  	\`form_error_rate\` text,
  	\`form_error_selection\` text,
  	\`form_required\` text,
  	\`form_invalid_email\` text,
  	\`form_invalid_phone\` text,
  	\`form_need_email_or_phone\` text,
  	\`form_message_too_short\` text,
  	\`form_honeypot\` text,
  	\`form_privacy\` text,
  	\`guide_start\` text,
  	\`guide_next\` text,
  	\`guide_back\` text,
  	\`guide_see_result\` text,
  	\`guide_restart\` text,
  	\`guide_progress\` text,
  	\`guide_result_title\` text,
  	\`guide_why\` text,
  	\`guide_alternatives\` text,
  	\`guide_over_budget\` text,
  	\`guide_custom\` text,
  	\`guide_true_cost\` text,
  	\`guide_discuss\` text,
  	\`guide_use_package\` text,
  	\`guide_temporary\` text,
  	\`guide_no_match\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ui_forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`ui_forms_locales_locale_parent_id_unique\` ON \`ui_forms_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ui_forms_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_ui_forms_v_created_at_idx\` ON \`_ui_forms_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ui_forms_v_updated_at_idx\` ON \`_ui_forms_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_ui_forms_v_locales\` (
  	\`version_form_title\` text,
  	\`version_form_name\` text,
  	\`version_form_email\` text,
  	\`version_form_phone\` text,
  	\`version_form_contact_hint\` text,
  	\`version_form_service\` text,
  	\`version_form_message\` text,
  	\`version_form_message_placeholder\` text,
  	\`version_form_preferred_contact\` text,
  	\`version_form_either\` text,
  	\`version_form_selected_estimate\` text,
  	\`version_form_remove_estimate\` text,
  	\`version_form_submit\` text,
  	\`version_form_sending\` text,
  	\`version_form_success_title\` text,
  	\`version_form_success_text\` text,
  	\`version_form_team_name\` text,
  	\`version_form_error_generic\` text,
  	\`version_form_error_validation\` text,
  	\`version_form_error_rate\` text,
  	\`version_form_error_selection\` text,
  	\`version_form_required\` text,
  	\`version_form_invalid_email\` text,
  	\`version_form_invalid_phone\` text,
  	\`version_form_need_email_or_phone\` text,
  	\`version_form_message_too_short\` text,
  	\`version_form_honeypot\` text,
  	\`version_form_privacy\` text,
  	\`version_guide_start\` text,
  	\`version_guide_next\` text,
  	\`version_guide_back\` text,
  	\`version_guide_see_result\` text,
  	\`version_guide_restart\` text,
  	\`version_guide_progress\` text,
  	\`version_guide_result_title\` text,
  	\`version_guide_why\` text,
  	\`version_guide_alternatives\` text,
  	\`version_guide_over_budget\` text,
  	\`version_guide_custom\` text,
  	\`version_guide_true_cost\` text,
  	\`version_guide_discuss\` text,
  	\`version_guide_use_package\` text,
  	\`version_guide_temporary\` text,
  	\`version_guide_no_match\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ui_forms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_ui_forms_v_locales_locale_parent_id_unique\` ON \`_ui_forms_v_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_enabled_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_ticker_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_ticker_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_points\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_points_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_split_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_block_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_items_highlights\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_items_highlights_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_package_preview_categories\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_package_preview\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_package_preview_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_pricing\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_pricing_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparison_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_guide\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_guide_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_process_steps\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_process_steps_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_process\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_process_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_collection_list\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_collection_list_locales\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_texts\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_enabled_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_ticker_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_ticker_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_points\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_points_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_split_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_block_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_items_highlights\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_items_highlights_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_services_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_package_preview_categories\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_package_preview\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_package_preview_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_pricing\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_pricing_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparison_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_guide\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_guide_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_process_steps\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_process_steps_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_process\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_process_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_collection_list\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_collection_list_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_texts\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`case_studies_services\`;`)
  await db.run(sql`DROP TABLE \`case_studies_gallery\`;`)
  await db.run(sql`DROP TABLE \`case_studies_gallery_locales\`;`)
  await db.run(sql`DROP TABLE \`case_studies_results\`;`)
  await db.run(sql`DROP TABLE \`case_studies_results_locales\`;`)
  await db.run(sql`DROP TABLE \`case_studies\`;`)
  await db.run(sql`DROP TABLE \`case_studies_locales\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_version_services\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_version_gallery_locales\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_version_results\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_version_results_locales\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_locales\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`testimonials_locales\`;`)
  await db.run(sql`DROP TABLE \`_testimonials_v\`;`)
  await db.run(sql`DROP TABLE \`_testimonials_v_locales\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_locales\`;`)
  await db.run(sql`DROP TABLE \`leads_notes\`;`)
  await db.run(sql`DROP TABLE \`leads_activity\`;`)
  await db.run(sql`DROP TABLE \`leads\`;`)
  await db.run(sql`DROP TABLE \`_leads_v_version_notes\`;`)
  await db.run(sql`DROP TABLE \`_leads_v_version_activity\`;`)
  await db.run(sql`DROP TABLE \`_leads_v\`;`)
  await db.run(sql`DROP TABLE \`estimates\`;`)
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`redirects\`;`)
  await db.run(sql`DROP TABLE \`redirects_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_folders_folder_type\`;`)
  await db.run(sql`DROP TABLE \`payload_folders\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages_components\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages_features\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages_features_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages_boundaries\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages_boundaries_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_packages_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_addons_applies_to\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_addons\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_addons_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_features\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_features_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_terms\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_terms_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog_review_checklist\`;`)
  await db.run(sql`DROP TABLE \`pricing_catalog\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages_components\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages_features\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages_features_locales\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages_boundaries\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages_boundaries_locales\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_packages_locales\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_addons_applies_to\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_addons\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_addons_locales\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_features\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_features_locales\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_terms\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_terms_locales\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v_version_review_checklist\`;`)
  await db.run(sql`DROP TABLE \`_pricing_catalog_v\`;`)
  await db.run(sql`DROP TABLE \`package_guide_questions_options\`;`)
  await db.run(sql`DROP TABLE \`package_guide_questions_options_locales\`;`)
  await db.run(sql`DROP TABLE \`package_guide_questions\`;`)
  await db.run(sql`DROP TABLE \`package_guide_questions_locales\`;`)
  await db.run(sql`DROP TABLE \`package_guide_rules_when\`;`)
  await db.run(sql`DROP TABLE \`package_guide_rules\`;`)
  await db.run(sql`DROP TABLE \`package_guide_rules_locales\`;`)
  await db.run(sql`DROP TABLE \`package_guide\`;`)
  await db.run(sql`DROP TABLE \`package_guide_texts\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_questions_options\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_questions_options_locales\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_questions\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_questions_locales\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_rules_when\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_rules\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_version_rules_locales\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v\`;`)
  await db.run(sql`DROP TABLE \`_package_guide_v_texts\`;`)
  await db.run(sql`DROP TABLE \`site_settings_contacts_people_services\`;`)
  await db.run(sql`DROP TABLE \`site_settings_contacts_people\`;`)
  await db.run(sql`DROP TABLE \`site_settings_contacts_people_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_seo_organization_same_as\`;`)
  await db.run(sql`DROP TABLE \`site_settings_analytics_events\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings_locales\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_contacts_people_services\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_contacts_people\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_contacts_people_locales\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_seo_organization_same_as\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_analytics_events\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_locales\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`navigation_header\`;`)
  await db.run(sql`DROP TABLE \`navigation_header_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_header\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_header_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_locales\`;`)
  await db.run(sql`DROP TABLE \`ui_general\`;`)
  await db.run(sql`DROP TABLE \`ui_general_locales\`;`)
  await db.run(sql`DROP TABLE \`_ui_general_v\`;`)
  await db.run(sql`DROP TABLE \`_ui_general_v_locales\`;`)
  await db.run(sql`DROP TABLE \`ui_pricing\`;`)
  await db.run(sql`DROP TABLE \`ui_pricing_locales\`;`)
  await db.run(sql`DROP TABLE \`_ui_pricing_v\`;`)
  await db.run(sql`DROP TABLE \`_ui_pricing_v_locales\`;`)
  await db.run(sql`DROP TABLE \`ui_forms\`;`)
  await db.run(sql`DROP TABLE \`ui_forms_locales\`;`)
  await db.run(sql`DROP TABLE \`_ui_forms_v\`;`)
  await db.run(sql`DROP TABLE \`_ui_forms_v_locales\`;`)
}
