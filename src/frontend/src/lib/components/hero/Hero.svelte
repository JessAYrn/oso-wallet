<script lang="ts">
	import Actions from '$lib/components/hero/Actions.svelte';
	import HeaderHero from '$lib/components/layout/HeaderHero.svelte';
	import Alpha from '$lib/components/core/Alpha.svelte';
	import { erc20TokensInitialized } from '$lib/derived/erc20.derived';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Logo from '$lib/components/ui/Logo.svelte';
	import { token } from '$lib/derived/token.derived';
	import Balance from '$lib/components/hero/Balance.svelte';

	export let summary = false;
	export let actions = true;
	export let send = false;

	let displayTokenSymbol = false;
	$: displayTokenSymbol = summary && $erc20TokensInitialized;
</script>

<div class="hero">
	<HeaderHero />

	<article class="flex flex-col text-off-white rounded-lg pt-1 sm:pt-3 pb-2 px-4 relative main">
		<Alpha />

		{#if summary}
			<div transition:slide={{ delay: 0, duration: 250, easing: quintOut, axis: 'y' }}>
				<div class="icon flex flex-col items-start mt-3 md:mt-6 mb-0.5 pt-2">
					{#if displayTokenSymbol}
						<div in:fade>
							<Logo src={$token.icon} size="64px" alt={`${$token.name} logo`} color="off-white" />
						</div>
					{/if}
				</div>

				<Balance />
			</div>
		{/if}

		{#if actions}
			<div transition:slide={{ delay: 0, duration: 250, easing: quintOut, axis: 'y' }}>
				<Actions {send} />
			</div>
		{/if}
	</article>
</div>

<style lang="scss">
	.hero {
		background: linear-gradient(61.79deg, #321469 62.5%, var(--color-misty-rose) 100%);

		--alpha-color: var(--color-grey);

		@include media.min-width(xlarge) {
			article {
				margin-top: -80px;
			}
		}
	}

	.icon {
		min-height: calc(64px + var(--padding-4x));
	}
</style>