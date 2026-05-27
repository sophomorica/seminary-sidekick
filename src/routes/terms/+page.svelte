<script lang="ts">
	import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '$lib/config/site';

	const lastUpdated = 'May 27, 2026';
	const pageTitle = `Terms of Use — ${SITE_NAME}`;
	const canonical = `${SITE_URL}/terms`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta
		name="description"
		content="Terms of Use for Seminary Sidekick. The rules for using our marketing site, playable demos, and companion mobile apps."
	/>
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content="Terms of Use — Seminary Sidekick" />
	<meta
		property="og:description"
		content="Clear, straightforward terms for a simple, focused experience. No accounts required in the current phase."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<header class="mb-10">
		<p class="eyebrow">Legal</p>
		<h1 class="font-serif text-display-md md:text-display-lg">Terms of Use</h1>
		<p class="mt-3 text-body-md text-on-surface-variant">Last updated {lastUpdated}</p>
	</header>

	<!-- Acceptance -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		Acceptance of these terms
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		By accessing or using the Seminary Sidekick website, playable demos, or mobile applications
		(collectively, the "Services"), you agree to be bound by these Terms of Use ("Terms"). If
		you do not agree, please do not use the Services.
	</p>

	<!-- Description of Services -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		Description of the Services
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Seminary Sidekick provides a marketing website and two interactive scripture mastery
		practice tools (Quick Quiz and Scripture Match) that anyone may use freely. The companion
		mobile apps extend this experience with progress tracking, additional practice modes, and
		optional premium features for those who choose to subscribe.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The current phase of the project does not require or support user accounts. Everything you
		do on the website and in the apps stays on your device.
	</p>

	<!-- Eligibility -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Eligibility</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The Services are intended for seminary students, teachers, and families. You must be at
		least 13 years old (or the minimum age required in your jurisdiction) to use the Services.
		By using them, you represent that you meet this requirement. Parents and guardians are
		welcome to explore the site and apps alongside younger students.
	</p>

	<!-- No accounts (Tier 1) -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		No accounts required (current phase)
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		In this phase, you do not need to create an account or provide personal information to use
		the website or apps. Your progress and settings are stored locally on your device. Future
		phases may introduce optional accounts for features such as teacher resources or community
		sharing. When that happens, we will update these Terms and provide clear notice.
	</p>

	<!-- License -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		License to use the Services
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable
		license to access and use the website, demos, and apps for your personal, non-commercial
		use. You may not copy, modify, distribute, sell, lease, or create derivative works from the
		Services except as expressly permitted.
	</p>

	<!-- Subscriptions and billing -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		Subscriptions and billing
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Optional premium features inside the mobile apps are available through auto-renewing
		subscriptions purchased exclusively through the Apple App Store or Google Play Store. We use
		RevenueCat to help the apps recognize valid subscriptions on your device. We do not handle
		payments, store credit card information, or manage billing directly.
	</p>
	<ul
		class="mb-6 list-disc space-y-2 pl-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface marker:text-primary"
	>
		<li>Payment is processed entirely by Apple or Google according to their own terms.</li>
		<li>
			You may manage, cancel, or change your subscription at any time through your device’s
			App Store or Play Store settings.
		</li>
		<li>Refunds and billing disputes are handled by Apple or Google under their policies.</li>
		<li>
			Subscription prices are set by us and may change; any changes will be communicated
			through the stores.
		</li>
	</ul>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Your subscription gives you access to premium features only while it remains active on the
		device and account used for purchase.
	</p>

	<!-- Intellectual property -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Intellectual property</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		All content, design, code, scripture mastery data structures, and other materials in the
		Services are owned by Seminary Sidekick or its licensors and are protected by copyright,
		trademark, and other laws. You may not use our trademarks or branding without prior written
		permission.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The doctrinal mastery scriptures themselves are public domain or used under appropriate
		permissions from The Church of Jesus Christ of Latter-day Saints. We are grateful for the
		scriptures and make no claim to them.
	</p>

	<!-- Prohibited conduct -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Prohibited conduct</h2>
	<p class="mb-4 font-serif text-[1.125rem] leading-[1.75] text-on-surface">You agree not to:</p>
	<ul
		class="mb-6 list-disc space-y-2 pl-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface marker:text-primary"
	>
		<li>Use the Services for any illegal purpose or in violation of any applicable laws.</li>
		<li>Attempt to reverse engineer, decompile, or discover the source code of the apps.</li>
		<li>Interfere with or disrupt the Services or the experience of other users.</li>
		<li>
			Attempt to circumvent subscription requirements or share subscription access improperly.
		</li>
		<li>Remove or alter any copyright, trademark, or other proprietary notices.</li>
	</ul>

	<!-- Disclaimers -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Disclaimers</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The Services are provided "as is" and "as available" without warranties of any kind, whether
		express or implied. We do not warrant that the Services will be uninterrupted, error-free,
		or completely secure. Your use of the Services is at your own risk.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The scripture practice tools are meant to support study and memorization. They are not a
		replacement for personal scripture study, prayer, or the guidance of teachers and leaders.
	</p>

	<!-- Limitation of liability -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Limitation of liability</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		To the fullest extent permitted by law, Seminary Sidekick and its creators shall not be
		liable for any indirect, incidental, special, consequential, or punitive damages arising
		from your use of the Services. In no event shall our total liability exceed the amount you
		paid for a subscription in the twelve months preceding the claim (or fifty US dollars if you
		have paid nothing).
	</p>

	<!-- Termination -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Termination</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We may suspend or terminate your access to the Services at any time if you violate these
		Terms. Upon termination, your license to use the Services ends immediately. Any active
		subscriptions continue to be governed by the App Store or Play Store terms.
	</p>

	<!-- Changes to terms -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Changes to these Terms</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We may update these Terms from time to time. We will post the revised version with a new
		"Last updated" date. Continued use of the Services after changes take effect constitutes
		your acceptance of the updated Terms. Material changes will be noted where practical.
	</p>

	<!-- Future features -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">
		Future features and updates (TBD)
	</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		We plan to expand the Seminary Sidekick Suite over time with additional apps, a teacher
		resource library, and community features. These additions will likely require accounts and
		new terms. We will communicate clearly and update these Terms before launching such
		features. Until then, the current Terms apply.
	</p>

	<!-- Governing law -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Governing law</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		These Terms shall be governed by and construed in accordance with the laws of the United
		States and the State of Utah, without regard to its conflict of law principles. Any disputes
		shall be resolved in the state or federal courts located in Utah, to the extent permitted by
		law.
	</p>

	<!-- Contact -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Contact us</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Questions about these Terms? We’re happy to hear from you.
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
		Please also read our <a
			href="/privacy"
			class="focus-ring text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
			>Privacy Policy</a
		> to understand how we handle information.
	</p>

	<footer class="border-t border-outline-variant/30 pt-8 text-body-sm text-on-surface-variant">
		<p>
			These Terms are intended to be clear and fair. They are not a substitute for legal
			advice. If you have specific legal questions, please consult a qualified attorney
			familiar with your jurisdiction.
		</p>
	</footer>
</article>
