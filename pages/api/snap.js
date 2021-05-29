import {buildFarmsSnapshot} from '/pages/api/user/investments';
import {createWalletSnapshot} from '/pages/api/user/wallet';
import * as userCtrl from '/pages/api/controllers/users'
import * as snapshotCtrl from '/pages/api/controllers/snapshot'

//TODO: citeste date din wallet si le salveaza in db

//adresa de wallet; trebuie folosit metamask pt sign
const userAddress = '0x8330D58cC6458a1579F11f68E466829f1d19c78c';
const chainId = 56;

async function showToken() {
  const snapshots = await snapshotCtrl.findAll({userId: 1})

  const list = [];
  if (snapshots) {
    snapshots.forEach(entry => {
      const row = entry.getDataValue('wallet');
      const coin = row['BNB'];
      console.log('BNB: ', coin);
      list.push(coin);
    });
  }
  return list;
}

export default async (req, res) => {

  //make sure db is working
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const user = await userCtrl.find(userAddress)
  if(user.name){
    const walletSnapshot = await createWalletSnapshot(userAddress, chainId);
    const farmsSnapshot = await buildFarmsSnapshot(userAddress);

    const snapshot = {
      userId: user.id,
      wallet: walletSnapshot,
      investments: farmsSnapshot,
    };

    //salveaza un snapshot
    await snapshotCtrl.save(snapshot);
  }

  //afiseaza evolutia la un token
  const toshow = await showToken();

  res.status(200).json(toshow);
}

