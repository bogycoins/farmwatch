import db from '../../../database/models/index';
import {ethers} from 'ethers';

const Provider = db.Provider;

//TODO: ia informatiile necesare de la ferma si salveaza in snapshot
/*
- have a list with providers/farms
- have a list with tokens

- pentru fiecare provider (enabled) is contractele
- pentru fiecare contract - query DB.MasterContract
 - pentru fiecare pool/ferma din masterContract - query DB.Pools from provider
  - call userInfo
    - daca are info - store info
        - call pendingPanther - store info

snapshot model
{
           "farmInfo": "info despre ferma, APR, etc",
           "deposit": {
             "amount": 10,
             "token": "PANTHER"
           },
           "pending": {
             "token": "PANTHER",
             "amount": 0.3
           }
         }

 */

const userAddress = '0x8330D58cC6458a1579F11f68E466829f1d19c78c';
const ChainProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed2.binance.org');

async function getInfo(userAddress) {
  let activeFarms = [];

  const providers = await Provider.findAll(); //filter enabled providers

  for (const provider of providers) {
    const contracts = await provider.getMasterContracts();

    for (const contract of contracts) {
      const chefContract = new ethers.Contract(contract.address, contract.abi, ChainProvider);
      const pools = await contract.getPools();

      for (const pool of pools) {
        let userInfo = await chefContract.userInfo(pool.poolId, userAddress);
        const deposit = ethers.utils.formatEther(userInfo.amount);

        if (deposit > 0) {
          const pendingRewardTokens = await chefContract.callStatic[contract.pendingTokenMethod](pool.poolId, userAddress);
          let snapshot = {
            contract: contract.name,
            farmInfo: 'info despre ferma, APR, etc', //le avem salvate deja - facem query in DB poate
            deposit: {
              amount: deposit,
              token: pool.poolToken,
            },
            pending: {
              amount: ethers.utils.formatEther(pendingRewardTokens),
              token: contract.token,
            },
          };
          activeFarms.push(snapshot)
          console.log(snapshot);
        }
      }
    }
  }
  return activeFarms;
}

export default async (req, res) => {

  let data = await getInfo(userAddress);
  console.log(data);
  res.status(200).json(data);

  // console.log(req.body)
  // Recieved params from request
}