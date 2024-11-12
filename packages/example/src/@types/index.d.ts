import type { SnapConfig } from '@enjin/metamask-enjin-types';

declare module '@enjin/metamask-enjin-adapter' {
  export function injectMetamaskPolkadotSnapProvider(
    network: 'enjin-relaychain' | 'enjin-matrixchain' | 'canary-relaychain' | 'canary-matrixchain',
    config?: SnapConfig,
    pluginOrigin?: string
  ): void;
}
