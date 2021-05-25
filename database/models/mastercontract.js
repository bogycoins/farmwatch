'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterContract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Provider);
      this.hasMany(models.Pool, { onDelete: 'cascade' })
    }
  };
  MasterContract.init({
    name: DataTypes.STRING,
    token: DataTypes.STRING,
    pendingTokenMethod: DataTypes.STRING,
    address: DataTypes.STRING,
    emissionRate: DataTypes.DOUBLE,
    totalAllocPoints: DataTypes.INTEGER,
    type: DataTypes.STRING, //multipool - pancakeSwap forks, vault - pancakebunny?
    abi: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'MasterContract',
  });
  return MasterContract;
};