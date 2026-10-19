<script lang="ts">
	import {
		SHEET_TEXT_CLASS,
		groupLetters,
		type GroupLetter,
		type PrintoutSheet
	} from '$lib/scripture-builder/printoutSheet';

	let {
		sheet,
		groups = 1,
		titleHeading = true
	}: { sheet: PrintoutSheet; groups?: number; titleHeading?: boolean } = $props();

	const g = $derived(sheet.geometry);
	const letters = $derived(groupLetters(groups));
	const pageClass =
		'relative flex shrink-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface shadow-editorial break-inside-avoid break-after-page last:break-after-auto print:shadow-none';
</script>

{#snippet header(group: GroupLetter | null, meta: string | null, isFirst: boolean)}
	<header
		class={[
			'flex shrink-0 items-start justify-between gap-4',
			sheet.kind === 'tiles'
				? 'border-b-[1.25pt] border-on-surface'
				: 'border-b-2 border-primary'
		]}
		style:height="{g.headerIn}in"
		style:padding-top="{g.edgeSafeIn}in"
		style:padding-inline="{g.edgeSafeIn}in"
	>
		<div class="min-w-0">
			<p
				class="text-[7.5pt] leading-tight font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Scripture Builder · {sheet.levelLabel}
				{sheet.kind === 'tiles' ? 'cut-out tiles' : 'first-letter hints'}
			</p>
			{#if isFirst && titleHeading}
				<h1 class="font-serif text-[20pt] leading-tight text-primary">{sheet.reference}</h1>
			{:else}
				<p aria-hidden="true" class="font-serif text-[20pt] leading-tight text-primary">
					{sheet.reference}
				</p>
			{/if}
			<p class="text-[8pt] leading-tight text-on-surface-variant">
				{#if sheet.kind === 'tiles'}
					Cut on every line. Each cut separates two tiles. Stack every group's sheet and
					cut them together.
				{:else}
					Type it with first-letter hints. Same Advanced as the app. No answer key.
				{/if}
			</p>
		</div>
		<div
			class="shrink-0 text-right text-[8pt] leading-tight whitespace-nowrap text-on-surface-variant"
		>
			{#if group}
				<p class="font-semibold tracking-[0.14em] uppercase" data-sheet-group-badge>
					Group <span class="font-serif text-[22pt] leading-none text-primary"
						>{group}</span
					>
				</p>
			{/if}
			{#if meta}
				<p>{meta}</p>
			{/if}
			<p>seminarysidekick.com</p>
		</div>
	</header>
{/snippet}

<div
	class="scripture-sheet flex flex-col items-center gap-8 print:block"
	data-sheet-kind={sheet.kind}
	data-pages-per-group={sheet.kind === 'tiles' ? sheet.pages.length : 1}
>
	{#if sheet.kind === 'tiles'}
		{@const rowTemplate = sheet.geometry.rowHeightsIn.map((h) => `${h}in`).join(' ')}
		{@const pageCount = sheet.pages.length}
		{#each letters as group, groupIndex (group)}
			{#each sheet.pages as rows, index (index)}
				{@const pageLabel = `page ${index + 1} of ${pageCount}`}
				<section
					class={pageClass}
					data-sheet-page
					data-sheet-group={group}
					data-font-pt={g.fontPt}
					style:width="{g.pageWidthIn}in"
					style:height="{g.pageHeightIn}in"
				>
					{@render header(
						group,
						`${sheet.tileCount} tiles · ${pageLabel}`,
						groupIndex === 0 && index === 0
					)}
					<!-- Cells draw right/bottom only, so every cut line is drawn once. -->
					<ul
						class="grid shrink-0 grid-cols-2"
						style:grid-template-rows={rowTemplate}
						aria-label="{sheet.levelLabel} phrase tiles, group {group}, {pageLabel}"
						data-tile-grid="2"
					>
						{#each rows as row, rowIndex (rowIndex)}
							{#each row as cell, col (col)}
								{@const lines = [
									'border-on-surface',
									col === 0 && 'border-r-[1.25pt]',
									rowIndex < rows.length - 1 && 'border-b-[1.25pt]'
								]}
								{#if cell}
									<li
										class={['relative flex items-center justify-center', lines]}
									>
										<span
											aria-hidden="true"
											data-tile-group
											class="absolute top-[0.04in] font-sans text-[8pt] leading-none font-bold text-on-surface-variant"
											style:left="{g.edgeSafeIn}in">{group}</span
										>
										<p
											data-tile-phrase
											class={[SHEET_TEXT_CLASS, 'text-center text-balance']}
											style:max-width="{g.textWidthIn}in"
											style:font-size="{g.fontPt}pt"
											style:line-height={g.leading}
										>
											{cell.phrase}
										</p>
									</li>
								{:else}
									<li
										aria-hidden="true"
										data-tile-scrap
										class={['bg-surface-container', lines]}
									></li>
								{/if}
							{/each}
						{/each}
					</ul>
				</section>
			{/each}
		{/each}
	{:else}
		<section
			class={pageClass}
			data-sheet-page
			data-font-pt={g.fontPt}
			style:width="{g.pageWidthIn}in"
			style:height="{g.pageHeightIn}in"
		>
			{@render header(null, null, true)}
			<div
				class="flex shrink-0 items-center justify-center"
				style:height="{sheet.geometry.bodyHeightIn}in"
			>
				<p
					data-hint-line={sheet.hintLine}
					aria-label={sheet.hintLine}
					class={[SHEET_TEXT_CLASS, 'text-center']}
					style:max-width="{g.textWidthIn}in"
					style:font-size="{g.fontPt}pt"
					style:line-height={g.leading}
					style:letter-spacing="{g.trackingEm}em"
				>
					{sheet.hintLine}
				</p>
			</div>
		</section>
	{/if}
</div>
