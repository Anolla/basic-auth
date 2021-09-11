"use strict";

module.exports = (capability) => {
  return (req, res, next) => {
    /// we should decode the jwt and get all the capabilities
    try {
      if (req.user.capabilities.includes(capability)) {
        console.log("ACL: User has capability: ", req.user.capabilities);
        next();
      } else {
        next("Access Denied");
      }
    } catch (e) {
      next("Invalid Login / No permission");
    }
  };
};
