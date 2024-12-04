import type { SnapConfig } from '@enjin-protos/metamask-enjin-types';

declare module '@enjin-protos/metamask-enjin-adapter' {
  export function injectMetamaskPolkadotSnapProvider(
    network: 'enjin-relaychain' | 'enjin-matrixchain' | 'canary-relaychain' | 'canary-matrixchain',
    config?: SnapConfig,
    pluginOrigin?: string
  ): void;
}
