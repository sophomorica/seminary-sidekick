/** A news row the index, homepage strip, RSS, and sitemap can show. */
export type NewsCard = {
	slug: string;
	title: string;
	excerpt: string;
	/** Calendar day in America/New_York, YYYY-MM-DD. */
	date: string;
	/** Already formatted. Callers must not parse `date` with `new Date`. */
	dateLabel: string;
};

export type NewsArticle = NewsCard & {
	html: string;
	imageUrl: string | null;
};

export type GuidePage = {
	slug: string;
	title: string;
	excerpt: string;
	html: string;
};

export type PostKind = 'news' | 'guide';
