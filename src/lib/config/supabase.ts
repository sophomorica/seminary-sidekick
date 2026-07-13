import * as publicEnv from '$env/static/public';

const env = publicEnv as Record<string, string | undefined>;

export const SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY ?? '';
