<script lang="ts">
	import { Dropdown, DropdownItem } from '@dfinity/gix-components';
	import { debounce, isNullish, nonNullish } from '@dfinity/utils';
	import type { NetworkId } from '$lib/types/network';
	import {
		ETHEREUM_NETWORK,
		ETHEREUM_NETWORK_ID,
		ETHEREUM_NETWORK_SYMBOL,
		ICP_NETWORK,
		ICP_NETWORK_ID,
		ICP_NETWORK_SYMBOL
	} from '$lib/constants/networks.constants';
	import { BTC_NETWORK, BTC_NETWORK_ID, BTC_NETWORK_SYMBOL } from '$icp/constants/ckbtc.constants';
	import { isBtcAddress, isNetworkIdBTC } from '$icp/utils/ic-send.utils';
	import { isIcrcAddress } from '$icp/utils/icrc-account.utils';
	import IcSendBtcNetwork from '$icp/components/send/IcSendBtcNetwork.svelte';
	import { isEthAddress } from '$lib/utils/account.utils';

	export let networkId: NetworkId | undefined = undefined;
	export let destination: string | undefined = undefined;
	export let dropdownNetworkBitcoin = false;
	export let dropdownNetworkEthereum = false;

	let networkSymbol: string | undefined = isNetworkIdBTC(networkId)
		? BTC_NETWORK_SYMBOL
		: networkId === ICP_NETWORK_ID
			? ICP_NETWORK_SYMBOL
			: networkId === ETHEREUM_NETWORK_ID
				? ETHEREUM_NETWORK_SYMBOL
				: undefined;

	const onDestinationAddressInput = debounce(async () => {
		if (nonNullish(networkId)) {
			// A network was already manually selected
			return;
		}

		if (isNullish(destination) || destination === '') {
			return;
		}

		if (
			isBtcAddress({
				address: destination,
				network: BTC_NETWORK
			})
		) {
			networkSymbol = BTC_NETWORK_SYMBOL;
			return;
		}

		if (isIcrcAddress(destination)) {
			networkSymbol = ICP_NETWORK_SYMBOL;
		}

		if (isEthAddress(destination)) {
			networkSymbol = ETHEREUM_NETWORK_SYMBOL;
		}
	});

	$: destination, onDestinationAddressInput();

	$: networkSymbol,
		(() => {
			switch (networkSymbol) {
				case BTC_NETWORK_SYMBOL:
					networkId = BTC_NETWORK_ID;
					break;
				case ICP_NETWORK_SYMBOL:
					networkId = ICP_NETWORK_ID;
					break;
				case ETHEREUM_NETWORK_SYMBOL:
					networkId = ETHEREUM_NETWORK_ID;
					break;
			}
		})();
</script>

<label for="network" class="font-bold px-4.5">Network:</label>

<div id="network" class="mb-4 mt-1 pt-0.5">
	<Dropdown name="network" bind:selectedValue={networkSymbol}>
		<option disabled selected value={undefined} class="hidden"
			><span class="description">Select network</span></option
		>
		<DropdownItem value={ICP_NETWORK_SYMBOL}>{ICP_NETWORK.name}</DropdownItem>

		{#if dropdownNetworkBitcoin}
			<DropdownItem value={BTC_NETWORK_SYMBOL}>
				<IcSendBtcNetwork />
			</DropdownItem>
		{/if}

		{#if dropdownNetworkEthereum}
			<DropdownItem value={ETHEREUM_NETWORK_SYMBOL}>{ETHEREUM_NETWORK.name}</DropdownItem>
		{/if}
	</Dropdown>
</div>

<style lang="scss">
	.hidden {
		display: none;
	}
</style>
