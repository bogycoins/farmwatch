'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Snapshot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user);
    }
  };
  Snapshot.init({
    time: DataTypes.TIME,
    wallet: DataTypes.JSON,
    investments: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'snapshot',
  });
  return Snapshot;
};