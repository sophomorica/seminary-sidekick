/**
 * Frontmatter schema — used by every piece of content on the site.
 *
 * Today: blog posts in `src/content/news/*.svx`.
 * Tomorrow (Tier 2): teacher resources in `src/content/resources/*.svx`
 *                    will extend (not replace) this schema.
 *
 * Keep this conservative — adding a field is free, removing one is migration.
 */

import { z } from 'zod';

/**
 * Base frontmatter — common to all content types.
 *
 * `date`: ISO 8601 date string (YYYY-MM-DD).
 * `slug`: kebab-case URL slug. Must match the filename for unambiguous routing.
 * `tags`: free-form taxonomy. Conventional tags: "release", "announcement",
 *         "devotional", "behind-the-scenes", "teacher-tip", "lesson-help".
 */
export const baseFrontmatterSchema = z.object({
	title: z.string().min(1, 'title is required'),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
	date: z.preprocess((value) => {
		// mdsvex/YAML parses unquoted 2026-08-22 as a Date, not a string.
		if (value instanceof Date && !Number.isNaN(value.getTime())) {
			return value.toISOString().slice(0, 10);
		}
		return value;
	}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')),
	excerpt: z.string().min(1, 'excerpt is required'),
	tags: z.array(z.string()).default([]),
	cover: z.string().optional(),
	author: z.string().default('Patrick'),
	draft: z.boolean().default(false)
});

export type BaseFrontmatter = z.infer<typeof baseFrontmatterSchema>;

/**
 * News post frontmatter — currently identical to base. Subtype later if
 * news posts need fields that resources don't (or vice versa).
 */
export const newsPostSchema = baseFrontmatterSchema;
export type NewsPostFrontmatter = z.infer<typeof newsPostSchema>;
