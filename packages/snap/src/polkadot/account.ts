import type { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import type { SnapNetworks } from '@enjin-io/metamask-enjin-types';
import { getConfiguration } from '../configuration';

/**
 * Returns KeyringPair if one is saved in wallet state, creates new one otherwise
 */
export async function getKeyPair(): Promise<KeyringPair> {
  const config = await getConfiguration();
  const ss58Format = config.addressPrefix;
  const keyring = new Keyring({ ss58Format });

  const bip44Node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: getCoinTypeByNetwork(config.networkName)
    }
  });

  // generate keys
  const seed = bip44Node.privateKey.slice(0, 32);

  return keyring.addFromSeed(stringToU8a(seed));
}

export const getCoinTypeByNetwork = (network: SnapNetworks): number => {
  switch (network) {
    default:
      return 1155;
  }
};
