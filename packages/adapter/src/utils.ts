import type { EIP6963AnnounceProviderEvent, EIP1193Provider } from './types';

export function hasMetaMask(): boolean {
  if (!window.ethereum) {
    return false;
  }
  return window.ethereum.isMetaMask;
}

export function getMetaMask(): Promise<EIP1193Provider> {
  return new Promise<EIP1193Provider>((resolve, reject) => {
    let isResolved = false;

    const handleAnnounce = (event: EIP6963AnnounceProviderEvent): void => {
      if (event.detail.provider.isMetaMask && !event.detail.provider.isPhantom) {
        resolve(event.detail.provider);
        isResolved = true;
      }
    };

    window.addEventListener('eip6963:announceProvider', handleAnnounce as unknown as EventListener);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    setTimeout(() => {
      window.removeEventListener(
        'eip6963:announceProvider',
        handleAnnounce as unknown as EventListener
      );

      if (!isResolved) {
        reject(new Error('MetaMask provider not found'));
      }
    }, 1000);
  });
}

export async function isPolkadotSnapInstalled(
  snapOrigin: string,
  version?: string
): Promise<boolean> {
  try {
    const walletSnaps = await getWalletSnaps();
    return !!Object.values(walletSnaps).find(
      (permission) => permission.id === snapOrigin && (!version || permission.version === version)
    );
  } catch (e) {
    console.error('Failed to obtain installed snaps', e);
    return false;
  }
}

export type GetSnapsResponse = {
  [k: string]: {
    permissionName?: string;
    id?: string;
    version?: string;
    initialPermissions?: { [k: string]: unknown };
  };
};

async function getWalletSnaps(): Promise<GetSnapsResponse> {
  const metamask = await getMetaMask();

  return await metamask.request({
    method: 'wallet_getSnaps'
  });
}

export async function isMetamaskSnapsSupported(): Promise<boolean> {
  try {
    await getWalletSnaps();
    return true;
  } catch (e) {
    return false;
  }
}
