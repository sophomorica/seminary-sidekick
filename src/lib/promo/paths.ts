function normalizePath(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
	return pathname || '/';
}

function isPrefix(path: string, prefix: string): boolean {
	return path === prefix || path.startsWith(`${prefix}/`);
}

/**
 * Class Play (`/join`) is the signed-in participant app.
 * The teacher mixer, printouts, and grabbers (`/teachers`) are lesson pages.
 * `/for-teachers` stays a public pitch page and still carries the strip.
 */
function isAppOrLessonPath(pathname: string): boolean {
	const path = normalizePath(pathname);
	return isPrefix(path, '/join') || isPrefix(path, '/teachers');
}

/** Public marketing pages carry the footer band. The signed-in app and lesson pages do not. */
export function promoStripOnPath(pathname: string): boolean {
	return !isAppOrLessonPath(pathname);
}
