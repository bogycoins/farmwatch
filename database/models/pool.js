'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.masterContract);
      // this.hasMany(models.Token);
    }
  };
  Pool.init({
    poolId: DataTypes.INTEGER,
    poolToken: DataTypes.STRING, //token name
    poolTokenAddress: DataTypes.STRING,
    allocPoints: DataTypes.INTEGER,
    // accTokenPerShare: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'pool',
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['poolId', 'masterContractId']
      }]
  });
  return Pool;
};