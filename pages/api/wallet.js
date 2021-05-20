import {ethers} from 'ethers';
import * as ethcall from 'ethcall';
import db from '../../database/models/index'
import {fetchWalletTokens} from '/pages/api/external/covalenthq'


//TODO: citeste date din wallet si le salveaza in db

//adresa de wallet; trebuie folosit metamask pt sign
const wallet = '0x8330D58cC6458a1579F11f68E466829f1d19c78c';
const chainId = 56;

const User = db.User;
const Snapshot = db.Snapshot;

async function createUser(data){
  try {
    // Check if user with that email if already exists
    const name = "bogdan";
    const email = "bogycoins@gmail.com";

    const user = await User.findOne({
      where: { address: wallet }
    })
    if(user){
      // return res.status(422).send(`User already exist with that ${email}`)
    }
    const newUser = await User.create({
      name,
      email,
      address: wallet
    })
    console.log(newUser)
  } catch (error) {
    console.error(error)
  }
}

async function saveSnapshot(data) {
  const user = "bogdan";

  try {
    const time = new Date().toISOString();

    let date = formatDate(time);
    const newSnapshot = await Snapshot.create({
      time: date,
      user,
      wallet: data
    })
    // console.log(newSnapshot)
  } catch (error) {
    console.error(error)
  }
}

async function showToken(){
  const token = "BNB";
  const user = "bogdan";

  const snapshots = await Snapshot.findAll({
    where: { user }
  });

  const list = [];
  if (snapshots){
    snapshots.forEach(entry => {
      const row = entry.getDataValue('wallet');
      const coin = row['BNB'];
      console.log("BNB: ", coin)
      list.push(coin);
    })
  }
  return list;
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

  //make sure db is working
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  //inregistreaza user in db
  createUser();

  //salveaza un snapshot
  saveSnapshot(parsed);

  //afiseaza evolutia la un token
   const toshow = await showToken();

  // res.status(200).json(parsed);
  res.status(200).json(toshow);
}

function formatDate(s) {
  let b = s.split(/\D/);
  return b[0] + '-' + b[1] + '-' + b[2] + ' ' +
      b[3] + ':' + b[4] + ':' + b[5] + '.' +
      b[6].substr(0,3);// + '+00:00';
}