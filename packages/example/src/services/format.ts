export function shortAddress(address: string): string {
  return address.slice(0, 7) + '.....' + address.slice(-7);
}

export function getCurrency(network: string): string {
  switch (network) {
    case 'enjin-relaychain':
      return 'ENJ';
    case 'enjin-matrixchain':
      return 'ENJ';
    case 'canary-relaychain':
      return 'cENJ';
    case 'canary-matrixchain':
      return 'cENJ';
  }
  return '';
}
