import {
  Address,
  Box,
  Copyable,
  Divider,
  Heading,
  Row,
  Section,
  Text
} from '@metamask/snaps-sdk/jsx';
import { panel, text } from '@metamask/snaps-ui';

type RawDialogContent = {
  prompt: string;
  address: `${string}:${string}:${string}`;
  textAreaContent?: string;
};

type JSONDialogContent = {
  prompt: string;
  address: `${string}:${string}:${string}`;
  info: { message: string; value: string | Record<string, string> }[];
};

type ConfirmationDialogContent = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export async function showConfirmationDialog(message: ConfirmationDialogContent): Promise<boolean> {
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      content: panel([
        text(message.prompt || 'Are you sure?'),
        text(message.description || ''),
        text(message.textAreaContent || '')
      ]),
      type: 'confirmation'
    }
  })) as boolean;
}

export async function showRawPayloadDialog(message: RawDialogContent): Promise<boolean> {
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      content: (
        <Box>
          <Text>{message.prompt}</Text>
          <Divider />

          <Row label="Address">
            <Address address={message.address} />
          </Row>

          <Copyable value={message.textAreaContent}></Copyable>
        </Box>
      ),
      type: 'confirmation'
    }
  })) as boolean;
}

export async function showJSONPayloadDialog(message: JSONDialogContent): Promise<boolean> {
  console.log('message', message);
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      content: (
        <Box>
          <Text>{message.prompt}</Text>
          <Divider />
          <Row label="Address">
            <Address address={message.address} />
          </Row>
          {message.info.map((info) => {
            return typeof info.value === 'object' ? (
              <Section>
                <Heading>{info.message}</Heading>
                <Divider />
                {Object.entries(info.value).map(([key, value]) => (
                  <Box alignment="start" direction="vertical">
                    <Text>{key}</Text>
                    <Text>{value}</Text>
                  </Box>
                ))}
              </Section>
            ) : (
              <Row label={info.message}>
                <Text>{info.value}</Text>
              </Row>
            );
          })}
        </Box>
      ),
      type: 'confirmation'
    }
  })) as boolean;
}
