import { ApiPromise } from '@polkadot/api/';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxPayload } from '@enjin/metamask-enjin-types';

export async function generateTransferPayload(
  address: string,
  to: string,
  amount: string | number,
  tip: string | null
): Promise<TxPayload> {
  // fetch last signed block and account address
  const api = await ApiPromise.create();
  const signedBlock = await api.rpc.chain.getBlock();
  // create signer options
  const nonce = (await api.derive.balances.account(address)).accountNonce;
  const signerOptions = {
    blockHash: signedBlock.block.header.hash,
    era: api.createType('ExtrinsicEra', {
      current: signedBlock.block.header.number,
      period: 64
    }),
    nonce,
    tip
  };

  // define transaction method
  const transaction: SubmittableExtrinsic<'promise'> = api.tx.balances.transferKeepAlive(
    to,
    amount
  );

  // create SignerPayload
  const signerPayload = api.createType('SignerPayload', {
    genesisHash: api.genesisHash,
    runtimeVersion: api.runtimeVersion,
    version: api.extrinsicVersion,
    ...signerOptions,
    address: to,
    blockNumber: signedBlock.block.header.number,
    method: transaction.method,
    signedExtensions: [],
    transactionVersion: transaction.version
  });

  return {
    payload: signerPayload.toPayload(),
    tx: transaction.toHex()
  };
}
