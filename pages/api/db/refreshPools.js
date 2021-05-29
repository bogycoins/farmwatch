//Load pools for defined master contracts

import {ethers} from 'ethers';
import * as ethcall from 'ethcall';

import db from '../../../database/models/index';
import {getBscToken} from '../util/token_helper';

const Provider = db.provider;
const MasterContract = db.masterContract;
const Pool = db.pool;
const Token = db.token;

const ChainProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org');

async function loadContracts() {
  const providers = await Provider.findAll();
  const masterContracts = await MasterContract.findAll();
  const tokens = await Token.findAll();
  const pools = [];

  //get pools for each contract
  for (let i = 0; i < masterContracts.length; i++) {
    const contract = masterContracts[i];
    const address = contract.address;

    //get master contract and check pool count
    const chefContract = new ethers.Contract(contract.address, contract.abi, ChainProvider);
    const poolCount = parseInt(await chefContract.poolLength(), 10);
    console.log(contract.name, poolCount);

    //read all pools info
    const poolInfos = await Promise.all(
        [...Array(poolCount).keys()].map((poolIndex) => chefContract.poolInfo(poolIndex)));

    for (let id = 0; id < poolInfos.length; id++) {
      const pool = poolInfos[id];
      const allocPoints = pool.allocPoint ?? 1;

      let token = tokens.find(token => token.address.toLowerCase() === pool.lpToken.toLowerCase());

      //we don't have the token in DB
      if (!token || (token && !token.symbol)) {
        //get token and save it in DB
        const unknownToken = await getBscToken(ChainProvider, pool.lpToken);
        console.log('Identified token:', unknownToken.name, unknownToken.symbol);

        //create/update token in DB
        try {
          token = await Token.upsert(unknownToken);
        } catch (e) {
          console.log(e);
        }
      }

      try {
        //create/update pools in DB
        Pool.upsert({
          poolId: id,
          poolToken: token.symbol,  //db query
          poolTokenAddress: token.address,
          allocPoints: allocPoints.toNumber(),
          masterContractId: contract.id,
        });
      } catch (e) {
        // const unknownToken = await getBscToken(ChainProvider, token.address)
        console.error(e);
      }
    }
  }

}

export default async (req, res) => {

  await loadContracts();

  res.status(200).json('done');

}