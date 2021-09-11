'use strict';

const base64 = require('base-64');

module.exports = (users) => (req, res, next) => {
    if (!req.headers.authorization) {
        next('Invalid login');
        return;
    }
    // basic ajkldsfhlkdsjfds
    const encodedCredintials = req.headers.authorization.split(' ').pop();
    //username:password
    const [username, password] = base64.decode(encodedCredintials).split(':');

    users.authenticateBasic(username, password)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => next('Invalid login'));
}