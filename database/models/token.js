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
    }
  };
  Token.init({
    name: DataTypes.STRING,
    address: {type: DataTypes.STRING, unique: true},
    type: {type: DataTypes.STRING, defaultValue: 'BEP20'}, //BEP20 etc
    isLp: {type: DataTypes.BOOLEAN, defaultValue: false},
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};