'use strict';
var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Invalid name. Must be between 1 and 99 characters.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address.'
        }
      }
    },
    password: {
    type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters.'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(pendingUser, options){
        if (pendingUser && pendingUser.password) {
          var hash = bcrypt.hashSync(pendingUser.password, 10);
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // here we check the entered password against the hashed pw in the db
    user.prototype.validPassword = function(passwordTyped) {
      return bcrypt.compareSync(passwordTyped, this.password);
    };
    //this removes the password for serializing
    user.prototype.toJSON = function() {
      var userData = this.get();
      delete userData.password;
      return userData;
    }
  };
  return user;
};
