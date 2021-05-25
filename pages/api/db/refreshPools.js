//Load pools for defined master contracts

import {ethers} from 'ethers';
import * as ethcall from 'ethcall';
import db from '../../database/models/index';

const Provider = db.Provider;
const MasterContract = db.MasterContract;
const Pool = db.Pool;
const Token = db.Token;

const ChainProvider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed2.binance.org');

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
    const chefContract = new ethers.Contract(contract.address, contract.abi,
        ChainProvider);
    const poolCount = parseInt(await chefContract.poolLength(), 10);
    console.log(contract.name, poolCount);

    //read all pools info
    const poolInfos = await Promise.all([...Array(poolCount).keys()].map((poolIndex) => chefContract.poolInfo(poolIndex)));

    for (let id = 0; id < poolInfos.length; id++) {
      const pool = poolInfos[id];
      const allocPoints = pool.allocPoint ?? 1;

      //do we have the token in the DB?
      const token = tokens.find(
          token => token.address.toLowerCase() === pool.lpToken.toLowerCase());

      if (token) {
        try {
          //create/update pools in DB
          Pool.upsert({
            poolId: id,
            poolToken: token.name,  //db query
            poolTokenAddress: pool.lpToken,
            allocPoints: allocPoints.toNumber(),
            MasterContractId: contract.id,
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        console.log(
            `Token ${pool.lpToken} not registered in pool ${id} from contract ${contract.name}`);
      }
    }
  }

}

export default async (req, res) => {

  await loadContracts();

  res.status(200).json('done');

}