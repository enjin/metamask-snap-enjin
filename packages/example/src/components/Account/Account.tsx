import React from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import { formatBalance } from '@polkadot/util/format/formatBalance';
import { getCurrency } from '../../services/format';

export interface AccountProps {
  address: string;
  publicKey: string;
  balance: string;
  network: string;
}

export const Account = (props: AccountProps): React.JSX.Element => {
  return (
    <Card style={{ margin: '1rem 0' }}>
      <CardHeader title="Account details" />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h6">ADDRESS:</Typography>
            <Typography variant="subtitle2">{props.address}</Typography>
            <Divider light />
            <Box style={{ margin: '0.5rem' }} />
            <Typography variant="h6">PUBLIC KEY:</Typography>
            <Typography variant="subtitle2">{props.publicKey}</Typography>
            <Divider light />
            <Box style={{ margin: '0.5rem' }} />
            <Typography variant="h6">ACCOUNT BALANCE:</Typography>
            <Typography variant="subtitle2">
              {formatBalance(props.balance, {
                decimals: 18,
                withSi: true,
                withUnit: getCurrency(props.network)
              })}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
