<script lang="ts">
	import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '$lib/config/site';

	const effectiveDate = 'May 27, 2026';
	const pageTitle = `Privacy Policy — ${SITE_NAME}`;
	const canonical = `${SITE_URL}/privacy`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta
		name="description"
		content="Privacy policy for Seminary Sidekick. We practice data minimalism: no accounts and no server-side collection of personally identifiable information in the current phase of the project."
	/>
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content="Privacy Policy — Seminary Sidekick" />
	<meta
		property="og:description"
		content="We keep things simple and private. No accounts, no PII on our servers, privacy-friendly analytics with Plausible."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<header class="mb-10">
		<p class="eyebrow">Legal</p>
		<h1 class="font-serif text-display-md md:text-display-lg">Privacy Policy</h1>
		<p class="mt-3 text-body-md text-on-surface-variant">Effective {effectiveDate}</p>
	</header>

	<!-- Intro -->
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Seminary Sidekick ("we," "us," or "our") operates a marketing website at {SITE_URL} and companion
		mobile applications designed to help seminary students master the 100 doctrinal mastery scriptures.
		We are deeply committed to protecting your privacy and practicing data minimalism.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		In the current phase of this project (often referred to internally as Tier 1), the website
		and apps are built with <strong>no user accounts</strong> and
		<strong>no server-side collection of personally identifiable information (PII)</strong>.
		This page explains exactly what that means in plain terms.
	</p>

	<!-- Information We Collect -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Information we collect</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We collect <strong>no personally identifiable information</strong> through the website or apps
		in this phase. You do not create an account, log in, or provide a name, email address, or any
		other details to use the core experience.
	</p>
	<ul
		class="mb-6 list-disc space-y-2 pl-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface marker:text-primary"
	>
		<li>
			<strong>Website:</strong> The marketing site is static. We do not run forms that store
			your data, newsletters, or waitlists at this time. The only way we receive information
			is if you voluntarily email us at {CONTACT_EMAIL}.
		</li>
		<li>
			<strong>Mobile apps:</strong> All progress, notes, and settings live entirely on your device.
			Nothing is sent to our servers.
		</li>
		<li>
			<strong>Contact:</strong> When you email us, we receive the message you send. We treat it
			as private correspondence and use it only to respond to your inquiry. We do not add you to
			any marketing lists unless you explicitly request it.
		</li>
	</ul>

	<!-- Analytics -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Analytics</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We use <strong>Plausible Analytics</strong> on the website. Plausible is a lightweight, privacy-first
		analytics tool that we chose precisely because it respects visitors.
	</p>
	<p class="mb-4 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Plausible does <strong>not</strong>:
	</p>
	<ul
		class="mb-6 list-disc space-y-2 pl-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface marker:text-primary"
	>
		<li>Use cookies or any persistent client-side tracking</li>
		<li>Collect IP addresses in identifiable form</li>
		<li>Fingerprint devices or build individual profiles</li>
		<li>Track you across other websites</li>
	</ul>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		It provides only aggregated, anonymous statistics (for example, "120 visits to the home page
		this month"). This helps us understand what content is helpful so we can improve the site.
		You can learn more in <a
			href="https://plausible.io/privacy"
			target="_blank"
			rel="noopener noreferrer"
			class="focus-ring text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
			>Plausible’s own privacy policy</a
		>.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We use no other analytics, advertising pixels, or third-party trackers.
	</p>

	<!-- Premium subscriptions -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Premium subscriptions</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Certain advanced features inside the Seminary Sidekick mobile apps are available through
		optional paid subscriptions. These subscriptions are purchased and managed exclusively
		through the Apple App Store or Google Play Store.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We use <strong>RevenueCat</strong> as a lightweight service to validate your subscription receipt
		on your device so the app can unlock the correct features. RevenueCat receives only the minimal
		receipt data necessary for validation. We never receive or store your payment information, Apple
		ID, Google account details, or any other personal data from the transaction.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		All billing, refunds, and subscription management happen entirely inside the App Store or
		Play Store. We do not process payments ourselves.
	</p>

	<!-- How we use and share -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		How we use and share information
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Because we collect so little, there is almost nothing to use or share. Anonymous aggregated
		analytics help us improve the site and apps. We never sell, rent, or trade information. If
		we ever partner with a service provider (for example, to host the site), we choose partners
		who meet the same high privacy standards.
	</p>

	<!-- Future features -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Future features (TBD)</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We are planning additional capabilities in later phases of the Seminary Sidekick Suite, such
		as optional waitlists, teacher resource sharing, and community features. These will require
		accounts and more data handling. When those features are ready, we will update this Privacy
		Policy well in advance, explain the new practices clearly, and give you control over your
		information. Until then, the practices described above remain in effect.
	</p>

	<!-- Children’s privacy -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Children’s privacy</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Our services are intended for seminary students, generally ages 14–18, and the adults who
		teach and support them. We do not knowingly collect personal information from children under
		13. If you believe we have received information from a child under 13, please contact us
		immediately so we can address it.
	</p>

	<!-- Your rights -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Your rights</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Because we do not collect or store personal data on our servers in this phase, there are no
		individual records for us to retrieve, correct, or delete. If you have corresponded with us
		by email and would like us to remove or forget that conversation, simply ask—we will honor
		reasonable requests.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		You are always free to stop using the site and apps at any time.
	</p>

	<!-- Changes -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Changes to this policy</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We may update this Privacy Policy from time to time to reflect changes in our practices or
		the law. When we do, we will update the "Effective" date at the top of this page and, when
		appropriate, provide notice on the site. Continued use of the site or apps after changes
		constitutes acceptance of the updated policy.
	</p>

	<!-- Contact -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Contact us</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		If you have any questions, concerns, or requests regarding this Privacy Policy or our
		practices, please reach out:
	</p>
	<p class="mb-6">
		<a
			href={`mailto:${CONTACT_EMAIL}`}
			class="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition-colors hover:bg-primary-container"
		>
			{CONTACT_EMAIL}
		</a>
	</p>
	<p class="mb-10 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We also maintain <a
			href="/terms"
			class="focus-ring text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
			>our Terms of Use</a
		>, which govern your use of the site and apps.
	</p>

	<footer class="border-t border-outline-variant/30 pt-8 text-body-sm text-on-surface-variant">
		<p>
			This policy is written in plain language for transparency. It is not legal advice. We
			recommend consulting a qualified attorney for questions specific to your situation or
			jurisdiction.
		</p>
	</footer>
</article>
