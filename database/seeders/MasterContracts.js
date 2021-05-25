'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //token:string,address:string,emissionRate:integer,totalAllocPoints:integer
    return queryInterface.bulkInsert('MasterContracts', [
      {
        name: 'PantherSwap Master Chef',
        token: 'PANTHER',
        pendingTokenMethod: 'pendingPanther',
        address: '0x058451C62B96c594aD984370eDA8B6FD7197bbd4',
        emissionRate: 75,
        totalAllocPoints: 11550,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProviderId: 1,
        type: 'multipool'
      },
      {
        name: 'Zombie Farm - Zombie Master Chef',
        token: 'ZOMBIE',
        pendingTokenMethod: 'pendingZombie',
        address: '0x5DCC4648d7029C7055fcF25bED6CfFc99E23727E',
        emissionRate: 0.7,
        totalAllocPoints: 3150,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProviderId: 2,
        type: 'multipool'
      },{
        name: 'Zombie Farm - Mummy Master Chef',
        token: 'MUMMY',
        pendingTokenMethod: 'pendingMummy',
        address: '0xcd4995A7C784D74929102e54F8F9c2a6b13f406F',
        emissionRate: 1.1,
        totalAllocPoints: 4300,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProviderId: 2,
        type: 'multipool'
      },

      // name: DataTypes.STRING,
      //   token: DataTypes.STRING,
      //   pendingTokenMethod: DataTypes.STRING,
      //   address: DataTypes.STRING,
      //   emissionRate: DataTypes.INTEGER,
      //   totalAllocPoints: DataTypes.INTEGER
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('MasterChefs', null, {});
     */
  },
};
