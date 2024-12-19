import type { SnapConfig } from '@enjin-io/metamask-enjin-types';

declare module '@enjin-io/metamask-enjin-adapter' {
  export function injectMetamaskPolkadotSnapProvider(
    network: 'enjin-relaychain' | 'enjin-matrixchain' | 'canary-relaychain' | 'canary-matrixchain',
    config?: SnapConfig,
    pluginOrigin?: string
  ): void;
}
