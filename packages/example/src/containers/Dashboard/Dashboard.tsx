import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import type {
  BlockInfo,
  SnapNetworks,
  Transaction,
  SupportedSnapNetworks
} from '@enjin/metamask-enjin-types';
import type { MetamaskSnapApi } from '@enjin/metamask-enjin-adapter/src/types';
import { BN } from '@polkadot/util';
import { Transfer } from '../../components/Transfer/Transfer';
import { SignMessage } from '../../components/SignMessage/SignMessage';
import { TransactionTable } from '../../components/TransactionTable/TransactionTable';
import { Account } from '../../components/Account/Account';
import { MetaMaskConnector } from '../MetaMaskConnector/MetaMaskConnector';
import { MetaMaskContext } from '../../context/metamask';
import { LatestBlock } from '../../components/LatestBlock/LatestBlock';
import type { CustomNetworkConfigInput } from '../../components/CustomNetworkConfig/CustomNetworkConfig';
import { CustonNetworkConfig } from '../../components/CustomNetworkConfig/CustomNetworkConfig';

export const Dashboard = (): React.JSX.Element => {
  const [state] = useContext(MetaMaskContext);
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [latestBlock, setLatestBlock] = useState<BlockInfo>({
    hash: '',
    number: ''
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [network, setNetwork] = useState<SnapNetworks>('enjin-relaychain');
  const [api, setApi] = useState<MetamaskSnapApi | null>(null);
  const [customNetworkInputs, setCustomNetworkInputs] = useState(false);

  const showCustomNetworkName = ![
    'enjin-relaychain',
    'enjin-matrixchain',
    'canary-relaychain',
    'canary-matrixchain',
    'custom'
  ].includes(network);

  const handleNewTransaction = useCallback(async () => {
    if (!api) return;
    setTransactions(await api.getAllTransactions());
  }, [setTransactions]);

  const handleNetworkChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ): Promise<void> => {
    if (event.target.value === 'custom') {
      setCustomNetworkInputs(true);
      return;
    } else setCustomNetworkInputs(false);

    const networkName = event.target.value as SupportedSnapNetworks;
    if (networkName === network) return;
    if (!api) return;
    await api.setConfiguration({ networkName: networkName });
    setNetwork(networkName);
  };

  const onCustomNetworkConnect = async (submitData: CustomNetworkConfigInput): Promise<void> => {
    const { networkName, genesisHash, rpcUrl, addressPrefix } = submitData;

    if (!api || !networkName || !genesisHash || !rpcUrl || !addressPrefix) return;
    const configuration = {
      networkName,
      genesisHash,
      wsRpcUrl: rpcUrl,
      addressPrefix: addressPrefix,
      unit: {
        decimals: submitData.unitDecimals || 18,
        image: submitData.unitImage || '',
        symbol: submitData.unitSymbol || ''
      }
    };

    try {
      await api.setConfiguration(configuration);
      setNetwork(networkName);
    } catch (e) {
      console.log(e);
      console.log('revert to polkadot configuration');
      await api.setConfiguration({ networkName: 'enjin-relaychain' });
      setCustomNetworkInputs(false);
      setNetwork('enjin-relaychain');
    }
  };

  useEffect(() => {
    void (() => {
      if (state.polkadotSnap.isInstalled && state.polkadotSnap.snap) {
        const polkadotApi = state.polkadotSnap.snap.getMetamaskSnapApi();
        setApi(polkadotApi);
      }
    })();
  }, [state.polkadotSnap.isInstalled, state.polkadotSnap.snap]);

  useEffect(() => {
    void (async () => {
      if (api) {
        const balances = new BN((await api.getBalances()).free ?? '0');
        const decimals = new BN('1000000000000000000');

        setAddress(await api.getAddress());
        setPublicKey(await api.getPublicKey());
        setBalance(balances.div(decimals).toString());
        setLatestBlock(await api.getLatestBlock());
        setTransactions(await api.getAllTransactions());
      }
    })();
  }, [api, network]);

  useEffect(() => {
    // periodically check balance
    const interval = setInterval(async () => {
      if (api) {
        const balances = new BN((await api.getBalances()).free ?? '0');
        const decimals = new BN('1000000000000000000');

        setBalance(balances.div(decimals).toString());
      }
    }, 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, [api, balance, setBalance]);

  return (
    <Container maxWidth="lg">
      <Grid direction="column" alignItems="center" justifyContent="center" container spacing={3}>
        <Box style={{ margin: '2rem' }}>
          <Typography variant="h2">Enjin Wallet Snap Example dApp</Typography>
        </Box>
        {!state.polkadotSnap.isInstalled ? (
          <MetaMaskConnector />
        ) : (
          <>
            <Box
              style={{ margin: '1rem' }}
              alignSelf="flex-start"
              justifySelf={'flex-start'}
              alignContent={'flex-start'}
            >
              <InputLabel>Network</InputLabel>
              <Select
                value={network}
                defaultValue={'enjin-relaychain'}
                onChange={handleNetworkChange}
              >
                <MenuItem value={'enjin-relaychain'}>Enjin Relaychain</MenuItem>
                <MenuItem value={'enjin-matrixchain'}>Enjin Matrixchain</MenuItem>
                <MenuItem value={'canary-relaychain'}>Canary Relaychain</MenuItem>
                <MenuItem value={'canary-matrixchain'}>Canary Matrixchain</MenuItem>
                <MenuItem value={'custom'}>Custom</MenuItem>
                {showCustomNetworkName && <MenuItem value={network}>{network}</MenuItem>}
              </Select>
              {customNetworkInputs && <CustonNetworkConfig onSubmit={onCustomNetworkConnect} />}
            </Box>
            <Grid container spacing={3} alignItems={'stretch'}>
              <Grid item xs={12}>
                <LatestBlock block={latestBlock} />
              </Grid>
            </Grid>
            <Box style={{ margin: '1rem' }} />
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12}>
                <Account
                  network={network}
                  address={address}
                  balance={balance}
                  publicKey={publicKey}
                />
              </Grid>
            </Grid>
            <Box style={{ margin: '1rem' }} />
            <Grid container spacing={3} alignItems="stretch">
              <Grid item md={6} xs={12}>
                <Transfer network={network} onNewTransferCallback={handleNewTransaction} />
              </Grid>
              <Grid item md={6} xs={12}>
                <SignMessage address={address} />
              </Grid>
            </Grid>
            <Box style={{ margin: '1rem' }} />
            <Grid container spacing={3} alignItems={'stretch'}>
              <Grid item xs={12}>
                <Card style={{ margin: '1rem 0' }}>
                  <CardHeader title="Account transactions" />
                  <CardContent>
                    <TransactionTable txs={transactions} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};