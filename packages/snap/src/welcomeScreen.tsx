// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Copyable, Box, Heading, Divider, Text, Bold } from '@metamask/snaps-sdk/jsx';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const welcomeScreen = () => {
  return (
    <Box>
      <Heading>🥳 Your Enjin Account is Ready! 👾</Heading>
      <Text>Your account address:</Text>
      <Copyable value="en14snRzuoneign3keoddksliniu45j5kglrkot3p4m5mltrj922k" />
      <Divider />
      <Text>Effortlessly access dApps right from the Enjin Connect screen.</Text>
      <Text>
        To begin, open MetaMask, navigate to <Bold>Menu → Snaps</Bold>, and select{' '}
        <Bold>Enjin Connect</Bold>.
      </Text>
    </Box>
  );
};
