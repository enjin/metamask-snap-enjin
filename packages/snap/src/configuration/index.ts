import type { SnapConfig } from '@enjin/metamask-enjin-types';
import { getMetamaskState } from '../rpc/getMetamaskState';
import {
  defaultConfiguration,
  enjinMatrixConfiguration,
  enjinRelayConfiguration,
  canaryRelayConfiguration,
  canaryMatrixConfiguration
} from './predefined';

export function getDefaultConfiguration(networkName?: string): SnapConfig {
  switch (networkName) {
    case 'enjin-relaychain':
      return enjinRelayConfiguration;
    case 'enjin-matrixchain':
      return enjinMatrixConfiguration;
    case 'canary-relaychain':
      return canaryRelayConfiguration;
    case 'canary-matrixchain':
      return canaryMatrixConfiguration;
    default:
      return defaultConfiguration;
  }
}

export async function getConfiguration(): Promise<SnapConfig> {
  const state = await getMetamaskState();

  if (!state || !state.config) {
    return defaultConfiguration;
  }

  return JSON.parse(<string>state.config) as unknown as SnapConfig;
}
