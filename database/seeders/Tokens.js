//Providers list to feed in DB

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tokens', [
      {
        name: 'WBNB',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'PANTHER',
        address: '0x1f546ad641b56b86fd9dceac473d1c7a357276b7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ZOMBIE',
        address: '0x99d6b719D78f75A0A8f34d7443630dF58973fF41',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MUMMY',
        address: '0x6238BCe7aae6a693e4463e5AC6b5b3227E104E0B',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tokens', null, {});
  },
};

// name: DataTypes.STRING,
// address: { type: DataTypes.STRING, unique: true },
// type: {type: DataTypes.STRING, default: "BEP20"}, //BEP20 etc
// isLp: DataTypes.BOOLEAN