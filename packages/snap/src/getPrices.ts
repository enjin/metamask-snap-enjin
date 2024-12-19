export default async function getPrice(): Promise<string> {
  try {
    const response = await getReq(
      `https://api.coingecko.com/api/v3/simple/price?ids=enjincoin&vs_currencies=usd&include_24hr_change=true`
    );
    if (!response['enjincoin']) {
      throw new Error('Invalid response');
    }

    return response['enjincoin']['usd'];
  } catch {
    console.log('Something went wrong while getting prices! Try again later.');
  }

  return '0';
}

async function getReq(api: string): Promise<{
  enjincoin: { usd: string };
}> {
  const response = await fetch(api, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return (await response.json()) as { enjincoin: { usd: string } };
}
