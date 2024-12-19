/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  AccountData,
  BlockInfo,
  MetamaskPolkadotRpcRequest,
  SignPayloadJSONRequest,
  SignPayloadRawRequest,
  SnapConfig,
  Transaction,
  TxPayload
} from '@enjin/metamask-enjin-types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { MetamaskPolkadotSnap } from './snap';

async function sendSnapMethod(
  request: MetamaskPolkadotRpcRequest,
  snapId: string
): Promise<unknown> {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      request,
      snapId
    }
  });
}

async function sign(
  this: MetamaskPolkadotSnap,
  method: 'signPayloadJSON' | 'signPayloadRaw',
  payload: SignerPayloadJSON | SignerPayloadRaw
): Promise<{ signature: string }> {
  return (await sendSnapMethod(
    {
      method,
      params: {
        payload
      }
    } as SignPayloadJSONRequest | SignPayloadRawRequest,
    this.snapId
  )) as { signature: string };
}

export async function signPayloadJSON(
  this: MetamaskPolkadotSnap,
  payload: SignerPayloadJSON
): Promise<string> {
  return (await sign.bind(this)('signPayloadJSON', payload)).signature;
}

export async function signPayloadRaw(
  this: MetamaskPolkadotSnap,
  payload: SignerPayloadRaw
): Promise<string> {
  return (await sign.bind(this)('signPayloadRaw', payload)).signature;
}

export async function getBalances(this: MetamaskPolkadotSnap): Promise<AccountData> {
  try {
    return (await sendSnapMethod({ method: 'getBalances' }, this.snapId)) as AccountData;
  } catch (e) {
    console.log('Unable to fetch balances', e);
    return { free: '0', reserved: '0' };
  }
}

export async function getAddress(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getAddress' }, this.snapId)) as string;
}

export async function getPublicKey(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getPublicKey' }, this.snapId)) as string;
}

export async function getConfiguration(this: MetamaskPolkadotSnap): Promise<SnapConfig> {
  return (await sendSnapMethod({ method: 'getConfiguration' }, this.snapId)) as SnapConfig;
}

export async function setConfiguration(
  this: MetamaskPolkadotSnap,
  config: SnapConfig
): Promise<void> {
  await sendSnapMethod({ method: 'configure', params: { configuration: config } }, this.snapId);
}

export async function getLatestBlock(this: MetamaskPolkadotSnap): Promise<BlockInfo> {
  try {
    return (await sendSnapMethod(
      { method: 'getBlock', params: { blockTag: 'latest' } },
      this.snapId
    )) as BlockInfo;
  } catch (e) {
    console.log('Unable to fetch latest block', e);
    return { hash: '', number: '' };
  }
}

export async function getAllTransactions(this: MetamaskPolkadotSnap): Promise<Transaction[]> {
  return (await sendSnapMethod({ method: 'getAllTransactions' }, this.snapId)) as Transaction[];
}

export async function sendSignedData(
  this: MetamaskPolkadotSnap,
  signature: string,
  txPayload: TxPayload
): Promise<Transaction> {
  const response = await sendSnapMethod(
    {
      method: 'send',
      params: {
        signature,
        txPayload
      }
    },
    this.snapId
  );
  return response as Transaction;
}
