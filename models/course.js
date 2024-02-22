"use strict";
const { Model } = require("sequelize");
const { stringSlice } = require("../helper/formatter");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Subscription);
      Course.belongsToMany(models.User, {
        through: models.Subscription,
        foreignKey: "UserId",
      });
      Course.belongsTo(models.Category);
    }

    get toRupiah() {
      return this.price.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
      })
    }

  }
  Course.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      urlVideo: DataTypes.STRING,
      statusActive: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
      hooks: {
        beforeCreate: (course) => {
          course.name = stringSlice(course.name, 200)
        }
      }
    }
  );
  return Course;
};
