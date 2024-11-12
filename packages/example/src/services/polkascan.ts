export function getPolkascanTxUrl(txHash: string, network: string): string {
  switch (network) {
    case 'enjin-relaychain':
      return `https://enjin.subscan.io/extrinsic/${txHash}`;
    case 'enjin-matrixchain':
      return `https://enjin-matrix.subscan.io/extrinsic/${txHash}`;
    case 'canary-relaychain':
      return `https://canary.subscan.io/extrinsic/${txHash}`;
    case 'canary-matrixchain':
      return `https://canary-matrix.subscan.io/extrinsic/${txHash}`;
    default:
      return '';
  }
}
