const apiHost = 'https://api.covalenthq.com/v1';
const auth = '?key=ckey_b909ff47c8d540aba710e3e0b7c';

//get wallet balance for all tokens
export async function fetchWalletTokens(account, chainId) {
  const getWalletBalanceCall = `${apiHost}/${chainId}/address/${account}/balances_v2/${auth}`;

  return await fetch(getWalletBalanceCall).then(res => res.json());
}

