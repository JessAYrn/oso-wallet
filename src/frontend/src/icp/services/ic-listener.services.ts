import { icTransactionsStore } from '$icp/stores/ic-transactions.store';
import type { GetTransactions } from '$icp/types/ic.post-message';
import { balancesStore } from '$lib/stores/balances.store';
import type { PostMessageDataResponseWallet } from '$lib/types/post-message';
import type { TokenId } from '$lib/types/token';
import { jsonReviver } from '@dfinity/utils';
import { BigNumber } from '@ethersproject/bignumber';

export const syncWallet = <T extends GetTransactions>({
	data,
	tokenId
}: {
	data: PostMessageDataResponseWallet<T>;
	tokenId: TokenId;
}) => {
	const {
		wallet: {
			balance: { certified, data: balance },
			newTransactions
		}
	} = data;

	balancesStore.set({
		tokenId,
		data: {
			data: BigNumber.from(balance),
			certified
		}
	});

	icTransactionsStore.prepend({
		tokenId,
		transactions: JSON.parse(newTransactions, jsonReviver)
	});
};
