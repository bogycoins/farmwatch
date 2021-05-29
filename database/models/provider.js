'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.masterContract, { onDelete: 'cascade' });
    }
  };
  Provider.init({
    name: { type: DataTypes.STRING, unique: true },
    website: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'provider',
  });
  return Provider;
};