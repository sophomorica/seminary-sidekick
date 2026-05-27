# Vercel setup — one-time owner action

The CI workflow (`.github/workflows/ci.yml`) handles type-checking, linting, and building on every PR. **It does not deploy.** Deployment is handled by Vercel's GitHub integration, which needs to be set up once by the repo owner.

## Steps

1. **Create the Vercel project.**
   - Sign in at https://vercel.com.
   - Click **Add New… → Project**.
   - Import the GitHub repo for this project.
   - Framework preset: **SvelteKit** (auto-detected).
   - Build command: leave default (`pnpm build`).
   - Output directory: leave default (Vercel knows where adapter-vercel writes).
   - Node version: **22**.
   - Install command: leave default — Vercel detects pnpm via `pnpm-lock.yaml`.

2. **Add environment variables (none required in Tier 1).**
   - Tier 1 has no secrets. Add later when Plausible/Supabase/Resend land.

3. **Configure the production domain.**
   - In project settings → **Domains**, add the production domain (see open question #1 in `NEW_SITE_PLAN.md`).
   - If using Vercel's DNS: follow their nameserver instructions.
   - If using an existing DNS provider: add the CNAME record they show.
   - Wait for DNS + SSL provisioning (~5 minutes).

4. **Verify preview deploys.**
   - Open a PR. Vercel should comment with a preview URL within ~60s.
   - If the preview build fails, the CI workflow will tell you why; the Vercel deploy log shows runtime errors.

5. **Set the production branch.**
   - In project settings → **Git**, confirm production branch is `main`.

## After launch

- **TASK-C-110** swaps the placeholder App Store / Play Store URLs in `src/lib/config/store.ts` for real ones. One file, one commit, automatic redeploy.
- **TASK-C-111** submits the production sitemap (`https://<domain>/sitemap.xml`) to Google Search Console.

## If the production build fails on Vercel but passes locally

- Check Node version in Vercel matches `22`.
- Check pnpm version is `11.x` (Vercel auto-detects from the lockfile).
- The `.github/workflows/ci.yml` runs identical commands; if CI passes, Vercel should too.

## Why not GitHub Actions for deploy?

Vercel's native integration is faster, has automatic preview URLs per PR, and zero-config. GitHub Actions handles the CI gate, Vercel handles the deploy — clean separation.
