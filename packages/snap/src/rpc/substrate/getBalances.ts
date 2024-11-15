import type { ApiPromise } from '@polkadot/api';
import type { AccountData } from '@polkadot/types/interfaces/balances/types';
import { getKeyPair } from '../../polkadot/account';

/**
 * Returns balance as BN
 * @param api
 * @param address
 */
export async function getBalances(api: ApiPromise, address?: string): Promise<AccountData> {
  if (!address) {
    address = (await getKeyPair()).address;
  }

  const account = (await api.query.system.account(address)) as unknown as { data: AccountData };
  console.info('QUERY BALANCE FOR ACCOUNT', account.data);

  return account.data;
}
