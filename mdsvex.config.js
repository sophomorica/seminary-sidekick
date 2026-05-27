import { defineMDSveXConfig as defineConfig } from 'mdsvex';

/**
 * mdsvex configuration — used by svelte.config.js.
 *
 * .svx files are Markdown + Svelte components. They live in src/content/
 * and are discovered via Vite's import.meta.glob in src/lib/content/loadPosts.ts.
 *
 * Frontmatter schema is enforced at load time (src/lib/content/schema.ts).
 */
const config = defineConfig({
	extensions: ['.svx'],
	smartypants: {
		dashes: 'oldschool'
	},
	remarkPlugins: [],
	rehypePlugins: []
});

export default config;
