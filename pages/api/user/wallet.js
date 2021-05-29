import {fetchWalletTokens} from '../external/covalenthq';

export async function createWalletSnapshot(userAddress, chainId) {
  const tokens = {};
  const walletTokens = await fetchWalletTokens(userAddress, chainId);
  const tokensList = walletTokens.data.items;

  tokensList.forEach((token) => {
    tokens[token.contract_ticker_symbol] = {
      'balance': token.balance / 10 ** token.contract_decimals, //current tokens
      'value': token.quote, // value in usd for all tokens
      //TODO: daca nu are pret, citeste-l din token prices (oracle?)
      'price': token.quote_rate, //price for 1 token
    };
  });

  return tokens;
}
