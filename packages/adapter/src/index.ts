import '@polkadot/types-augment';
import type { SnapConfig } from '@enjin-io/metamask-enjin-types';
import { MetamaskPolkadotSnap } from './snap';
import {
  getMetaMask,
  hasMetaMask,
  isMetamaskSnapsSupported,
  isPolkadotSnapInstalled
} from './utils';

const defaultSnapOrigin = 'npm:@enjin-io/snap';

export type SnapInstallationParamNames = string;

export * from './extension';
export { hasMetaMask, isPolkadotSnapInstalled, isMetamaskSnapsSupported } from './utils';

export async function enablePolkadotSnap(
  config: SnapConfig = { networkName: 'enjin-relaychain' },
  snapOrigin?: string,
  snapInstallationParams: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskPolkadotSnap> {
  const snapId = snapOrigin ?? defaultSnapOrigin;

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error('Metamask is not installed');
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }
  if (!config.networkName) {
    config.networkName = 'enjin-relaychain';
  }

  const isInstalled = await isPolkadotSnapInstalled(snapId);

  if (!isInstalled) {
    const metamask = await getMetaMask();
    await metamask?.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { ...snapInstallationParams }
      }
    });
  }

  // create snap describer
  const snap = new MetamaskPolkadotSnap(snapOrigin || defaultSnapOrigin, config);
  // set initial configuration

  try {
    const snapApi = snap.getMetamaskSnapApi();
    await snapApi.setConfiguration(config);
  } catch (err) {
    console.error('Failed to set configuration', err);
  }

  return snap;
}
