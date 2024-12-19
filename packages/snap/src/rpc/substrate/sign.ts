import type { ApiPromise } from '@polkadot/api/';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { formatBalance, stringToU8a, u8aToHex } from '@polkadot/util';
import { getKeyPair } from '../../polkadot/account';
import { showRawPayloadDialog, showJSONPayloadDialog } from '../../util/confirmation';
import { getDefaultConfiguration } from '../../configuration';

export async function signPayloadJSON(
  api: ApiPromise,
  payload: SignerPayloadJSON
): Promise<{ signature: string } | void> {
  const keyPair = await getKeyPair();
  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
    version: payload.version
  });

  const method = api.registry.createType('Call', extrinsic.method);

  const config = getDefaultConfiguration();
  formatBalance.setDefaults({
    decimals: config.unit.decimals,
    unit: config.unit.symbol
  });

  const confirmation = await showJSONPayloadDialog({
    address: `polkadot:${api.genesisHash.toString().slice(2, 34)}:${keyPair.address}`,
    prompt: `Do you want to sign this transaction?`,
    info: [
      { message: 'chain', value: api.runtimeChain.toString() },
      { message: 'version', value: extrinsic.specVersion.toString() },
      { message: 'nonce', value: extrinsic.nonce.toString() },
      { message: 'tip', value: formatBalance(extrinsic.tip.toString(), { forceUnit: '0' }) },
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
