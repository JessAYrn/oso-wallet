<script lang="ts">
	import { shortenWithMiddleEllipsis } from '$lib/utils/format.utils';
	import IconExternalLink from '$lib/components/icons/IconExternalLink.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { address } from '$lib/derived/address.derived';

	const ETHERSCAN_URL = import.meta.env.VITE_ETHERSCAN_EXPLORER_URL;

	let explorerUrl = `${ETHERSCAN_URL}/address/${$address ?? ''}`;
</script>

<div>
	<label class="block text-sm font-bold" for="eth-wallet-address">Wallet address:</label>

	<output class="break-all" id="eth-wallet-address"
		>{shortenWithMiddleEllipsis($address ?? '')}</output
	><Copy inline value={$address ?? ''} text="Address copied to clipboard." />
</div>

<a
	href={explorerUrl}
	rel="external noopener noreferrer"
	target="_blank"
	class="flex gap-2 items-center no-underline"
	aria-label="Open your address on Etherscan"
>
	<IconExternalLink />
	View on explorer
</a>
