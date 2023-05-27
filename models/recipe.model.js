const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("recipes", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        difficulty: {
            type: Sequelize.STRING
        },
        prepareMinutes: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.TEXT
        }
    });
}