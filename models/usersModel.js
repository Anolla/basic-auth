"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "super-secret";

const users = (sequelize, DataTypes) => {
  const model = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "writer", "editor", "admin"),
      defaultValue: "user",
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ["read"],
          writer: ["read", "create"],
          editor: ["read", "create", "update"],
          admin: ["read", "create", "update", "delete"],
        };
        return acl[this.role];
      },
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        // console.log(">>>>>>>>>>>>>>>>>>>", this.capabilities);
        return jwt.sign(
          {
            username: this.username,
            capabilities: this.capabilities, // this is the perfarable way in order to check the permissions
          },
          SECRET,
          { expiresIn: "1h" }
        );
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  });

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    // we need to check if null.

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    }

    throw new Error("Invalid user");
  };

  model.authenticateBearer = async function (token) {
    const verifiedToken = jwt.verify(token, SECRET);

    //if not verfiied you need to throw an error
    const user = await this.findOne({
      where: { username: verifiedToken.username },
    });

    if (user) {
      return user;
    }
    throw new Error("Invalid user");
  };

  return model;
};

module.exports = users;
