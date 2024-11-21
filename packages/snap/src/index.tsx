import type { ApiPromise } from '@polkadot/api/promise';
import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { BN } from '@polkadot/util';
import { InputChangeEvent, UserInputEventType } from "@metamask/snaps-sdk";
import {
  Box,
  Dropdown,
  Heading,
  Text,
  Section,
  Option,
  Row,
  Button,
  Value,
  Copyable,
  Icon,
  Image
} from '@metamask/snaps-sdk/jsx';
import type { OnHomePageHandler, OnUserInputHandler, OnInstallHandler } from '@metamask/snaps-sdk';
import { assert } from 'superstruct';
import type { MetamaskState } from './interfaces';
import { EmptyMetamaskState } from './interfaces';
import { getPublicKey } from './rpc/getPublicKey';
import { exportSeed } from './rpc/exportSeed';
import { getBalances, IAccountData } from "./rpc/substrate/getBalances";
import { getAddress } from './rpc/getAddress';
import { getTransactions } from './rpc/substrate/getTransactions';
import { getBlock } from './rpc/substrate/getBlock';
import { getApi, resetApi } from './polkadot/api';
import { configure } from './rpc/configure';
import { signPayloadJSON, signPayloadRaw } from './rpc/substrate/sign';
import { generateTransactionPayload } from './rpc/generateTransactionPayload';
import { send } from './rpc/send';
import {
  validConfigureSchema,
  validExportAccountSchema,
  validGenerateTransactionPayloadSchema,
  validGetBlockSchema,
  validSendSchema,
  validSignPayloadJSONSchema,
  validSignPayloadRawSchema
} from './util/validation';
import { exportAccount } from './rpc/exportAccount';
import { getConfiguration } from './configuration';
import {
  discordIco,
  docsIco,
  facebookIco,
  instagramIco,
  invisibleIco,
  redditIco,
  sendIco,
  supportIco,
  telegramIco,
  twitterIco,
  websiteIco
} from './ui/images';
import { redirectDialog } from './redirectDialog';
import { welcomeScreen } from './welcomeScreen';
import { setConfiguration } from "@enjin/metamask-enjin-adapter/build/methods";
import getPrice from "./getPrices";

const apiDependentMethods = [
  'getBlock',
  'getBalances',
  'getChainHead',
  'signPayloadJSON',
  'signPayloadRaw',
  'generateTransactionPayload',
  'send'
];

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' }
  });

  if (!state) {
    // initialize state if empty and set default config
    await snap.request({
      method: 'snap_manageState',
      params: { newState: EmptyMetamaskState(), operation: 'update' }
    });
  }
  // fetch api promise
  let api: ApiPromise = null;
  if (apiDependentMethods.includes(request.method)) {
    api = await getApi();
  }

  switch (request.method) {
    case 'signPayloadJSON':
      assert(request.params, validSignPayloadJSONSchema);
      return await signPayloadJSON(api, request.params.payload);
    case 'signPayloadRaw':
      assert(request.params, validSignPayloadRawSchema);
      return await signPayloadRaw(api, request.params.payload);
    case 'getPublicKey':
      return await getPublicKey();
    case 'getAddress':
      return await getAddress();
    case 'exportSeed':
      return await exportSeed();
    case 'exportAccount':
      assert(request.params, validExportAccountSchema);
      return await exportAccount(request.params.jsonPassphrase);
    case 'getAllTransactions':
      return await getTransactions();
    case 'getBlock':
      assert(request.params, validGetBlockSchema);
      return await getBlock(request.params.blockTag, api);
    case 'getBalances': {
      return await getBalances(api);
    }
    case 'getConfiguration':
      return await getConfiguration();
    case 'configure': {
      const state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' }
      })) as MetamaskState;

      const isInitialConfiguration = state.config === null;
      // reset api and remove asset only if already configured
      if (!isInitialConfiguration) {
        await resetApi();
      }
      // set new configuration
      assert(
        request.params,
        validConfigureSchema,
        'Invalid configuration schema - Network name should be provided'
      );
      console.info('Configuring snap with', request.params.configuration);
      return await configure(
        request.params.configuration.networkName,
        request.params.configuration
      );
    }
    case 'generateTransactionPayload':
      assert(request.params, validGenerateTransactionPayloadSchema);
      return await generateTransactionPayload(api, request.params.to, request.params.amount);

    case 'send':
      assert(request.params, validSendSchema);
      return await send(
        api,
        request.params.signature as Uint8Array | `0x${string}`,
        request.params.txPayload
      );
    case 'getChainHead':
      return api && (await api.rpc.chain.getFinalizedHead()).hash;

    default:
      throw new Error('Method not found.');
  }
};

/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  const address = await getAddress();

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: welcomeScreen(address)
    }
  });
};

/**
 * Handle incoming home page requests from the MetaMask clients.
 *
 * @returns A static panel rendered with custom UI.
 */
export const onHomePage: OnHomePageHandler = async () => {
  const address = await getAddress();
  const api = await getApi();
  const balances = await getBalances(api, address);
  const price: string = await getPrice();
  console.log(balances);
  console.log(price);

  return {
    content: homePage(address, balances, price)
  };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (
    event.type === UserInputEventType.ButtonClickEvent ||
    event.type === UserInputEventType.InputChangeEvent
  ) {
    switch (event.name) {
      case 'switchNetwork': {
        console.log(event);
        const { value } = event as InputChangeEvent;
        await resetApi();
        await configure(value as string, {});
        const address = await getAddress();
        const api = await getApi();
        const balances = await getBalances(api, address);
        const price: string = await getPrice();
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: homePage(address, balances, price)
          }
        });

        break;
      }
      case 'send':
        await redirectDialog(id, 'send');
        break;
      case 'docs':
        await redirectDialog(id, 'docs');
        break;
      case 'website':
        await redirectDialog(id, 'website');
        break;
      case 'support':
        await redirectDialog(id, 'support');
        break;
      case 'back': {
        const address = await getAddress();
        const api = await getApi();
        const balances = await getBalances(api, address);
        const price: string = await getPrice();
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: homePage(address, balances, price)
          }
        });
        break;
      }
      default:
        break;
    }
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const homePage = (address: string, balances: { reserved: string; free: string }, usd: string) => {
  const free = new BN(balances.free);
  const reserved = new BN(balances.reserved);
  const decimals = new BN('1000000000000000000');
  const price = Number(usd);

  const freeBalance = free.div(decimals).toNumber().toFixed(2);
  const freeUsd = (free.div(decimals).toNumber() * price).toFixed(2);
  const reservedBalance = reserved.div(decimals).toNumber().toFixed(2);
  const reservedUsd = (reserved.div(decimals).toNumber() * price).toFixed(2);
  const totalBalance = free.add(reserved).div(decimals).toNumber().toFixed(2);
  const totalUsd = (free.add(reserved).div(decimals).toNumber() * price).toFixed(2);

  return (
    <Box>
      <Section>
        <Box direction="horizontal" alignment="start">
          <Icon name="wallet" size="md" />
          <Heading>Address</Heading>
        </Box>
        <Dropdown name="switchNetwork">
          <Option value="enjin-relaychain">Enjin Relaychain</Option>
          <Option value="enjin-matrixchain">Enjin Matrixchain</Option>
          <Option value="canary-relaychain">Canary Relaychain</Option>
          <Option value="canary-matrixchain">Canary Relaychain</Option>
        </Dropdown>
        <Copyable value={address} />
      </Section>
      <Section>
        <Box direction="horizontal" alignment="start">
          <Icon name="coin" size="md" />
          <Heading>Balance</Heading>
        </Box>
        <Row label="Total">
          <Value value={totalBalance + ' ENJ'} extra={'$' + totalUsd} />
        </Row>
        <Row label="Transferable">
          <Value value={freeBalance + ' ENJ'} extra={'$' + freeUsd} />
        </Row>
        <Row label="Reserved">
          <Value value={reservedBalance + ' ENJ'} extra={'$' + reservedUsd} />
        </Row>
      </Section>
      <Box direction="horizontal" alignment="space-around">
        <Box direction="vertical" alignment="center">
          <Button name="send" variant="primary">
            <Image src={sendIco} />
          </Button>
          <Text alignment="center">Send</Text>
        </Box>
        <Box direction="vertical" alignment="center">
          <Button name="docs" variant="primary">
            <Image src={docsIco} />
          </Button>
          <Text alignment="center">Docs</Text>
        </Box>
        <Box direction="vertical" alignment="center">
          <Button name="website" variant="primary">
            <Image src={websiteIco} />
          </Button>
          <Text alignment="center">Website</Text>
        </Box>
        <Box direction="vertical" alignment="center">
          <Button name="support" variant="primary">
            <Image src={supportIco} />
          </Button>
          <Text alignment="center">Support</Text>
        </Box>
      </Box>
      <Text alignment="center">Join Our Community</Text>
      <Box direction="horizontal" alignment="space-around">
        <Image src={invisibleIco} />
        <Button name="twitter" variant="primary">
          <Image src={twitterIco} />
        </Button>
        <Button name="discord" variant="primary">
          <Image src={discordIco} />
        </Button>
        <Button name="telegram" variant="primary">
          <Image src={telegramIco} />
        </Button>
        <Button name="facebook" variant="primary">
          <Image src={facebookIco} />
        </Button>
        <Button name="reddit" variant="primary">
          <Image src={redditIco} />
        </Button>
        <Button name="instagram" variant="primary">
          <Image src={instagramIco} />
        </Button>
        <Image src={invisibleIco} />
      </Box>
    </Box>
  );
};
