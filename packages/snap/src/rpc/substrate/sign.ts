/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ApiPromise } from '@polkadot/api/';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { getKeyPair } from '../../polkadot/account';
import { showRawPayloadDialog, showJSONPayloadDialog } from '../../util/confirmation';

export async function signPayloadJSON(
  api: ApiPromise,
  payload: SignerPayloadJSON
): Promise<{ signature: string } | void> {
  const keyPair = await getKeyPair();
  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
    version: payload.version
  });

  const method = api.registry.createType('Call', extrinsic.method);

  const confirmation = await showJSONPayloadDialog({
    address: `polkadot:${api.genesisHash.toString().slice(2, 34)}:${keyPair.address}`,
    prompt: `Do you want to sign this transaction?`,
    info: [
      { message: 'chain', value: api.runtimeChain.toString() },
      { message: 'version', value: extrinsic.specVersion.toString() },
      { message: 'nonce', value: extrinsic.nonce.toString() },
      { message: 'tip', value: extrinsic.tip.toString() },
      {
        message: 'method',
        value: `${method.section}.${method.method}`
      },
      { message: 'arguments', value: method.toHuman().args as Record<string, string> },
      {
        message: 'info',
        value: method.meta?.docs.join(' ')
      }
    ]
  });
  if (confirmation) {
    return extrinsic.sign(keyPair);
  }
}

export async function signPayloadRaw(
  api: ApiPromise,
  payload: SignerPayloadRaw
): Promise<{ signature: string } | void> {
  const keyPair = await getKeyPair();
  const confirmation = await showRawPayloadDialog({
    address: `polkadot:${api.genesisHash.toString().slice(2, 34)}:${keyPair.address}`,
    prompt: `Do you want to sign this message?`,
    textAreaContent: payload.data
  });
  // return seed if user confirmed action
  if (confirmation) {
    const signedBytes = keyPair.sign(stringToU8a(payload.data));
    return {
      signature: u8aToHex(signedBytes)
    };
  }
}
