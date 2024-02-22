"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Subscription);
      Course.belongsToMany(models.User, {
        through: models.Subscription,
        foreignKey: "UserId",
      });
    }
  }
  Course.init(
    {
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      urlVideo: DataTypes.TEXT,
      statusActive: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
