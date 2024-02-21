"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Subscription);
      User.belongsToMany(models.Course, {
        through: models.Subscription,
        foreignKey: "CourseId",
      });
      User.hasOne
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
