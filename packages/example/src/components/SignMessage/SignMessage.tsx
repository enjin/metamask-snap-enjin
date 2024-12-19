import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import { stringToHex } from '@polkadot/util/string';
import { Alert } from '@material-ui/lab';
import { MetaMaskContext } from '../../context/metamask';

interface Props {
  address: string;
}

type AlertSeverity = 'success' | 'warning' | 'info' | 'error';

export const SignMessage: React.FC<Props> = ({ address }) => {
  const [state] = useContext(MetaMaskContext);

  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [modalBody, setModalBody] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('success' as AlertSeverity);
  const [message, setMessage] = useState('');
  const [polkascanUrl, setPolkascanUrl] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTextFieldValue(event.target.value);
  };

  const showAlert = (severity: AlertSeverity, message: string, polkasacanUrl?: string): void => {
    setPolkascanUrl(polkasacanUrl ? polkasacanUrl : '');
    setSeverity(severity);
    setMessage(message);
    setAlert(true);
  };

  const onSubmit = async (): Promise<void> => {
    if (!state.polkadotSnap.snap) return;

    try {
      if (textFieldValue) {
        const api = state.polkadotSnap.snap.getMetamaskSnapApi();
        if (api && api.signPayloadRaw) {
          const messageAsHex = stringToHex(textFieldValue);

          const messageSignResponse = await api.signPayloadRaw({
            address: address,
            data: messageAsHex,
            type: 'bytes'
          });
          setTextFieldValue('');
          setModalBody(messageSignResponse);
          setModalOpen(true);
        }
      }
    } catch (e) {
      showAlert('error', 'There was an error while processing the transaction.');
    }
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title="Sign custom message" />
      <CardContent>
        <Grid container>
          <TextField
            onChange={handleChange}
            value={textFieldValue}
            size="medium"
            fullWidth
            id="recipient"
            label="Message"
            variant="outlined"
          />
        </Grid>
        <Box style={{ margin: '0.5rem' }} />
        <Grid container justifyContent="flex-end">
          <Button
            style={{ marginTop: '0.5rem' }}
            onClick={onSubmit}
            color="secondary"
            variant="contained"
            size="large"
          >
            Sign
          </Button>
        </Grid>
      </CardContent>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Message signature'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is signature of your message:
            <br />
            <Typography style={{ wordWrap: 'break-word' }}>{modalBody}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={() => setAlert(false)}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
      >
        <Alert severity={severity} onClose={() => setAlert(false)}>
          {`${message} `}
          {polkascanUrl === '' && <a href={polkascanUrl}>See details</a>}
        </Alert>
      </Snackbar>
    </Card>
  );
};
