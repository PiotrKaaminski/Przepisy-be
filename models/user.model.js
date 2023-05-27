const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });
}