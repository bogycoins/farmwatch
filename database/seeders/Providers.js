//Providers list to feed in DB

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('providers', [
      {
        name: 'PantherSwap',
        website: 'https://pantherswap.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        name: 'ZombieFarm',
        website: 'https://zombie-farm.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('providers', null, {});
  },
};