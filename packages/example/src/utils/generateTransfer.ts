import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import type { GenericSignerPayload } from '@polkadot/types/extrinsic/SignerPayload';
import type { BlockInfo } from '@enjin-io/metamask-enjin-types';

interface TxPayload {
  payload: SignerPayloadJSON;
  tx: string;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateTransferPayload(
  rpc: ApiPromise,
  address: string,
  nonce: string,
  to: string,
  amount: string | number,
  block: BlockInfo,
  tip: string | null
): Promise<TxPayload> {
  // create signer options
  const signerOptions = {
    blockHash: block.hash,
    era: rpc.createType('ExtrinsicEra', {
      current: block.number,
      period: 64
    }),
    nonce,
    tip
  };

  // define transaction method
  const transaction: SubmittableExtrinsic<'promise'> = rpc.tx.balances.transferKeepAlive(
    to,
    amount
  );

  // create SignerPayload
  const signerPayload = rpc.createType('SignerPayload', {
    genesisHash: rpc.genesisHash,
    runtimeVersion: rpc.runtimeVersion,
    version: rpc.extrinsicVersion,
    ...signerOptions,
    address: address,
    blockNumber: block.number,
    method: transaction.method,
    signedExtensions: [],
    transactionVersion: transaction.version
  }) as unknown as GenericSignerPayload;

  return {
    payload: signerPayload.toPayload(),
    tx: transaction.toHex()
  };
}
