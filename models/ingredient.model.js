const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("ingredients", {
        name: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        unit: {
            type: Sequelize.STRING
        }
    });
}