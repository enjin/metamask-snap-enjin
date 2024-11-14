import {
  Bold,
  Box,
  Button,
  Container,
  Footer,
  Heading,
  Icon,
  Link,
  Section,
  Text
} from '@metamask/snaps-sdk/jsx';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function redirectDialog(id: string, dialog: string) {
  let icon, title, text, link;

  switch (dialog) {
    case 'send': {
      icon = 'arrow-2-up';
      title = 'Send ENJ';
      text = (
        <Text alignment="start">
          Send your funds and NFTs, stake tokens, participate in governance, and access more
          features thorugh the <Bold>Enjin Blockchain Console</Bold>.
        </Text>
      );
      link = 'console.enjin.io';
      break;
    }
    case 'docs': {
      icon = 'document-code';
      title = 'Enjin Docs';
      text = (
        <Text alignment="start">
          'Explore Enjin's <Bold>documentation</Bold> to learn how to integrate the Enjin Blockchain
          seemlessly in just two hours.
        </Text>
      );
      link = 'docs.enjin.io';
      break;
    }
    case 'website': {
      icon = 'global';
      title = 'Website';
      text = (
        <Text alignment="start">
          Discover Enjin's latest products, updates, and ecosystem information on our{' '}
          <Bold>official website</Bold>.
        </Text>
      );
      link = 'enjin.io';
      break;
    }
    default: {
      icon = 'user';
      title = 'Support';
      text = (
        <Text alignment="start">
          Need assistance? <Bold>Enjin Support</Bold> is here to help with all your questions and
          troubleshooting needs.
        </Text>
      );
      link = 'support.enjin.io';
      break;
    }
  }

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Container>
          <Box direction="vertical" alignment="start">
            <Section>
              <Box direction="horizontal" alignment="start">
                <Icon name={icon} size="md" />
                <Heading>{title}</Heading>
              </Box>
              {text}
              <Box alignment="start" direction="horizontal">
                <Text alignment="start">Visit:</Text>
                <Link href={'https://' + link}>{link}</Link>
              </Box>
            </Section>
          </Box>
          <Footer>
            <Button name="back" variant="destructive">
              Back
            </Button>
          </Footer>
        </Container>
      )
    }
  });
}
