import type { SnapConfig } from '@enjin-protos/metamask-enjin-types';
import { getMetamaskState } from '../rpc/getMetamaskState';
import {
  defaultConfiguration,
  enjinMatrixConfiguration,
  enjinRelayConfiguration,
  canaryRelayConfiguration,
  canaryMatrixConfiguration
} from './predefined';

export function getDefaultConfiguration(networkName: string): SnapConfig {
  switch (networkName) {
    case 'enjin-relaychain':
      console.log('Enjin Relaychain configuration selected');
      return enjinRelayConfiguration;
    case 'enjin-matrixchain':
      console.log('Enjin Matrixchain configuration selected');
      return enjinMatrixConfiguration;
    case 'canary-relaychain':
      console.log('Canary Relaychain configuration selected');
      return canaryRelayConfiguration;
    case 'canary-matrixchain':
      console.log('Canary Matrixchain configuration selected');
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
  return JSON.parse(<string>state.config) as SnapConfig;
}
