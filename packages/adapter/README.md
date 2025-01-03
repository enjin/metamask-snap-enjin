# Metamask <> Enjin snap adapter

![](https://github.com/enjin/metamask-snap-enjin/workflows/ci/badge.svg)
![](https://img.shields.io/github/license/enjin/metamask-snap-enjin)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![Discord](https://img.shields.io/discord/644182966574252073?color=blue&label=Discord&logo=discord)

Metamask <> Enjin snap adapter is used to inject [enjin snap](https://github.com/enjin/metamask-snap-enjin) as web3 provider. It lists snap inside `window.injectedWeb3[metamask-enjin-snap]` so it can be enabled using `@polkadot/extension-dapp` package.  

For more details on Enjin snap itself see [snap repo](https://github.com/enjin/metamask-snap-enjin) or read [Enjin snap guide](https://support.enjin.io/hc/en-gb/articles/23053873072274-Enjin-Snap).

## Usage

Adapter has only one exposed function for enabling snap as web3 provider.

```typescript
function enablePolkadotSnap(
  config?: SnapConfig,
  snapOrigin?: string,
  snapInstallationParams?: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskPolkadotSnap>
```

By providing `config` as argument it is possible to override default configurations.

Configuration structure is shown below.

```
export type SnapConfig = {
  wsRpcUrl?: string;
  addressPrefix?: number;
  unit?: UnitConfiguration;
} & (
  | { networkName: SupportedSnapNetworks; genesisHash?: `0x${string}` }
  | { networkName: SnapNetworks; genesisHash: `0x${string}` }
);

SnapNetworks = 'enjin-relaychain' | 'enjin-matrixchain' | 'canary-relaychain' | 'canary-matrixchain';

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}
```

