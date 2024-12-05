import {
  Address,
  Box,
  Copyable,
  Divider,
  Heading,
  Italic,
  Row,
  Section,
  Text
} from '@metamask/snaps-sdk/jsx';
import { flatten } from 'flat';

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
      content: (
        <Box>
          <Text>{message.prompt || 'Are you sure?'}</Text>
          <Divider />
          <Text>{message.description}</Text>
          <Copyable value={message.textAreaContent}></Copyable>
        </Box>
      ),
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
          {message.info
            .filter((m) => m.value)
            .map((info) => {
              return typeof info.value === 'object' ? (
                <Section>
                  <Heading>{info.message}</Heading>
                  <Divider />
                  {Object.entries(flatten(info.value))
                    .filter(([k, v]) => typeof k === 'string' && typeof v === 'string')
                    .map(([key, value]) => (
                      <Box alignment="start" direction="vertical">
                        <Text>
                          <Italic>{key}</Italic>
                        </Text>
                        <Text>{value as string}</Text>
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
