"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Subscription);
      User.belongsToMany(models.Course, {
        through: models.Subscription,
        foreignKey: "CourseId",
      });
      User.hasOne(models.UserProfile)
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username cannot be empty",
          args: true
        },
        notNull: {
          msg: "Username cannot be null",
          args: true
        },
        len: {
          args: [3, 20],
          msg: "Username must be between 3 and 20 characters"
        }
      }

    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty",
          args: true
        },
        notNull: {
          msg: "Password cannot be null",
          args: true
        },
        len: {
          args: [6, 20],
          msg: "Password must be between 6 and 20 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email cannot be empty",
          args: true
        },
        notNull: {
          msg: "Email cannot be null",
          args: true
        },
        isEmail: {
          args: true,
          msg: "Email must be valid"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member',
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashedPassword;
      }
    }
  });
  return User;
};