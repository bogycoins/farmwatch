import {ethers} from 'ethers';
import * as ethcall from 'ethcall';
import db from '../../database/models/index'
import {fetchWalletTokens} from '/pages/api/external/covalenthq'


//TODO: citeste date din wallet si le salveaza in db

//adresa de wallet; trebuie folosit metamask pt sign
const wallet = '0x8330D58cC6458a1579F11f68E466829f1d19c78c';
const chainId = 56;

async function writeDb(data){
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

function relevantData(wallet) {
  const tokensList = wallet.data.items;
  const list = [];
  const tokens = {};

  tokensList.forEach((token) => {
    tokens[token.contract_ticker_symbol] = {
      'balance': token.balance / 10 ** token.contract_decimals, //current tokens
      'value': token.quote, // value in usd for all tokens
      'price': token.quote_rate, //price for 1 token
    };
  });

  return tokens;
}
export default async (req, res) => {

  const text = await fetchWalletTokens(wallet, chainId);
  const parsed = relevantData(text);

  res.status(200).json(parsed);

  //inregistreaza in db
  writeDb(parsed);
}

