import { getTransaction } from '$eth/providers/alchemy.providers';
import { transactionsStore } from '$eth/stores/transactions.store';
import { decodeErc20AbiDataValue } from '$eth/utils/transactions.utils';
import { ETHEREUM_TOKEN, ETHEREUM_TOKEN_ID } from '$lib/constants/tokens.constants';
import { toastsError } from '$lib/stores/toasts.store';
import type { Token } from '$lib/types/token';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { TransactionResponse } from '@ethersproject/abstract-provider';
import type { BigNumber } from '@ethersproject/bignumber';
import { reloadBalance } from './balance.services';

export const processTransactionSent = async ({
	token,
	transaction
}: {
	token: Token;
	transaction: TransactionResponse;
}) => {
	if (token.id === ETHEREUM_TOKEN_ID) {
		await processEthTransaction({ hash: transaction.hash });
		return;
	}

	// We adapt the value for display purpose because the transaction we get has an ETH value of 0x00
	const value = decodeErc20AbiDataValue(transaction.data);

	await processErc20Transaction({ hash: transaction.hash, value, token, type: 'pending' });
};

export const processEthTransaction = async (params: { hash: string }) =>
	await processPendingTransaction(params);

export const processErc20Transaction = async ({
	type,
	...rest
}: {
	hash: string;
	value: BigNumber;
	token: Token;
	type: 'pending' | 'mined';
}) => {
	if (type === 'mined') {
		await processMinedTransaction({ ...rest });
		return;
	}

	await processPendingTransaction({ ...rest });
};

const processPendingTransaction = async ({
	hash,
	token = ETHEREUM_TOKEN,
	value
}: {
	hash: string;
	token?: Token;
	value?: BigNumber;
}) => {
	const transaction = await getTransaction(hash);

	if (isNullish(transaction)) {
		toastsError({
			msg: {
				text: `Failed to get the transaction from the provided (hash: ${hash}). Please reload the wallet dapp.`
			}
		});
		return;
	}

	transactionsStore.add({
		tokenId: token.id,
		transactions: [
			{
				...transaction,
				pendingTimestamp: Date.now(),
				...(nonNullish(value) && { value })
			}
		]
	});

	const { wait, hash: transactionHash } = transaction;

	await wait();

	await processMinedTransaction({ hash: transactionHash, token, value });
};

const processMinedTransaction = async ({
	hash,
	token,
	value
}: {
	hash: string;
	token: Token;
	value?: BigNumber;
}) => {
	const minedTransaction = await getTransaction(hash);

	if (isNullish(minedTransaction)) {
		toastsError({
			msg: {
				text: `Failed to get the mined transaction (hash: ${hash}). Please reload the wallet dapp.`
			}
		});
		return;
	}

	// We noticed that the timestamp was not provided when retrieving the transaction at this stage, i.e., after transaction.wait().
	// Therefore, because the transaction has just been mined and as the UI displays a transaction date in the list of transactions, we display now timestamp if undefined.
	// This is for simplicity reasons and because it allows us to avoid making an additional call to getTransaction.
	const { timestamp, ...rest } = minedTransaction;

	transactionsStore.update({
		tokenId: token.id,
		transaction: {
			...rest,
			timestamp,
			displayTimestamp: timestamp ?? Date.now() / 1000,
			...(nonNullish(value) && { value })
		}
	});

	// Reload balance as a transaction has been mined
	await reloadBalance(token);
};
