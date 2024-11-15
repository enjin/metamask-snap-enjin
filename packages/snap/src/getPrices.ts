// import { updateSnapState } from "./rpc/stateManagement";

export default async function getPrice(): Promise<string> {
    try {
      const request = await getReq(`https://api.coingecko.com/api/v3/simple/price?ids=enjincoin&vs_currencies=usd&include_24hr_change=true`);
      // await updateSnapState('priceInfo', price).catch(console.error);

      return request['enjincoin']['usd'];
    } catch{
      console.log('Something went wrong while getting prices! Try again later.')
    }

    return '0';
}

async function getReq(api: string): Promise<Record<string, any>> {
  const response = await fetch(api, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
