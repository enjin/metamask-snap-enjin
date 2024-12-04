import type { SnapConfig } from '@enjin/metamask-enjin-types';

export const enjinRelayConfiguration: SnapConfig = {
  addressPrefix: 2135,
  networkName: 'enjin-relaychain',
  genesisHash: '0xd8761d3c88f26dc12875c00d3165f7d67243d56fc85b4cf19937601a7916e5a9',
  unit: {
    decimals: 18,
    image: 'https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg',
    symbol: 'ENJ'
  },
  wsRpcUrl: 'https://rpc.relay.blockchain.enjin.io/'
};

export const enjinMatrixConfiguration: SnapConfig = {
  addressPrefix: 1110,
  networkName: 'enjin-matrixchain',
  genesisHash: '0x3af4ff48ec76d2efc8476730f423ac07e25ad48f5f4c9dc39c778b164d808615',
  unit: {
    decimals: 18,
    image: 'https://svgshare.com/i/L3o.svg',
    symbol: 'ENJ'
  },
  wsRpcUrl: 'https://rpc.matrix.blockchain.enjin.io/'
};

export const canaryRelayConfiguration: SnapConfig = {
  addressPrefix: 69,
  networkName: 'canary-relaychain',
  genesisHash: '0x735d8773c63e74ff8490fee5751ac07e15bfe2b3b5263be4d683c48dbdfbcd15',
  unit: {
    decimals: 18,
    image: 'https://svgshare.com/i/L2d.svg',
    symbol: 'cENJ'
  },
  wsRpcUrl: 'https://rpc.relay.canary.enjin.io/'
};

export const canaryMatrixConfiguration: SnapConfig = {
  addressPrefix: 9030,
  networkName: 'canary-matrixchain',
  genesisHash: '0xa37725fd8943d2a524cb7ecc65da438f9fa644db78ba24dcd0003e2f95645e8f',
  unit: {
    decimals: 18,
    image: 'https://svgshare.com/i/L2d.svg',
    symbol: 'cENJ'
  },
  wsRpcUrl: 'https://rpc.matrix.canary.enjin.io/'
};

export const defaultConfiguration: SnapConfig = enjinRelayConfiguration;
