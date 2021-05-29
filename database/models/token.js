'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Token);
      // this.hasMany(models.Pool);
    }
  };
  Token.init({
    symbol: DataTypes.STRING,
    address: {type: DataTypes.STRING, unique: true},
    isLP: {type: DataTypes.BOOLEAN, defaultValue: false},
    name: DataTypes.STRING,
    type: {type: DataTypes.STRING, defaultValue: 'BEP20'}, //BEP20 etc
    decimals: {type: DataTypes.INTEGER, defaultValue: 18},
    totalSupply:{type: DataTypes.DOUBLE},
  }, {
    sequelize,
    modelName: 'token',
  });
  return Token;
}

/*
TOKEN INFO:
- address*
- decimals*
- name*
- symbol
- tokens (for LP) - hasMany
- totalSupply*
- staked (?)
 */