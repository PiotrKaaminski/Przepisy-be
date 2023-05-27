const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("comments", {
        content: {
            type: Sequelize.STRING
        }
    });
}