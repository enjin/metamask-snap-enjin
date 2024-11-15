// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Copyable, Box, Heading, Divider, Text, Bold } from '@metamask/snaps-sdk/jsx';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const welcomeScreen = (address: string) => {
  return (
    <Box>
      <Heading>🥳 Your Enjin Account is Ready! 👾</Heading>
      <Text>Your account address:</Text>
      <Copyable value={address} />
      <Divider />
      <Text>Effortlessly access dApps right from the Enjin Connect screen.</Text>
      <Text>
        To begin, open MetaMask, navigate to <Bold>Menu → Snaps</Bold>, and select{' '}
        <Bold>Enjin Connect</Bold>.
      </Text>
    </Box>
  );
};
