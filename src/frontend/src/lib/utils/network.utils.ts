import { ICP_NETWORK_ID } from '$lib/constants/networks.constants';
import type { Network, NetworkId } from '$lib/types/network';

export const isNetworkICP = ({ id }: Network): boolean => isNetworkIdICP(id);

export const isNetworkIdICP = (id: NetworkId): boolean => ICP_NETWORK_ID === id;