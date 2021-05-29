import db from '/database/models/index';
import * as utils from '../util/utils';

const Snapshot = db.snapshot;

module.exports = {
  save(snapshot) {
    const time = new Date().toISOString();
    const date = utils.formatDate(time);

    return Snapshot.create({
      ...snapshot,
      time: date,
    }).catch(error => console.log(error));
  },
  findAll(query){
    return Snapshot.findAll({
      where: query,
    })
  }
  // find(userAddress) {
  //   return User.findOne({
  //     where: {address: userAddress},
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // },
  // const snapshots = await Snapshot.findAll({
  //   where: {userId: 1},
  // });
};