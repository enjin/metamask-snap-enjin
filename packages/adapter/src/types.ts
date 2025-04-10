import type {
  AccountData,
  BlockInfo,
  SnapConfig,
  SnapRpcMethodRequest,
  Transaction,
  TxPayload
} from '@enjin-io/metamask-enjin-types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { SignerPayloadRaw } from '@polkadot/types/types/extrinsic';
import type { SignerPayloadJSON } from '@polkadot/types/types';

export interface MetamaskSnapApi {
  getAddress(): Promise<string>;

  getPublicKey(): Promise<string>;

  getBalances(): Promise<AccountData>;

  getLatestBlock(): Promise<BlockInfo>;

  getConfiguration(): Promise<SnapConfig>;

  setConfiguration(configuration: SnapConfig): Promise<void>;

  getAllTransactions(): Promise<Transaction[]>;

  signPayloadJSON(payload: SignerPayloadJSON): Promise<string>;

  signPayloadRaw(payload: SignerPayloadRaw): Promise<string>;

  send(signature: string, txPayload: TxPayload): Promise<Transaction>;
}

export interface InjectedMetamaskExtension extends InjectedExtension {
  getMetamaskSnapApi: () => Promise<MetamaskSnapApi>;
}

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      isPhantom: boolean;
      detected: EIP1193Provider[];
      providers: EIP1193Provider[];

      send: (
        request: SnapRpcMethodRequest | { method: string; params?: never[] }
      ) => Promise<unknown>;
      on: (eventName: unknown, callback: unknown) => unknown;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: <T>(request: SnapRpcMethodRequest | { method: string; params?: any }) => Promise<T>;
    };
  }
  interface WindowEventMap {
    'eip6963:announceProvider': CustomEvent<EIP6963AnnounceProviderEvent>;
  }
}

interface EIP6963ProviderInfo {
  walletId: string;
  uuid: string;
  name: string;
  icon: string;
}

export type EIP1193Provider = typeof window.ethereum;

export type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: EIP1193Provider;
  };
};
