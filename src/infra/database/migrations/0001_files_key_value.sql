-- Rename old files table
ALTER TABLE `files` RENAME TO `files_old`;

-- Create new files table with key/value structure
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`folder_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`is_encrypted` integer DEFAULT true NOT NULL,
	`is_link` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Migrate existing data: create a "Site" entry for each old file (plaintext, link)
INSERT INTO `files` (`id`, `folder_id`, `key`, `value`, `is_encrypted`, `is_link`, `created_at`, `updated_at`)
SELECT
  id || '_site',
  folder_id,
  'Site',
  site,
  0,
  1,
  created_at,
  updated_at
FROM `files_old`
WHERE site IS NOT NULL AND site != '';

-- Migrate credentials as an encrypted "Password" entry
INSERT INTO `files` (`id`, `folder_id`, `key`, `value`, `is_encrypted`, `is_link`, `created_at`, `updated_at`)
SELECT
  id || '_cred',
  folder_id,
  'Password',
  encrypted_credentials,
  1,
  0,
  created_at,
  updated_at
FROM `files_old`
WHERE encrypted_credentials IS NOT NULL AND encrypted_credentials != '';

-- Migrate usernames (use encrypted_username if present, else legacy username)
INSERT INTO `files` (`id`, `folder_id`, `key`, `value`, `is_encrypted`, `is_link`, `created_at`, `updated_at`)
SELECT
  id || '_user',
  folder_id,
  'Username',
  CASE WHEN encrypted_username IS NOT NULL AND encrypted_username != '' THEN encrypted_username ELSE username END,
  CASE WHEN encrypted_username IS NOT NULL AND encrypted_username != '' THEN 1 ELSE 0 END,
  0,
  created_at,
  updated_at
FROM `files_old`
WHERE (encrypted_username IS NOT NULL AND encrypted_username != '') OR (username IS NOT NULL AND username != '');

-- Drop old table
DROP TABLE `files_old`;
